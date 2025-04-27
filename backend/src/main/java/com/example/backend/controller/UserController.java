package com.example.backend.controller;

import com.example.backend.dto.response.UserResp;
import com.example.backend.dto.request.UserReq;
import com.example.backend.dto.request.UserInfoUpdateReq;
import com.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.backend.model.User;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

/**
 * Controller cho các yêu cầu liên quan đến người dùng.
 * Bao gồm các API để lấy danh sách người dùng, tìm kiếm người dùng và cập nhật
 * thông tin người dùng.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/v1/api/user")
public class UserController {
    private final UserService userService;

    /**
     * Constructor của UserController.
     * 
     * @param userService Dịch vụ để xử lý các hoạt động liên quan đến người dùng.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * API Lấy danh sách người dùng với phân trang.
     * 
     * @param page Số trang cần lấy (mặc định là 0).
     * @param size Kích thước mỗi trang (mặc định là 10).
     * @return ResponseEntity chứa danh sách người dùng và thông tin phân trang.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDateTime dateOfBirth,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) String statusCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserResp> resultPage;

        // Nếu không có tiêu chí tìm kiếm nào, gọi hàm getAll
        if (name == null && dateOfBirth == null && roleId == null && statusCode == null) {
            resultPage = userService.getAllUsers(pageable);
        } else {
            resultPage = userService.searchUsers(name, dateOfBirth, roleId != null ? roleId : 0, statusCode, pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("errorStatus", 900);
        response.put("message", "Lấy danh sách người dùng thành công");
        response.put("data", resultPage.getContent());
        response.put("pagination", Map.of(
                "totalPages", resultPage.getTotalPages(),
                "totalItems", resultPage.getTotalElements(),
                "currentPage", resultPage.getNumber()));

        return ResponseEntity.ok(response);
    }

    /**
     * API Cập nhật thông tin người dùng theo mã người dùng.
     * 
     * @param request Đối tượng yêu cầu cập nhật thông tin người dùng.
     * @return ResponseEntity chứa kết quả cập nhật thông tin người dùng.
     * @throws IllegalArgumentException nếu người dùng không tồn tại.
     * @throws Exception                nếu có lỗi hệ thống trong quá trình cập
     *                                  nhật.
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody UserReq request) {
        try {

            Optional<User> optionalUser = userService.findByUserCode(request.getUserCode());
            User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found"));

            UserInfoUpdateReq updateReq = new UserInfoUpdateReq();
            updateReq.setPhone(request.getPhone());
            updateReq.setAddress(request.getAddress());
            updateReq.setStatusCode(request.getStatusCode());
            updateReq.setExperience(request.getExperience());
            updateReq.setCertification(request.getCertification());

            userService.updateUserInfo(request.getUserCode(), updateReq);

            Map<String, Object> response = new HashMap<>();
            response.put("errorStatus", 900);
            response.put("message", "Cập nhật thông tin thành công");
            response.put("data", UserResp.fromUser(user));

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("errorStatus", 901);
            errorResponse.put("message", "Dữ liệu không hợp lệ: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("errorStatus", 902);
            errorResponse.put("message", "Lỗi hệ thống, vui lòng thử lại sau");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/by-role")
    public List<UserResp> getUsersByRole(@RequestParam Integer roleId) {
        return userService.getUsersByRole(roleId);
    }


}
