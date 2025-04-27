import React from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import '../Style/hocvien.css';

const Sidebar = () => {
  const location = useLocation();
  const getActivePage = () => {
    const path = location.pathname.slice(1);
    return path || 'home';
  };

  return (
    <div className="sidebar">
      <h2>E LEARNING</h2>
      <ul>
        <li>
          <a href="/home" className={getActivePage() === 'home' ? 'active' : ''}>
            <i className="fas fa-home"></i> Trang chủ
          </a>
        </li>
        <li>
          <a href="/my-course" className={getActivePage() === 'my-course' ? 'active' : ''}>
            <i className="fas fa-book"></i> Khóa học của tôi
          </a>
        </li>
        <li>
          <a href="/progress" className={getActivePage() === 'progress' ? 'active' : ''}>
            <i className="fas fa-chart-line"></i> Tiến độ học tập
          </a>
        </li>
        <li>
          <a href="/article" className={getActivePage() === 'posts' ? 'active' : ''}>
            <i className="fas fa-newspaper"></i> Bài viết
          </a>
        </li>
        <li className="logout">
          <Link to="/login">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;