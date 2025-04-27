import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Style/hocvien.css';

const Header = ({ title, isSearch = false, userName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Function to add notifications
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [...prevNotifications, message]);
  };

  // Simulating notification events for demonstration
  useEffect(() => {
    addNotification('Bài học mới đã được đăng tải!');
    addNotification('Nhắc nhở: Lịch thi vào ngày mai!');
    addNotification('Điểm bài tập mới đã có!');
    addNotification('Hạn chót nộp bài tập đến gần!');
    addNotification('Tin tức: Workshop mới sắp diễn ra!');
    addNotification('Có người bình luận trong lớp học nhóm!');
    addNotification('Nhắc nhở: Đăng nhập hàng ngày!');
    addNotification('Cảnh báo: Sự cố kỹ thuật xảy ra!');
  }, []);

  return (
    <div className="header">
      {isSearch ? <input type="text" placeholder="Tên khóa học" /> : <h1>{title}</h1>}
      <div className="user-info">
        <i className="fas fa-bell" onClick={toggleNotifications}></i>
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length === 0 ? (
              <p>Không có thông báo mới</p>
            ) : (
              notifications.map((notification, index) => (
                <p key={index}>{notification}</p>
              ))
            )}
          </div>
        )}
        <img alt="User profile" src="https://placehold.co/40x40" onClick={toggleDropdown} />
        <span>{userName}</span>
        {showDropdown && (
          <div className="dropdown-menu">
            <button>Trang cá nhân</button>
            <button>Hỗ trợ</button>
            <button>Cài đặt</button>
            <Link to="/login">
              <button>Đăng xuất</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;