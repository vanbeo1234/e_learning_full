import React, { useState, useEffect } from "react";
import '../Style/hocvien.css';

const getCategoryIcon = (category) => {
  switch (category) {
    case "Java":
      return <i className="fab fa-java"></i>;
    case "Python":
      return <i className="fab fa-python"></i>;
    case "JavaScript":
      return <i className="fab fa-js"></i>;
    case "PHP":
      return <i className="fab fa-php"></i>;
    case "Ruby":
      return <i className="fab fa-ruby"></i>;
    case "Swift":
      return <i className="fab fa-swift"></i>;
    case "C#":
      return <i className="fab fa-cuttlefish"></i>;
    case "Go":
      return <i className="fab fa-go"></i>;
    case "Kotlin":
      return <i className="fab fa-java"></i>;
    case "TypeScript":
      return <i className="fab fa-js"></i>;
    default:
      return <i className="fas fa-code"></i>;
  }
};

const LearningProgress = () => {
  const [loading, setLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [continuingCourses, setContinuingCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8; // Adjust how many courses to display per page
  const totalPages = Math.ceil((registeredCourses.length + continuingCourses.length) / coursesPerPage);

  // Giả lập fetch API cho dữ liệu khóa học
  useEffect(() => {
    setTimeout(() => {
      const registeredData = [
        {
          image: '/logo512.png',
          category: "Java",
          duration: "3 Month",
          title: "Java Core",
          description: "Cung cấp kiến thức cơ bản về OOP, design pattern",
          progress: 75,
        },
        {
          image: '/logo512.png',
          category: "Python",
          duration: "2 Month",
          title: "Python Foundation",
          description: "Học cú pháp cơ bản, xử lý dữ liệu và lập trình hướng đối tượng",
          progress: 50,
        },
        {
          image: '/logo512.png',
          category: "JavaScript",
          duration: "1.5 Month",
          title: "JavaScript ES6",
          description: "Nắm vững cú pháp hiện đại, DOM, event, async/await",
          progress: 90,
        }
      ];

      const continuingData = [
        {
          image: '/logo512.png',
          category: "Ruby",
          duration: "2.5 Month",
          title: "Ruby on Rails",
          description: "Lập trình web với Ruby, Rails framework",
          progress: 60,
        },
        {
          image: '/logo512.png',
          category: "Swift",
          duration: "2 Month",
          title: "iOS Development",
          description: "Phát triển ứng dụng iOS với Swift và Xcode",
          progress: 50,
        },
        {
          image: '/logo512.png',
          category: "C#",
          duration: "3 Month",
          title: "C# Programming",
          description: "Lập trình C# cơ bản và các ứng dụng desktop",
          progress: 85,
        }
      ];

      setRegisteredCourses(registeredData);
      setContinuingCourses(continuingData);
      setLoading(false);
    }, 2000);
  }, []);

  const getProgressColor = (progress) => {
    if (progress >= 75) {
      return '#4caf50'; // green
    } else if (progress >= 50) {
      return '#ff9800'; // orange
    } else {
      return '#f44336'; // red
    }
  };

  const getFormattedProgress = (progress) => {
    if (progress === 100) return 'Hoàn thành';
    if (progress >= 75) return 'Sắp hoàn thành';
    if (progress >= 50) return 'Đang tiến hành';
    return 'Chưa bắt đầu';
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Paginate courses
  const currentCourses = [
    ...registeredCourses,
    ...continuingCourses
  ].slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  return (
    <main className="learningprogress-main-content">
      <section className="learningprogress-courses">
        <div className="learningprogress-courses-header">
          <h2>Tiến độ học tập</h2>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="learningprogress-course-grid">
            {/* Các khóa học */}
            {currentCourses.map((course, index) => (
              <div className="learningprogress-course-card" key={index}>
                <img src={course.image} alt={course.title} className="learningprogress-course-image" />
                <div className="learningprogress-course-header">
                  <span>{getCategoryIcon(course.category)} {course.category}</span>
                  <span><i className="fas fa-clock"></i> {course.duration}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <div className="learningprogress-progress-bar">
                  <div 
                    className="learningprogress-progress"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: getProgressColor(course.progress),
                      transition: 'width 1s ease-out',
                    }}
                  ></div>
                </div>
                <p>{getFormattedProgress(course.progress)}</p>

                <div className="learningprogress-details">
                  <p>Tiến độ: {course.progress}%</p>
                  <p>Ngày hoàn thành dự kiến: {(() => {
                    const formattedDate = new Date();
                    formattedDate.setMonth(formattedDate.getMonth() + 1);
                    return formattedDate.toLocaleDateString();
                  })()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Buttons */}
        <div className="homestudents-pagination-buttons">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? 'homestudents-disabled' : ''}
          >
            «
          </button>
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => handlePageChange(number + 1)}
              className={currentPage === number + 1 ? 'homestudents-active' : ''}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'homestudents-disabled' : ''}
          >
            »
          </button>
        </div>
      </section>
    </main>
  );
};

export default LearningProgress;
