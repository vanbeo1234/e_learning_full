package com.example.backend.service;

import com.example.backend.dto.request.UserInfoUpdateReq;
import com.example.backend.dto.request.UserRegisterReq;
import com.example.backend.dto.response.UserResp;
import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserService {

        /**
         * Lấy toàn bộ danh sách người dùng với phân trang.
         * 
         * @param pageable Đối tượng phân trang chứa thông tin về số trang và kích thước
         *                 mỗi trang
         * @return Một trang danh sách các người dùng dưới dạng `UserResp`
         */
        Page<UserResp> getAllUsers(Pageable pageable);

        /**
         * Tìm kiếm người dùng theo các tiêu chí như tên, ngày sinh, vai trò và trạng
         * thái.
         * 
         * @param name        Tên người dùng (tùy chọn)
         * @param dateOfBirth Ngày sinh người dùng (tùy chọn)
         * @param roleId      Vai trò của người dùng (tùy chọn)
         * @param statusCode  Mã trạng thái của người dùng (tùy chọn)
         * @param pageable    Đối tượng phân trang chứa thông tin về số trang và kích
         *                    thước mỗi trang
         * @return Một trang danh sách các người dùng dưới dạng `UserResp` dựa trên tiêu
         *         chí tìm kiếm
         */
        Page<UserResp> searchUsers(String name, LocalDateTime dateOfBirth, Integer roleId, String statusCode,
                        Pageable pageable);

        /**
         * Cập nhật thông tin người dùng dựa trên userCode và đối tượng
         * `UserInfoUpdateReq`.
         * 
         * @param userCode  Mã người dùng cần cập nhật
         * @param updateReq Đối tượng chứa các thông tin cần cập nhật
         */
        void updateUserInfo(String userCode, UserInfoUpdateReq updateReq);

        /**
         * Kiểm tra sự tồn tại của email trong hệ thống (dùng cho đăng ký và đăng nhập).
         * 
         * @param email Địa chỉ email cần kiểm tra
         * @return `true` nếu email đã tồn tại, ngược lại trả về `false`
         */
        boolean existsByEmail(String email);

        /**
         * Kiểm tra sự tồn tại của mã người dùng trong hệ thống (dùng cho đăng ký và
         * đăng nhập).
         * 
         * @param userCode Mã người dùng cần kiểm tra
         * @return `true` nếu mã người dùng đã tồn tại, ngược lại trả về `false`
         */
        boolean existsByUserCode(String userCode);

        /**
         * Tìm người dùng theo mã người dùng (userCode).
         * 
         * @param userCode Mã người dùng cần tìm
         * @return Optional chứa người dùng nếu tìm thấy, hoặc Optional.empty() nếu
         *         không tìm thấy
         */
        Optional<User> findByUserCode(String userCode);

        /**
         * Tìm người dùng theo mã người dùng (userCode).
         * 
         * @param userCode Mã người dùng cần tìm
         * @return Optional chứa người dùng nếu tìm thấy, hoặc Optional.empty() nếu
         *         không tìm thấy
         */
        UserResp getUserRespByCode(String userCode); // Trả DTO

        /**
         * Lưu đối tượng người dùng vào cơ sở dữ liệu.
         * 
         * @param user Đối tượng người dùng cần lưu
         */

        void save(User user);

        /**
         * Tạo người dùng mới.
         *
         * @param req               Thông tin đăng ký người dùng.
         * @param encryptedPassword Mật khẩu đã mã hóa.
         * @param publicKeyString   Khóa công khai RSA.
         * @return Đối tượng User đã được tạo và lưu vào cơ sở dữ liệu.
         */
        User createUser(UserRegisterReq req, String encryptedPassword, String publicKeyString);

        List<UserResp> getUsersByRole(Integer roleId);
}
