package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class RoleFunctionId implements Serializable {

    @Column(name = "ROLE_ID")
    private int roleId;

    @Column(name = "FUNCTION_ID")
    private int functionId;
}
