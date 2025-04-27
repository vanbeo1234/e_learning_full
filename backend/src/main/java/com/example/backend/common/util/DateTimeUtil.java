package com.example.backend.common.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final DateTimeFormatter ISO_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Xác thực và phân tích chuỗi ngày theo định dạng "yyyy-MM-dd" thành đối tượng
     * LocalDate.
     * 
     * @param dateStr chuỗi ngày cần phân tích
     * @return đối tượng LocalDate đã phân tích
     * @throws IllegalArgumentException nếu chuỗi ngày không hợp lệ hoặc không thể
     *                                  phân tích được
     */
    public static LocalDate validateAndParseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, ISO_DATE_FORMATTER);
        } catch (Exception e) {
            throw new IllegalArgumentException("Ngày không hợp lệ: " + dateStr, e);
        }
    }

    /**
     * Định dạng đối tượng LocalDate thành chuỗi ngày theo định dạng "yyyy-MM-dd".
     * 
     * @param date đối tượng LocalDate cần định dạng
     * @return chuỗi ngày đã được định dạng theo định dạng "yyyy-MM-dd"
     */
    public static String formatDate(LocalDate date) {
        return date.format(ISO_DATE_FORMATTER);
    }

    /**
     * Định dạng đối tượng LocalDateTime thành chuỗi ngày theo định dạng
     * "yyyy-MM-dd".
     * (Chỉ lấy phần ngày, bỏ qua giờ phút).
     * 
     * @param dateTime đối tượng LocalDateTime cần định dạng
     * @return chuỗi ngày đã được định dạng theo định dạng "yyyy-MM-dd"
     */
    public static String formatDate(LocalDateTime dateTime) {
        return dateTime.toLocalDate().format(ISO_DATE_FORMATTER);
    }

    /**
     * Định dạng đối tượng LocalDateTime thành chuỗi datetime theo định dạng ISO
     * "yyyy-MM-dd'T'HH:mm:ss".
     * 
     * @param dateTime đối tượng LocalDateTime cần định dạng
     * @return chuỗi datetime đã được định dạng theo chuẩn ISO
     *         "yyyy-MM-dd'T'HH:mm:ss"
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
