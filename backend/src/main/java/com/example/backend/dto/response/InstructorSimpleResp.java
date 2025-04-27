package com.example.backend.dto.response;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InstructorSimpleResp {
    private String userCode;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime dateOfBirth;
    private int roleId;

    private String statusCode;
    private Integer experience;

    public InstructorSimpleResp(String userCode, String name, String email, String phone,
            LocalDateTime dateOfBirth, int roleId, String statusCode, Integer experience) {
        this.userCode = userCode;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.roleId = roleId;
        this.statusCode = statusCode;
        this.experience = experience;
    }

}
