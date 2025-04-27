package com.example.backend.dto.response;

import com.example.backend.model.User;
import com.example.backend.common.util.DateTimeUtil;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResp {

    private Long id;
    private String userCode;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;
    private String role;
    private String statusCode;
    private Integer experience;
    private String certification;
    private String gender;

    /**
     * Chuyển đổi từ Entity User sang DTO UserResp
     *
     * @param user Entity người dùng
     * @return DTO phản hồi
     */
    public static UserResp fromUser(User user) {
        return UserResp.builder()
                .id(user.getId())
                .userCode(user.getUserCode())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth() != null
                        ? DateTimeUtil.formatDate(user.getDateOfBirth().toLocalDate())
                        : null)
                .role(getRoleText(user.getRoleId()))
                .statusCode(user.getStatusCode())
                .experience(user.getExperience())
                .certification(user.getCertification())
                .gender(getGenderText(user.getGender()))
                .build();
    }

    public static String getRoleText(int roleId) {
        return switch (roleId) {
            case 1 -> "Admin";
            case 2 -> "Giảng viên";
            case 3 -> "Học viên";
            default -> "Không xác định";
        };
    }

    public static String getGenderText(int gender) {
        return gender == 0 ? "Nam" : "Nữ";
    }
}
