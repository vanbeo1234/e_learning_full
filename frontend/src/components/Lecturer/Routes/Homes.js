import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Style/giangvien.css';

function Homes() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const coursesPerPage = 8;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Không tìm thấy token trong localStorage!");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8081/v1/api/course", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu khóa học");
        }

        const data = await response.json();
        if (data.body.errorStatus === 901) {
          setCourses(data.body.data);
        } else {
          console.error("Lỗi từ API:", data.body.message);
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const currentCourses = courses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Đang tải khóa học...</div>;

  return (
    <main className="homestudents-main-content">
      <section className="homestudents-courses">
        <div className="homestudents-courses-header">
          <h2>Danh mục khóa học</h2>
        </div>
        <div className="homestudents-course-grid">
          {currentCourses.map((course) => (
            <Link
              to={`/course-info/${course.id}`}
              key={course.id}
              state={{ course }}
              className="homestudents-course-card-link"
            >
              <div className="homestudents-course-card">
                <img src={course.image} alt={course.courseName} className="homestudents-course-image" />
                <div className="homestudents-course-header">
                  <span>{course.category}</span>
                  <span><i className="fas fa-clock"></i> {course.duration}</span>
                </div>
                <h3>{course.courseName}</h3>
                <p>{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="homestudents-pagination-buttons">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={index + 1 === currentPage ? 'homestudents-active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Homes;
