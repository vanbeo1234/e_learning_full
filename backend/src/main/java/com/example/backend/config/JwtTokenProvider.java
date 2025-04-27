package com.example.backend.config;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.KeyPair;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.security.NoSuchAlgorithmException;

/**
 * Xử lý JWT: tạo, xác thực và giải mã token sử dụng RSA.
 */
@Component
public class JwtTokenProvider {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final JwtProperties jwtProperties;

    /**
     * Constructor để khởi tạo JwtTokenProvider.
     * 
     * @param rsaKeyConfig  Cấu hình RSA chứa KeyPair.
     * @param jwtProperties Các thuộc tính cấu hình JWT.
     * @throws NoSuchAlgorithmException Nếu không tìm thấy thuật toán tạo key pair.
     */
    public JwtTokenProvider(RsaKeyConfig rsaKeyConfig, JwtProperties jwtProperties) throws NoSuchAlgorithmException {
        KeyPair keyPair = rsaKeyConfig.rsaKeyPair();
        this.privateKey = rsaKeyConfig.getPrivateKey(keyPair);
        this.publicKey = rsaKeyConfig.getPublicKey(keyPair);
        this.jwtProperties = jwtProperties;
    }

    /**
     * Sinh JWT token từ thông tin người dùng.
     * 
     * @param userCode Mã người dùng.
     * @param roleId   Mã vai trò của người dùng.
     * @return JWT token.
     */
    public String generateToken(String userCode, int roleId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpiration());

        return Jwts.builder()
                .setSubject(userCode)
                .claim("roleId", roleId)
                .claim("authorities", List.of(getAuthorityByRoleId(roleId)))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * Trả về chuỗi authority tương ứng với roleId.
     * 
     * @param roleId Mã vai trò.
     * @return Authority tương ứng với vai trò.
     */
    private String getAuthorityByRoleId(int roleId) {
        return switch (roleId) {
            case 1 -> "ROLE_ADMIN";
            case 2 -> "ROLE_INSTRUCTOR";
            case 3 -> "ROLE_STUDENT";
            default -> "ROLE_UNKNOWN";
        };
    }

    /**
     * Kiểm tra tính hợp lệ của token.
     * 
     * @param token JWT token cần kiểm tra.
     * @return true nếu token hợp lệ, false nếu không hợp lệ.
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Lấy mã người dùng từ JWT.
     * 
     * @param token JWT token.
     * @return Mã người dùng.
     */
    public String getUserCodeFromToken(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * Lấy mã vai trò từ JWT.
     * 
     * @param token JWT token.
     * @return Mã vai trò.
     */
    public int getRoleIdFromToken(String token) {
        return parseToken(token).get("roleId", Integer.class);
    }

    /**
     * Phân tích token và trả về payload (claims).
     * 
     * @param token JWT token cần phân tích.
     * @return Claims (payload) từ token.
     */
    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey) // Dùng publicKey để xác thực JWT
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Tách token từ header Authorization.
     * 
     * @param authHeader Header Authorization chứa token.
     * @return Token nếu tìm thấy, null nếu không có.
     */
    public String resolveToken(String authHeader) {
        String prefix = jwtProperties.getPrefix() + " ";
        if (authHeader != null && authHeader.startsWith(prefix)) {
            return authHeader.substring(prefix.length());
        }
        return null;
    }

    /**
     * Mã hóa mật khẩu người dùng bằng RSA public key.
     * 
     * @param password Mật khẩu người dùng.
     * @return Mật khẩu đã được mã hóa.
     */
    public String encryptPassword(String password) {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encryptedBytes = cipher.doFinal(password.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi mã hóa mật khẩu", e);
        }
    }

    /**
     * Giải mã mật khẩu người dùng từ cơ sở dữ liệu (sử dụng private key RSA).
     * 
     * @param encryptedPassword Mật khẩu đã mã hóa.
     * @return Mật khẩu đã giải mã.
     */
    public String decryptPassword(String encryptedPassword) {
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedPassword);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi giải mã mật khẩu", e);
        }
    }

    /**
     * Lấy public key dưới dạng chuỗi Base64.
     * 
     * @param publicKey Public key cần chuyển đổi.
     * @return Public key dưới dạng chuỗi Base64.
     */
    public String getPublicKeyAsString(PublicKey publicKey) {
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }
}
