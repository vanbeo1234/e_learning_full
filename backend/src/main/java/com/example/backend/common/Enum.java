package com.example.backend.common;

public class Enum {

    /**
     * Enum để xác định giới tính người dùng.
     * Bao gồm hai giá trị: Nam và Nữ.
     */
    public enum Gender {
        MALE(0, "Male"),
        FEMALE(1, "Female");

        private final int value;
        private final String text;

        /**
         * Constructor để tạo một đối tượng Gender.
         * 
         * @param value Giá trị số đại diện cho giới tính.
         * @param text  Mô tả giới tính ở dạng text.
         */
        Gender(int value, String text) {
            this.value = value;
            this.text = text;
        }

        /**
         * Lấy giá trị số đại diện cho giới tính.
         * 
         * @return Giá trị số của giới tính.
         */
        public int getValue() {
            return value;
        }

        /**
         * Lấy mô tả văn bản của giới tính.
         * 
         * @return Mô tả giới tính dạng text.
         */
        public String getText() {
            return text;
        }
    }

    /**
     * Enum để xác định vai trò người dùng trong hệ thống.
     * Bao gồm ba vai trò: Admin, Giảng viên và Học viên.
     */
    public enum Role {
        ADMIN(1, "Admin"),
        INSTRUCTOR(2, "Instructor"),
        STUDENT(3, "Student");

        private final int value;
        private final String text;

        /**
         * Constructor để tạo một đối tượng Role.
         * 
         * @param value Giá trị số đại diện cho vai trò.
         * @param text  Mô tả văn bản của vai trò.
         */
        Role(int value, String text) {
            this.value = value;
            this.text = text;
        }

        /**
         * Lấy giá trị số đại diện cho vai trò.
         * 
         * @return Giá trị số của vai trò.
         */
        public int getValue() {
            return value;
        }

        /**
         * Lấy mô tả vai trò ở dạng texttext.
         * 
         * @return Mô tả văn bản của vai trò.
         */
        public String getText() {
            return text;
        }

        /**
         * Chuyển đổi một giá trị số thành một vai trò tương ứng.
         * 
         * @param i Giá trị số cần chuyển đổi.
         * @return Vai trò tương ứng với giá trị số.
         * @throws IllegalArgumentException Nếu không tìm thấy vai trò tương ứng.
         */
        public static Role fromInt(int i) {
            for (Role role : Role.values()) {
                if (role.getValue() == i) {
                    return role;
                }
            }
            throw new IllegalArgumentException("Không tìm thấy vai trò tương ứng với giá trị: " + i);
        }
    }

    /**
     * Enum để xác định trạng thái của một đối tượng.
     * Bao gồm hai trạng thái: Active và Inactive.
     */
    public enum Status {
        ACTIVE("Active"),
        INACTIVE("Inactive");

        private final String value;

        /**
         * Constructor để tạo một đối tượng Status.
         * 
         * @param value Mô tả trạng thái ở dạng text.
         */
        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
