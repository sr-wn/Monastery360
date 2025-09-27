package com.monastery360.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(String secret, long expirationMs) {
        if (secret == null || secret.length() < 32) {
            // Generate a key if none is provided (for dev). In prod, set APP_JWT_SECRET.
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        } else {
            this.key = Keys.hmacShaKeyFor(secret.getBytes());
        }
        this.expirationMs = expirationMs;
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key)
                .compact();
    }

    public Map<String, Object> parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
    }
}















