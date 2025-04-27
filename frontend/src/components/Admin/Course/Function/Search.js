// components/CourseManagement/Function/Search.jsx
import React from 'react';
import '../../Style/adcm.css';

const SearchCourses = ({ criteria, onChange, onSearch }) => {
  return (
    <>
      <label htmlFor="courseName">Khóa học
        <input
          type="text"
          name="courseName"
          placeholder="Tên khóa học"
          value={criteria.courseName}
          onChange={onChange}
        />
      </label>
      <label htmlFor="instructor">Giảng viên
        <input
          type="text"
          name="instructor"
          placeholder="Tên giảng viên"
          value={criteria.instructor}
          onChange={onChange}
        />
      </label>
      <label htmlFor="creationDate">Ngày tạo
        <input
          type="date"
          name="creationDate"
          value={criteria.creationDate}
          onChange={onChange}
        />
      </label>
      <label htmlFor="status">Trạng thái
        <select
          name="status"
          value={criteria.status}
          onChange={onChange}
        >
          <option value="">Tất cả</option>
          <option value="Hoạt động">Hoạt động</option>
          <option value="Không hoạt động">Không hoạt động</option>
        </select>
      </label>
      <button className="btn btn-blue" onClick={onSearch}>
        Tìm kiếm
      </button>
    </>
  );
};

export default SearchCourses;
