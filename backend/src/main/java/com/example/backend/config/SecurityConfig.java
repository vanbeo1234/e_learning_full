package com.example.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * Cấu hình bảo mật cho hệ thống:
 * - Cho phép truy cập tự do vào /auth/**
 * - Yêu cầu ROLE_ADMIN cho /users/**
 * - Bắt buộc xác thực với các endpoint còn lại
 */
@Configuration
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Constructor của lớp SecurityConfig.
     *
     * @param jwtTokenProvider Cung cấp các phương thức xác thực và tạo JWT.
     */

    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Cấu hình filter chính cho Spring Security.
     *
     * @param http HttpSecurity để cấu hình các yêu cầu bảo mật cho ứng dụng.
     * @return Cấu hình bảo mật cho ứng dụng.
     * @throws Exception nếu có lỗi trong quá trình cấu hình bảo mật.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/v1/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/api/user").permitAll()
                        .requestMatchers("/v1/api/user/**").hasAnyRole("ADMIN")
                        .requestMatchers("/v1/api/course/**").hasAnyRole("ADMIN", "INSTRUCTOR", "STUDENT")
                        .requestMatchers("/v1/api/lesson/**").hasAnyRole("ADMIN", "INSTRUCTOR")
                        .requestMatchers("/v1/api/course/filter").hasAnyRole("INSTRUCTOR")
                        .requestMatchers("/v1/api/comment/**").hasAnyRole("INSTRUCTOR", "STUDENT")
                        .requestMatchers("/v1/api/student/**").hasAnyRole("STUDENT")
                        .anyRequest().authenticated())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedEntryPoint()));

        http.addFilterBefore(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    @NonNull HttpServletRequest request,
                    @NonNull HttpServletResponse response,
                    @NonNull FilterChain filterChain) throws ServletException, IOException {
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    try {
                        if (jwtTokenProvider.validateToken(token)) {
                            String userCode = jwtTokenProvider.getUserCodeFromToken(token);
                            int roleId = jwtTokenProvider.getRoleIdFromToken(token);

                            String roleName = switch (roleId) {
                                case 1 -> "ADMIN";
                                case 2 -> "INSTRUCTOR";
                                case 3 -> "STUDENT";
                                default -> null;
                            };

                            if (roleName != null) {
                                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        userCode,
                                        null,
                                        Collections.singleton(() -> "ROLE_" + roleName));
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            }
                        }
                    } catch (Exception e) {

                    }
                }
                filterChain.doFilter(request, response);
            }

        }, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Trả về lỗi 401 nếu token không hợp lệ hoặc không có token trong request.
     *
     * @return AuthenticationEntryPoint xử lý lỗi xác thực khi token không hợp lệ.
     */
    @Bean
    public AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (HttpServletRequest request, HttpServletResponse response,
                AuthenticationException authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Unauthorized: Token không hợp lệ hoặc thiếu");
    }

    /**
     * Cấu hình mã hóa mật khẩu người dùng bằng thuật toán BCrypt.
     *
     * @return PasswordEncoder sử dụng BCryptPasswordEncoder để mã hóa mật khẩu.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
