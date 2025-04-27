package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import com.example.backend.common.util.DateTimeUtil;

import java.time.LocalDate;

@Getter
@Setter
public class UserRegisterReq {

    @NotEmpty(message = "User code is required")
    private String userCode;

    @NotEmpty(message = "Password is required")
    private String password;

    @NotEmpty(message = "Confirm password is required")
    private String confirmPassword;

    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Phone is required")
    private String phone;

    @NotEmpty(message = "Address is required")
    private String address;

    @NotEmpty(message = "Status is required")
    private String statusCode;

    private Integer gender;
    private Integer roleId;
    private Integer experience;
    private String certification;

    private LocalDate dateOfBirth;

    private String createdBy;

    /**
     * Set dateOfBirth from String using DateTimeUtil for validation and parsing.
     * 
     * @param dateStr Date string to be parsed.
     */
    public void setDateOfBirth(String dateStr) {
        this.dateOfBirth = DateTimeUtil.validateAndParseDate(dateStr);
    }
}
