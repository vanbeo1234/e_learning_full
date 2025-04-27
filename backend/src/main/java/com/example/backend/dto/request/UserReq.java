package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReq {

    private String userCode;
    private String password;

    private String phone;
    private String address;
    private String statusCode;
    private Integer experience;
    private String certification;
}
