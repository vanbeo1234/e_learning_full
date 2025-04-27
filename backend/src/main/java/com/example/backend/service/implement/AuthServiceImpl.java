package com.example.backend.service.implement;

import com.example.backend.dto.request.UserRegisterReq;
import com.example.backend.dto.request.UserReq;
import com.example.backend.dto.response.AuthResp;
import com.example.backend.dto.response.UserResp;
import com.example.backend.model.User;
import com.example.backend.service.AuthService;
import com.example.backend.service.UserService;
import com.example.backend.config.JwtTokenProvider;
import com.example.backend.config.RsaKeyConfig;
import com.example.backend.common.Enum.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.KeyPair;

/**
 * Triển khai các chức năng xác thực người dùng (đăng ký và đăng nhập).
 * <p>
 * - Đăng ký người dùng mới.
 * - Đăng nhập người dùng và trả về token JWT.
 * </p>
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RsaKeyConfig rsaKeyConfig;

    /**
     * Đăng ký người dùng mới.
     * <p>
     * Kiểm tra thông tin đầu vào, nếu là Admin thì cần có token hợp lệ. Nếu không,
     * sẽ tạo tài khoản với thông tin đầu vào.
     * </p>
     *
     * @param req        Thông tin người dùng đăng ký.
     * @param authHeader Header chứa token của Admin nếu muốn đăng ký tài khoản
     *                   Admin.
     * @return Đối tượng AuthResp chứa kết quả đăng ký người dùng và token JWT nếu
     *         thành công.
     */
    @Override
    public AuthResp registerUser(UserRegisterReq req, String authHeader) {
        boolean isAdminRegistering = req.getRoleId() == Role.ADMIN.getValue();

        if (isAdminRegistering) {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return AuthResp.builder()
                        .errorStatus(906)
                        .message("Admin không thể tự đăng ký tài khoản.")
                        .build();
            }

            String token = authHeader.substring(7);
            if (!jwtTokenProvider.validateToken(token)) {
                return AuthResp.builder()
                        .errorStatus(907)
                        .message("Token không hợp lệ.")
                        .build();
            }

            int creatorRole = jwtTokenProvider.getRoleIdFromToken(token);
            if (creatorRole != Role.ADMIN.getValue()) {
                return AuthResp.builder()
                        .errorStatus(908)
                        .message("Chỉ Admin mới có quyền tạo tài khoản Admin.")
                        .build();
            }

            if (req.getCreatedBy() == null || req.getCreatedBy().trim().isEmpty()) {
                req.setCreatedBy(jwtTokenProvider.getUserCodeFromToken(token));
            }
        } else {
            if (req.getCreatedBy() == null || req.getCreatedBy().trim().isEmpty()) {
                req.setCreatedBy("self-register");
            }
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            return AuthResp.builder()
                    .errorStatus(905)
                    .message("Mật khẩu xác nhận không khớp.")
                    .build();
        }

        if (userService.existsByEmail(req.getEmail())) {
            return AuthResp.builder()
                    .errorStatus(909)
                    .message("Email đã tồn tại: " + req.getEmail())
                    .build();
        }

        if (userService.existsByUserCode(req.getUserCode())) {
            return AuthResp.builder()
                    .errorStatus(910)
                    .message("UserCode đã tồn tại: " + req.getUserCode())
                    .build();
        }

        try {
            KeyPair keyPair = rsaKeyConfig.rsaKeyPair();
            String publicKeyString = jwtTokenProvider.getPublicKeyAsString(keyPair.getPublic());

            String encryptedPassword = passwordEncoder.encode(req.getPassword());

            User user = userService.createUser(req, encryptedPassword, publicKeyString);

            String token = jwtTokenProvider.generateToken(user.getUserCode(), user.getRoleId());

            return AuthResp.builder()
                    .token(token)
                    .userCode(user.getUserCode())
                    .errorStatus(900)
                    .message("Đăng ký thành công")
                    .data(UserResp.fromUser(user))
                    .build();

        } catch (Exception e) {
            return AuthResp.builder()
                    .errorStatus(902)
                    .message("Lỗi hệ thống, vui lòng thử lại sau")
                    .build();
        }
    }

    /**
     * Đăng nhập người dùng và trả về token JWT.
     * <p>
     * Kiểm tra thông tin đầu vào và xác thực người dùng. Nếu thành công, trả về
     * token JWT cho người dùng.
     * </p>
     *
     * @param req Thông tin đăng nhập của người dùng.
     * @return Đối tượng AuthResp chứa thông tin người dùng và token JWT nếu đăng
     *         nhập thành công.
     */
    @Override
    public AuthResp loginUser(UserReq req) {
        try {
            return userService.findByUserCode(req.getUserCode())
                    .filter(user -> passwordEncoder.matches(req.getPassword(), user.getPassword()))
                    .map(user -> {
                        String token = jwtTokenProvider.generateToken(user.getUserCode(), user.getRoleId());
                        return AuthResp.builder()
                                .token(token)
                                .userCode(user.getUserCode())
                                .message("Đăng nhập thành công")
                                .errorStatus(900)
                                .data(UserResp.fromUser(user))
                                .build();
                    })
                    .orElseGet(() -> AuthResp.builder()
                            .message("Dữ liệu đầu vào không hợp lệ hoặc tài khoản không tồn tại")
                            .errorStatus(901)
                            .build());
        } catch (Exception e) {
            return AuthResp.builder()
                    .message("Lỗi hệ thống, vui lòng thử lại sau")
                    .errorStatus(902)
                    .build();
        }
    }
}
