package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

        @Override
        @NonNull
        Page<User> findAll(@NonNull Pageable pageable);

        /**
         * Tìm người dùng theo mã người dùng.
         * 
         * @param userCode mã người dùng cần tìm
         * @return Optional<User> đối tượng người dùng nếu tìm thấy
         */
        Optional<User> findByUserCode(String userCode);

        /**
         * Kiểm tra sự tồn tại của người dùng qua email.
         * 
         * @param email Địa chỉ email cần kiểm tra
         * @return true nếu người dùng tồn tại, false nếu không
         */
        boolean existsByEmail(String email);

        /**
         * Kiểm tra sự tồn tại của người dùng qua mã người dùng.
         * 
         * @param userCode Mã người dùng cần kiểm tra
         * @return true nếu người dùng tồn tại, false nếu không
         */
        boolean existsByUserCode(String userCode);

        /**
         * Phương thức tạo người dùng mới bằng cách sử dụng query tùy chỉnh.
         * 
         * @param userCode      Mã người dùng
         * @param password      Mật khẩu đã mã hóa
         * @param name          Tên người dùng
         * @param email         Email người dùng
         * @param phone         Số điện thoại
         * @param address       Địa chỉ
         * @param gender        Giới tính
         * @param dateOfBirth   Ngày sinh
         * @param roleId        Vai trò người dùng
         * @param statusCode    Trạng thái người dùng
         * @param experience    Kinh nghiệm
         * @param certification Chứng chỉ
         * @param createdBy     Người tạo
         * @param encryptionKey Khóa mã hóa
         */
        @Modifying
        @Query("INSERT INTO User (userCode, password, name, email, phone, address, gender, dateOfBirth, roleId, statusCode, experience, certification, createdBy, encryptionKey) "
                        + "VALUES (:userCode, :password, :name, :email, :phone, :address, :gender, :dateOfBirth, :roleId, :statusCode, :experience, :certification, :createdBy, :encryptionKey)")
        void createUser(@Param("userCode") String userCode,
                        @Param("password") String password,
                        @Param("name") String name,
                        @Param("email") String email,
                        @Param("phone") String phone,
                        @Param("address") String address,
                        @Param("gender") Integer gender,
                        @Param("dateOfBirth") LocalDateTime dateOfBirth,
                        @Param("roleId") Integer roleId,
                        @Param("statusCode") String statusCode,
                        @Param("experience") Integer experience,
                        @Param("certification") String certification,
                        @Param("createdBy") String createdBy,
                        @Param("encryptionKey") String encryptionKey);

        /**
         * Tìm kiếm người dùng theo các tiêu chí như tên, ngày sinh, vai trò và trạng
         * thái.
         *
         * @param name        Tên người dùng (có thể null)
         * @param dateOfBirth Ngày sinh của người dùng (có thể null)
         * @param roleId      Vai trò người dùng (có thể null)
         * @param statusCode  Trạng thái người dùng (có thể null)
         * @param pageable    Thông tin phân trang
         * @return Kết quả tìm kiếm người dùng dưới dạng {@link Page<User>}
         */
        @Query("SELECT u FROM User u WHERE " +
                        "(:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
                        "(:dateOfBirth IS NULL OR u.dateOfBirth = :dateOfBirth) AND " +
                        "(:roleId IS NULL OR :roleId = 0 OR u.roleId = :roleId) AND " +
                        "(:statusCode IS NULL OR u.statusCode = :statusCode)")
        Page<User> findByCriteria(@Param("name") String name,
                        @Param("dateOfBirth") LocalDateTime dateOfBirth,
                        @Param("roleId") Integer roleId,
                        @Param("statusCode") String statusCode,
                        Pageable pageable);

        List<User> findByRoleId(Integer roleId);

        @Query("SELECT u FROM User u WHERE u.roleId = :roleId")
        List<User> findByRole(@Param("roleId") int roleId);
}
