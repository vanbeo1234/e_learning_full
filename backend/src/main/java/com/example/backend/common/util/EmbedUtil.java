package com.example.backend.common.util;

public class EmbedUtil {

    /**
     * Chuyển đổi URL của video YouTube sang định dạng nhúng (embed).
     * <p>
     * Hỗ trợ 2 dạng URL phổ biến:
     * <ul>
     * <li>Dạng đầy đủ: https://www.youtube.com/watch?v=videoId</li>
     * <li>Dạng rút gọn: https://youtu.be/videoId</li>
     * </ul>
     *
     * @param url Đường dẫn video YouTube
     * @return Đường dẫn nhúng tương ứng (https://www.youtube.com/embed/videoId),
     *         hoặc trả về nguyên URL nếu không khớp định dạng
     */

    public static String convertYoutubeUrlToEmbed(String url) {

        if (url == null || url.isBlank())
            return null;

        if (url.contains("watch?v=")) {
            String videoId = url.substring(url.indexOf("watch?v=") + 8);
            return "https://www.youtube.com/embed/" + videoId;
        } else if (url.contains("youtu.be/")) {
            String videoId = url.substring(url.indexOf("youtu.be/") + 9);
            return "https://www.youtube.com/embed/" + videoId;
        }

        return url;
    }

    /**
     * Chuyển đổi tên file hình ảnh sang đường dẫn đầy đủ để truy cập.
     *
     * @param filename Tên file hình ảnh
     * @return Đường dẫn truy cập hình ảnh, theo dạng: /image/filename
     */
    public static String convertImageToFullPath(String filename) {
        return "/image/" + filename;
    }

    /**
     * Xử lý và chuyển đổi đường dẫn tài nguyên nếu cần.
     * <p>
     * Hiện tại phương thức này trả về nguyên đường dẫn gốc.
     * Có thể mở rộng để xử lý các tài liệu như Google Docs, PDF, Slides,...
     *
     * @param url Đường dẫn tài nguyên
     * @return Đường dẫn đã xử lý
     */
    public static String convertResourceLink(String url) {
        return url;
    }
}
