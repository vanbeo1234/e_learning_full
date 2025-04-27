package com.example.backend.service.implement;

import org.springframework.transaction.annotation.Transactional;
import com.example.backend.dto.request.UserInfoUpdateReq;
import com.example.backend.dto.response.UserResp;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.backend.dto.request.UserRegisterReq;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.backend.common.util.DateTimeUtil.formatDate;

/**
 * Triển khai các chức năng liên quan đến người dùng.
 * <p>
 * Các chức năng chính bao gồm:
 * - Lấy danh sách người dùng với phân trang.
 * - Tìm kiếm người dùng theo các tiêu chí như tên, ngày sinh, vai trò, và trạng
 * thái.
 * - Cập nhật thông tin người dùng.
 * - Kiểm tra sự tồn tại của người dùng theo email hoặc mã người dùng.
 * - Tạo người dùng mới.
 * </p>
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /**
     * Constructor cho UserServiceImpl.
     *
     * @param userRepository Repository xử lý người dùng.
     */
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lấy danh sách người dùng với phân trang.
     *
     * @param pageable Thông tin phân trang (số trang và kích thước trang).
     * @return Danh sách người dùng phân trang dưới dạng {@link Page<UserResp>}.
     */
    @Override
    public Page<UserResp> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> UserResp.builder()
                        .userCode(user.getUserCode())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .address(user.getAddress())
                        .dateOfBirth(formatDate(user.getDateOfBirth().toLocalDate())) // ISO yyyy-MM-dd
                        .role(UserResp.getRoleText(user.getRoleId()))
                        .gender(UserResp.getGenderText(user.getGender()))
                        .statusCode(user.getStatusCode())
                        .experience(user.getExperience())
                        .certification(user.getCertification())
                        .build());
    }

    /**
     * Tìm kiếm người dùng theo các tiêu chí như tên, ngày sinh, vai trò, và trạng
     * thái.
     *
     * @param name        Tên người dùng cần tìm kiếm.
     * @param dateOfBirth Ngày sinh của người dùng.
     * @param roleId      Vai trò người dùng.
     * @param statusCode  Trạng thái của người dùng.
     * @param pageable    Thông tin phân trang.
     * @return Kết quả tìm kiếm người dùng dưới dạng {@link Page<UserResp>}.
     */
    @Override
    public Page<UserResp> searchUsers(String name, LocalDateTime dateOfBirth, Integer roleId, String statusCode,
            Pageable pageable) {
        return userRepository.findByCriteria(name, dateOfBirth, roleId, statusCode, pageable)
                .map(user -> UserResp.builder()
                        .userCode(user.getUserCode())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .address(user.getAddress())
                        .dateOfBirth(formatDate(user.getDateOfBirth().toLocalDate()))
                        .role(UserResp.getRoleText(user.getRoleId()))
                        .gender(UserResp.getGenderText(user.getGender()))
                        .statusCode(user.getStatusCode())
                        .experience(user.getExperience())
                        .certification(user.getCertification())
                        .build());
    }

    /**
     * Cập nhật thông tin người dùng.
     *
     * @param userCode  Mã người dùng cần cập nhật.
     * @param updateReq Thông tin cập nhật người dùng.
     * @throws RuntimeException Nếu người dùng không tồn tại.
     */
    @Override
    public void updateUserInfo(String userCode, UserInfoUpdateReq updateReq) {
        User user = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new RuntimeException("User not found with code: " + userCode));

        user.setPhone(updateReq.getPhone());
        user.setAddress(updateReq.getAddress());
        user.setStatusCode(updateReq.getStatusCode());
        user.setExperience(updateReq.getExperience());
        user.setCertification(updateReq.getCertification());
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        userRepository.save(user);
    }

    /**
     * Kiểm tra sự tồn tại của người dùng theo email.
     *
     * @param email Địa chỉ email cần kiểm tra.
     * @return True nếu người dùng tồn tại, false nếu không.
     */
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Kiểm tra sự tồn tại của người dùng theo mã người dùng.
     *
     * @param userCode Mã người dùng cần kiểm tra.
     * @return True nếu người dùng tồn tại, false nếu không.
     */
    @Override
    public boolean existsByUserCode(String userCode) {
        return userRepository.existsByUserCode(userCode);
    }

    /**
     * Tìm người dùng theo mã người dùng.
     *
     * @param userCode Mã người dùng cần tìm.
     * @return Optional chứa người dùng tìm thấy, hoặc empty nếu không tìm thấy.
     */
    @Override
    public Optional<User> findByUserCode(String userCode) {
        return userRepository.findByUserCode(userCode);
    }

    /**
     * Lưu người dùng vào cơ sở dữ liệu.
     *
     * @param user Người dùng cần lưu.
     */
    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    /**
     * Lấy thông tin người dùng theo mã người dùng.
     *
     * @param userCode Mã người dùng cần tìm.
     * @return Thông tin người dùng dưới dạng {@link UserResp}, hoặc null nếu không
     *         tìm thấy.
     */
    @Override
    public UserResp getUserRespByCode(String userCode) {
        return userRepository.findByUserCode(userCode)
                .map(user -> UserResp.builder()
                        .userCode(user.getUserCode())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .address(user.getAddress())
                        .dateOfBirth(formatDate(user.getDateOfBirth().toLocalDate()))
                        .role(UserResp.getRoleText(user.getRoleId()))
                        .gender(UserResp.getGenderText(user.getGender()))
                        .statusCode(user.getStatusCode())
                        .experience(user.getExperience())
                        .certification(user.getCertification())
                        .build())
                .orElse(null);
    }

    /**
     * Tạo người dùng mới.
     *
     * @param req               Thông tin người dùng cần tạo.
     * @param encryptedPassword Mật khẩu đã được mã hóa.
     * @param publicKeyString   Khóa công khai của người dùng.
     * @return Đối tượng người dùng mới được tạo.
     * @throws RuntimeException Nếu có lỗi khi tạo người dùng.
     */
    @Override
    @Transactional
    public User createUser(UserRegisterReq req, String encryptedPassword, String publicKeyString) {

        userRepository.createUser(
                req.getUserCode(),
                encryptedPassword,
                req.getName(),
                req.getEmail(),
                req.getPhone(),
                req.getAddress(),
                req.getGender(),
                req.getDateOfBirth().atStartOfDay(),
                req.getRoleId(),
                req.getStatusCode(),
                req.getExperience(),
                req.getCertification(),
                req.getCreatedBy(),
                publicKeyString);

        return userRepository.findByUserCode(req.getUserCode())
                .orElseThrow(() -> new RuntimeException("User creation failed."));
    }

    @Override
    public List<UserResp> getUsersByRole(Integer roleId) {
        List<User> users = userRepository.findByRoleId(roleId);
        return users.stream()
                .map(UserResp::fromUser)
                .collect(Collectors.toList());
    }
}
