package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginationResp {
    private int currentPage;
    private int totalPages;
    private long totalItems;
}
