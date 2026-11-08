import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit 
} from "firebase/firestore";
import { db } from "./firebase";
import { TeamRoster, RosterSlot, getRoleMultiplier } from "../types/basketball";
import { PrivateLeague, LeagueMember, GlobalRankingEntry } from "../types/league";

// Helper keys for local caching
const getStorageKey = (userId?: string | null) => 
  userId ? `zona_pintada_roster_${userId}` : "zona_pintada_roster_guest";

/**
 * Save or bootstrap user profile and franchise record to Firestore "users" and "franchises" collection
 */
export async function syncUserProfile(user: { uid: string; email?: string | null; displayName?: string | null }): Promise<void> {
  if (!user.uid) return;
  const displayName = user.displayName || user.email?.split("@")[0] || "Entrenador LNB";
  const defaultFranchiseName = localStorage.getItem(`zona_pintada_team_name_${user.uid}`) || `Franquicia de ${displayName}`;

  try {
    // 1. Sync to users collection
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName,
      franchiseName: defaultFranchiseName,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });

    // 2. Also ensure document exists in franchises collection so it shows up in Firestore console and ranking
    const franchiseRef = doc(db, "franchises", user.uid);
    const existingSnap = await getDoc(franchiseRef);
    if (!existingSnap.exists()) {
      await setDoc(franchiseRef, {
        userId: user.uid,
        franchiseName: defaultFranchiseName,
        ownerName: displayName,
        email: user.email || "",
        projectedPoints: 0.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Could not sync user profile to Firestore (check Firestore Rules / permissions):", err);
  }
}

/**
 * Save user roster to Firestore (if logged in) and update localStorage cache
 */
export async function saveRoster(
  userId: string | null | undefined, 
  roster: TeamRoster,
  userDisplayName?: string | null
): Promise<{ success: boolean; cloudSynced: boolean; error?: string }> {
  // Always cache locally first for instant access & offline guarantee
  const localKey = getStorageKey(userId);
  try {
    localStorage.setItem(localKey, JSON.stringify(roster));
    if (roster.teamName && userId) {
      localStorage.setItem(`zona_pintada_team_name_${userId}`, roster.teamName);
    }
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }

  // If not logged in, only local storage is available
  if (!userId) {
    return { success: true, cloudSynced: false };
  }

  // Calculate tactical projected points from roster
  let projectedValuation = 0;
  if (roster.starters) {
    (Object.values(roster.starters) as RosterSlot[]).forEach((slot) => {
      if (slot.player) {
        const mult = getRoleMultiplier(slot.role, true);
        projectedValuation += slot.player.avgVal * mult;
      }
    });
  }
  if (roster.bench) {
    roster.bench.forEach((slot) => {
      if (slot.player) {
        const mult = getRoleMultiplier(slot.role, false);
        projectedValuation += slot.player.avgVal * mult;
      }
    });
  }

  // Persist to Cloud Firestore in "franchises" collection
  try {
    const docRef = doc(db, "franchises", userId);
    await setDoc(docRef, {
      roster,
      franchiseName: roster.teamName || "Mi Franquicia LNB",
      ownerName: userDisplayName || "Entrenador Oficial",
      projectedPoints: Math.round(projectedValuation * 10) / 10,
      updatedAt: new Date().toISOString(),
      userId
    }, { merge: true });
    
    // Also mirror to users collection so any search query finds it immediately
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      uid: userId,
      displayName: userDisplayName || "Entrenador Oficial",
      franchiseName: roster.teamName || "Mi Franquicia LNB",
      projectedPoints: Math.round(projectedValuation * 10) / 10,
      hasRoster: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true, cloudSynced: true };
  } catch (err: any) {
    console.error("Firestore saveRoster error:", err);
    return { success: true, cloudSynced: false, error: err?.message || String(err) };
  }
}

/**
 * Load user roster: attempts to load latest from Firestore; falls back to localStorage
 */
export async function loadRoster(userId: string | null | undefined): Promise<TeamRoster | null> {
  const localKey = getStorageKey(userId);
  let localData: TeamRoster | null = null;

  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      localData = JSON.parse(cached);
    } else if (userId) {
      const guestCached = localStorage.getItem("zona_pintada_roster_guest");
      if (guestCached) {
        localData = JSON.parse(guestCached);
      }
    }
  } catch (e) {
    console.warn("Error reading localStorage", e);
  }

  if (!userId) {
    return localData;
  }

  try {
    const docRef = doc(db, "franchises", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.roster) {
        const cloudRoster = data.roster as TeamRoster;
        try {
          localStorage.setItem(localKey, JSON.stringify(cloudRoster));
        } catch (_) {}
        return cloudRoster;
      }
    }
  } catch (err) {
    console.warn("Could not fetch from Firestore, using local fallback", err);
  }

  return localData;
}

export interface RealRankingUser {
  id: string;
  rank: number;
  teamName: string;
  ownerName: string;
  totalPoints: number;
  matchdayPoints: number;
  favoriteClub: string;
  isCurrentUser?: boolean;
  email?: string;
}

/**
 * Fetch all real registered users & franchises from Firestore in real-time
 */
export async function fetchRealUsersAndFranchises(currentUserId?: string | null): Promise<RealRankingUser[]> {
  try {
    const results: RealRankingUser[] = [];
    const seenIds = new Set<string>();

    // 1. Fetch from 'franchises' collection
    try {
      const franchisesSnap = await getDocs(collection(db, "franchises"));
      franchisesSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;
        seenIds.add(id);

        const teamName = data.franchiseName || data.roster?.teamName || "Franquicia LNB";
        const ownerName = data.ownerName || data.email?.split("@")[0] || "Entrenador LNB";
        const points = typeof data.projectedPoints === "number" ? data.projectedPoints : 0.0;
        const matchday = Math.round(points * 0.7 * 10) / 10;

        results.push({
          id,
          rank: 1,
          teamName,
          ownerName,
          totalPoints: points,
          matchdayPoints: matchday,
          favoriteClub: "LNB Oficial",
          isCurrentUser: currentUserId === id,
          email: data.email
        });
      });
    } catch (e) {
      console.warn("Error reading franchises collection", e);
    }

    // 2. Fetch from 'users' collection to catch registered users even if they haven't saved a roster yet
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        if (!seenIds.has(id)) {
          seenIds.add(id);
          const ownerName = data.displayName || data.email?.split("@")[0] || "Usuario Registrado";
          const teamName = data.franchiseName || `Equipo de ${ownerName}`;

          results.push({
            id,
            rank: 1,
            teamName,
            ownerName,
            totalPoints: data.projectedPoints || 0.0,
            matchdayPoints: 0.0,
            favoriteClub: "LNB Oficial",
            isCurrentUser: currentUserId === id,
            email: data.email
          });
        }
      });
    } catch (e) {
      console.warn("Error reading users collection", e);
    }

    // Sort by totalPoints descending
    results.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign ranking numbers
    results.forEach((item, index) => {
      item.rank = index + 1;
    });

    return results;
  } catch (err) {
    console.error("Failed to fetch real users from Firestore:", err);
    return [];
  }
}

/**
 * Save or sync a private league to Firestore
 */
export async function saveLeagueToCloud(league: PrivateLeague): Promise<boolean> {
  try {
    const leagueRef = doc(db, "leagues", league.id);
    await setDoc(leagueRef, {
      ...league,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn("Could not save league to Firestore:", e);
    return false;
  }
}

/**
 * Join a private league in Firestore by invitation code
 */
export async function joinLeagueByCodeInCloud(
  code: string, 
  newMember: LeagueMember
): Promise<{ success: boolean; league?: PrivateLeague; error?: string }> {
  try {
    const leaguesRef = collection(db, "leagues");
    const q = query(leaguesRef, where("code", "==", code.toUpperCase().trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: "No se encontró ninguna liga con este código." };
    }

    const leagueDoc = snapshot.docs[0];
    const leagueData = leagueDoc.data() as PrivateLeague;

    const alreadyMember = leagueData.members?.some(m => m.id === newMember.id);
    if (!alreadyMember) {
      const updatedMembers = [...(leagueData.members || []), newMember];
      await updateDoc(leagueDoc.ref, {
        members: updatedMembers,
        membersCount: updatedMembers.length,
        updatedAt: new Date().toISOString()
      });
      return { 
        success: true, 
        league: { 
          ...leagueData, 
          members: updatedMembers, 
          membersCount: updatedMembers.length 
        } 
      };
    }

    return { success: true, league: leagueData };
  } catch (e) {
    console.warn("Firestore league query error:", e);
    return { success: false, error: "Error de conexión con la base de datos." };
  }
}

/**
 * Updates the user's franchise name in Firestore and local storage cache
 */
export async function updateFranchiseName(
  userId: string | null | undefined, 
  newName: string
): Promise<{ success: boolean; cloudSynced: boolean }> {
  const cleanName = newName.trim();
  if (!cleanName) return { success: false, cloudSynced: false };

  const localKey = getStorageKey(userId);
  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      const parsed: TeamRoster = JSON.parse(cached);
      parsed.teamName = cleanName;
      localStorage.setItem(localKey, JSON.stringify(parsed));
    }
    if (userId) {
      localStorage.setItem(`zona_pintada_team_name_${userId}`, cleanName);
    }
  } catch (e) {
    console.warn("Could not update franchise name locally", e);
  }

  if (!userId) {
    return { success: true, cloudSynced: false };
  }

  try {
    const docRef = doc(db, "franchises", userId);
    await setDoc(docRef, {
      franchiseName: cleanName,
      "roster.teamName": cleanName,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      franchiseName: cleanName,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true, cloudSynced: true };
  } catch (e) {
    console.warn("Could not update franchise name in Firestore", e);
    return { success: true, cloudSynced: false };
  }
}
