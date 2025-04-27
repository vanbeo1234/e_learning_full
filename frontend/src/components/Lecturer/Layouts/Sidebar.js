import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/giangvien.css'; // Create a similar CSS file

const Sidebars = ({ handleLogout }) => {
  const location = useLocation();

  const getActivePage = () => {
    const path = location.pathname.slice(1);
    return path || 'homeg';
  };

  return (
    <div className="sidebar">
      <h2>E LEARNING</h2>
      <ul>
        {/* <li>
          <Link to="/homeg" className={getActivePage() === 'homeg' ? 'active' : ''}>
            <i className="fas fa-home"></i> Trang chủ
          </Link>
        </li> */}
        <li>
          <Link to="/courses" className={getActivePage() === 'courses' ? 'active' : ''}>
            <i className="fas fa-book"></i> Danh sách khóa học
          </Link>
        </li>
        <li>
          <Link to="/create-course" className={getActivePage() === 'create-course' ? 'active' : ''}>
            <i className="fas fa-plus"></i> Tạo khóa học
          </Link>
        </li>
        <li>
          <Link to="/feedback" className={getActivePage() === 'feedback' ? 'active' : ''}>
            <i className="fas fa-comment"></i> Phản hồi
          </Link>
        </li>
        <li className="logout">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebars;