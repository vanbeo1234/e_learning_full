package com.example.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonCommentResp {
    private String courseName;
    private String senderCode;
    private String senderName;
    private String message;
    private LocalDateTime commentTime;
}