package com.monastery360.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.monastery360.security.JwtAuthFilter;
import com.monastery360.security.JwtUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class SecurityConfig {

    private final String frontendOrigin;
    private final String jwtSecret;
    private final long jwtTtlMs;

    public SecurityConfig(Environment env) {
        this.frontendOrigin = env.getProperty("app.frontend-origin", "http://localhost:3000");
        this.jwtSecret = env.getProperty("app.jwt.secret", "");
        String ttl = env.getProperty("app.jwt.ttl-ms", "2592000000");
        this.jwtTtlMs = Long.parseLong(ttl);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtUtil jwtUtil = new JwtUtil(jwtSecret, jwtTtlMs);
        JwtAuthFilter jwtFilter = new JwtAuthFilter(jwtUtil);
        http
            .csrf().disable()
            .cors().and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/health", "/api/auth/me", "/api/auth/logout", "/").permitAll()
                .anyRequest().permitAll()
            .and()
            .oauth2Login().successHandler(oauthSuccessHandler(jwtUtil))
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private AuthenticationSuccessHandler oauthSuccessHandler(JwtUtil jwtUtil) {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            if (authentication.getPrincipal() instanceof DefaultOAuth2User) {
                DefaultOAuth2User user = (DefaultOAuth2User) authentication.getPrincipal();
                Map<String, Object> claims = new HashMap<>();
                claims.put("email", user.getAttribute("email"));
                claims.put("name", user.getAttribute("name"));
                claims.put("picture", user.getAttribute("picture"));
                String token = jwtUtil.generateToken((String) user.getAttribute("email"), claims);
                ResponseCookie cookie = ResponseCookie.from("AUTH", token)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(jwtTtlMs / 1000)
                        .sameSite("Lax")
                        .build();
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            }
            response.sendRedirect(frontendOrigin);
        };
    }
}


