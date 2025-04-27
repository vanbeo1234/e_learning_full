import React, { useState, useEffect } from 'react';
import '../Style/giangvien.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(storedCourses);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const currentCourses = courses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="courses">
      <h1 className="courses-title">Trang Chủ</h1>
      <div className="courses-container">
        <div className="course-row">
          {currentCourses.map((course, index) => (
            <article className="course" key={index}>
              <img alt={`Hình minh họa khóa học ${course.title}`} className="course-image" src={course.image} />
              <h2 className="course-title">{course.title}</h2>
              <div className="course-duration">
                <i className="fas fa-clock"></i>
                <span>{course.duration}</span>
              </div>
              <p className="course-text">Khóa học {course.duration}</p>
              <button className="course-button">Đọc thêm</button>
              <button className="course-button">Tham gia</button>
            </article>
          ))}
        </div>
      </div>
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={index + 1 === currentPage ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CourseList;