// File: components/UserManagement/Function/Search.jsx
import React from 'react';
import '../../Style/adum.css';

const UserSearchForm = ({ searchCriteria, handleSearchChange, handleSearch }) => {
  return (
    <div className="user-management-search-form">
      <label htmlFor="name">Họ và tên:
        <input type="text" name="name" placeholder="Họ và tên" value={searchCriteria.name} onChange={handleSearchChange} />
      </label>
      <label htmlFor="dob">Ngày sinh:
        <input type="date" name="dob" placeholder="Ngày sinh" value={searchCriteria.dob} onChange={handleSearchChange} />
      </label>
      <label htmlFor="role">Vai trò:
        <select name="role" value={searchCriteria.role} onChange={handleSearchChange}>
          <option value="">Tất cả</option>
          <option value="Học viên">Học viên</option>
          <option value="Giảng viên">Giảng viên</option>
          <option value="Quản lý">Quản lý</option>
        </select>
      </label>
      <label htmlFor="status">Trạng thái:
        <select name="status" value={searchCriteria.status} onChange={handleSearchChange}>
          <option value="">Tất cả</option>
          <option value="Hoạt động">Hoạt động</option>
          <option value="Không hoạt động">Không hoạt động</option>
        </select>
      </label>
      <button className="btn btn-blue" onClick={handleSearch}>Tìm kiếm</button>
    </div>
  );
};

export default UserSearchForm;