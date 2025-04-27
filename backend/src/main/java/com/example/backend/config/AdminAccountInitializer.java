package com.example.backend.config;

import com.example.backend.service.AdminService;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

/**
 * Lớp này chịu trách nhiệm khởi tạo tài khoản Admin gốc khi ứng dụng được khởi
 * động.
 * Tài khoản Admin gốc sẽ được tạo tự động nếu chưa tồn tại trong cơ sở dữ liệu.
 * Lớp này sử dụng ContextRefreshedEvent để kích hoạt việc kiểm tra và tạo tài
 * khoản Admin.
 */
@Component
public class AdminAccountInitializer {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Phương thức được kích hoạt khi ứng dụng khởi động
     * Nó kiểm tra xem tài khoản admin gốc với mã "admin001" đã tồn tại trong cơ sở
     * dữ liệu hay chưa.
     * Nếu chưa tồn tại, tài khoản admin gốc sẽ được tạo tự động.
     */
    @EventListener(ContextRefreshedEvent.class)
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (!userRepository.existsByUserCode("admin001")) {
            adminService.createAdminAccount();
        }
    }
}
