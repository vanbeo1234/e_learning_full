package com.example.backend.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
public class InstructorResp {
    private Long id;
    private String name;
    private String userCode;
    private String email;
    private String phone;
    private LocalDateTime dateOfBirth;
    private int roleId;
    private String statusCode;
    private Integer experience;

    public InstructorResp(Long id, String name, String userCode, String email, String phone,
            LocalDateTime dateOfBirth, int roleId, String statusCode, Integer experience) {
        this.id = id;
        this.name = name;
        this.userCode = userCode;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.roleId = roleId;
        this.statusCode = statusCode;
        this.experience = experience;
    }
}
