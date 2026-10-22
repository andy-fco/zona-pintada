
package com.zonapintada.zona_pintada.dto;

public class LoginResponse {

    private final String token;
    private final String tipo;
    private final long expiraEn;

    public LoginResponse(String token, long expiraEn) {
        this.token = token;
        this.tipo = "Bearer";
        this.expiraEn = expiraEn;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }

    public long getExpiraEn() {
        return expiraEn;
    }
}
