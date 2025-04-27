package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ROLE_FUNCTION")
public class RoleFunction {

    @EmbeddedId
    private RoleFunctionId id;

    @ManyToOne
    @JoinColumn(name = "ROLE_ID", insertable = false, updatable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "FUNCTION_ID", insertable = false, updatable = false)
    private SystemFunction systemFunction;
}
