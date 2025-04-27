package com.example.backend.service;

import com.example.backend.repository.UserRepository;
import com.example.backend.config.JwtTokenProvider;
import com.example.backend.config.RsaKeyConfig;
import com.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.time.LocalDate;

/**
 * Dịch vụ khởi tạo tài khoản admin gốc (admin001) khi ứng dụng khởi động.
 * Tài khoản này sẽ được tạo ra tự động nếu chưa tồn tại trong cơ sở dữ liệu.
 */
@Service
public class AdminService {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RsaKeyConfig rsaKeyConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Khởi tạo tài khoản admin gốc (admin001) nếu chưa tồn tại trong cơ sở dữ liệu.
     * Tạo mật khẩu đã mã hóa bằng BCrypt, tạo cặp khóa RSA mới và lưu thông tin tài
     * khoản admin vào cơ sở dữ liệu.
     * Nếu có lỗi xảy ra trong quá trình tạo tài khoản, thông báo lỗi sẽ được ghi
     * vào console.
     */
    public void createAdminAccount() {
        try {

            String password = "admin_password";

            String encryptedPassword = passwordEncoder.encode(password);

            KeyPair keyPair = rsaKeyConfig.rsaKeyPair();
            String encryptionKey = jwtTokenProvider.getPublicKeyAsString(keyPair.getPublic());

            User user = new User();
            user.setUserCode("admin001");
            user.setName("Admin Gốc");
            user.setEmail("admin@system.com");
            user.setPassword(encryptedPassword);
            user.setPhone("1234567890");
            user.setAddress("Ha Noi, Vietnam");
            user.setGender(0);
            user.setDateOfBirth(LocalDate.of(1990, 1, 1).atStartOfDay());
            user.setRoleId(1);
            user.setStatusCode("ACTIVE");
            user.setCreatedBy("SYSTEM");
            user.setEncryptionKey(encryptionKey);

            userRepository.save(user);

            System.out.println("Admin account created successfully with password: " + password);

        } catch (Exception e) {
            System.err.println(" Error creating admin account: " + e.getMessage());
        }
    }


}
