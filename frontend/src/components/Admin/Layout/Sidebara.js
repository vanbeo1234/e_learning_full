import React from 'react';
import '../Style/admin.css';
import { useLocation, Link } from 'react-router-dom';
const Sidebara = () => {
  const getActivePage = () => {
    const path = window.location.pathname;
    if (path.includes('user-management')) return 'user-management';
    if (path.includes('course-management')) return 'course-management';
    return '';
  };

  return (
    <div className="sidebar">
      <h2>E LEARNING</h2>
      <ul>
        <li>
          <a href="/user-management" className={getActivePage() === 'user-management' ? 'active' : ''}>
            <i className="fas fa-users"></i> Quản lý người dùng
          </a>
        </li>
        <li>
          <a href="/course-management" className={getActivePage() === 'course-management' ? 'active' : ''}>
            <i className="fas fa-book-open"></i> Quản lý khóa học
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

export default Sidebara;