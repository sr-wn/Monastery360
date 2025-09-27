package com.monastery360.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        Map<String, Object> body = new HashMap<>();
        if (authentication == null || !(authentication.getPrincipal() instanceof DefaultOAuth2User)) {
            body.put("authenticated", false);
            return ResponseEntity.ok(body);
        }
        DefaultOAuth2User user = (DefaultOAuth2User) authentication.getPrincipal();
        body.put("authenticated", true);
        body.put("name", user.getAttribute("name"));
        body.put("email", user.getAttribute("email"));
        body.put("picture", user.getAttribute("picture"));
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Clear auth cookie if any (placeholder for JWT cookie setups)
        ResponseCookie clear = ResponseCookie.from("AUTH", "")
                .httpOnly(true).secure(true).path("/").maxAge(0).sameSite("Lax").build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, clear.toString()).build();
    }
}















