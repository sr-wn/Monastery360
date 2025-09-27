package com.monastery360.security;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;

public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("AUTH".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            String authz = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authz != null && authz.startsWith("Bearer ")) {
                token = authz.substring(7);
            }
        }

        if (token != null) {
            try {
                Map<String, Object> claims = jwtUtil.parseClaims(token);
                String email = (String) claims.getOrDefault("email", claims.get("sub"));
                User principal = new User(email, "", Collections.emptyList());
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ignored) {}
        }

        filterChain.doFilter(request, response);
    }
}















