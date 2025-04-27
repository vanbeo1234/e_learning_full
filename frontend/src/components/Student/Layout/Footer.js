import React from 'react';
import '../Style/hocvien.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Info */}
        <div className="footer-column">
          <div className="footer-logo">
            <div className="logo-box">E_Learning</div>
          </div>
          <p><strong>Điện thoại:</strong> 0123456789</p>
          <p><strong>Email:</strong> cmcglobal@.com</p>
          <p><strong>Địa chỉ:</strong> Số 80 Dịch vọng, Cầu Giấy, Hà Nội</p>
          <img
            src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png"
            alt="DMCA"
            className="dmca-badge"
          />
        </div>

        {/* Về F8 */}
        <div className="footer-column">
          <h4>VỀ E_Learning</h4>
          <p>Giới thiệu</p>
          <p>Liên hệ</p>
          <p>Điều khoản</p>
          <p>Bảo mật</p>
        </div>

        {/* Sản phẩm */}
        <div className="footer-column">
          <h4>SẢN PHẨM</h4>
          <p>Game Nester</p>
          <p>Game CSS Diner</p>
          <p>Game CSS Selectors</p>
          <p>Game Froggy</p>
          <p>Game Froggy Pro</p>
          <p>Game Scoops</p>
        </div>

        {/* Công cụ */}
        <div className="footer-column">
          <h4>CÔNG CỤ</h4>
          <p>Tạo CV xin việc</p>
          <p>Rút gọn liên kết</p>
          <p>Clip-path maker</p>
          <p>Snippet generator</p>
          <p>CSS Grid generator</p>
          <p>Cảnh báo sờ tay lên mặt</p>
        </div>

        {/* Thông tin công ty */}
        <div className="footer-column">
          <h4>CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC E_Learning</h4>
          <p><strong>Mã số thuế:</strong> 0123456789</p>
          <p><strong>Ngày thành lập:</strong> 29/04/2025</p>
          <p>
            <strong>Lĩnh vực hoạt động:</strong> Giáo dục, công nghệ - lập trình. 
            Chúng tôi tập trung xây dựng và phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2018 - 2025 E_Learning. Nền tảng học lập trình hàng đầu Việt Nam</p>
        <div className="footer-social">
          <a href="#"><i className="fab fa-youtube"></i></a>
          <a href="#"><i className="fab fa-facebook-square"></i></a>
          <a href="#"><i className="fab fa-tiktok"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
