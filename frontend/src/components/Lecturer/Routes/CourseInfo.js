import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Style/giangvien.css';


const CourseInfo = () => {
  const [courseData, setCourseData] = useState({
    courseContent: [],
    courseInfo: {},
    courseVideo: '',
    courseDateTime: {},
    instructor: '',
    learnWhatYouGet: [],
    endDate: '', // Added to store endDate
  });
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const course = location.state?.course;
    if (course) {
      setCourseData({
        courseContent: course.courseContent || [],
        courseInfo: course.courseInfo || { title: course.courseName, description: course.description },
        courseVideo: course.courseVideo || '',
        courseDateTime: course.courseDateTime || { date: course.startDate, time: '08:00 AM' },
        instructor: course.instructor || '',
        learnWhatYouGet: course.learnWhatYouGet || [],
        endDate: course.endDate || '', // Include endDate from course data
      });
      setLoading(false);
    } else {
      setLoading(false);
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleRegister = () => {
    setShowPopup(true);
    setIsRegistered(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleStartCourse = () => {
    navigate('/learn');
  };

  return (
    <div className="courseReactJS-container">
      <div className="courseReactJS-info">
        <h2>{loading ? 'Đang tải...' : courseData.courseInfo.title}</h2>
        <p>{loading ? 'Đang tải mô tả...' : courseData.courseInfo.description}</p>
        <div className="courseReactJS-learn-what-you-get">
          <h3>Bạn sẽ được học những gì?</h3>
          {loading ? (
            <p>Đang tải nội dung...</p>
          ) : (
            courseData.learnWhatYouGet.map((item, index) => (
              <div className="courseReactJS-item" key={index}>
                <i className="fas fa-arrow-right"></i> {item}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="courseReactJS-image-section">
        <div className="courseReactJS-video-wrapper">
          {loading ? (
            <p>Đang tải video...</p>
          ) : (
            <iframe
              src={courseData.courseVideo}
              title={`${courseData.courseInfo.title} Intro`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div className="courseReactJS-register-button">
          <button onClick={isRegistered ? handleStartCourse : handleRegister}>
            {isRegistered ? 'Học ngay' : 'Đăng ký ngay'}
          </button>
        </div>
        <div className="courseReactJS-date-time">
          {loading ? (
            <p>Đang tải thông tin ngày giờ...</p>
          ) : (
            <>
              <p><i className="fas fa-calendar-alt"></i> Ngày bắt đầu: {courseData.courseDateTime.date}</p>
              <p><i className="fas fa-calendar-alt"></i> Ngày kết thúc: {courseData.endDate}</p>
              <p><i className="fas fa-clock"></i> Giờ: {courseData.courseDateTime.time}</p>
              <p><i className="fas fa-chalkboard-teacher"></i> Giảng viên: {courseData.instructor}</p>
            </>
          )}
        </div>
      </div>
      <div className="courseReactJS-content">
        <h3>Nội dung khóa học</h3>
        <div className="courseReactJS-accordion">
          {loading ? (
            <p>Đang tải nội dung khóa học...</p>
          ) : (
            courseData.courseContent.map((item, index) => (
              <div className="courseReactJS-accordion-item" key={index}>
                <button>
                  <span><i className="fas fa-book-open"></i> {index + 1}. {item.title}</span>
                  <i className="fas fa-lock"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {showPopup && (
        <div className="courseReactJS-popup-confirmation">
          <div className="courseReactJS-popup-content">
            <h3>Đăng ký thành công!</h3>
            <p>Chúc mừng bạn đã đăng ký thành công khóa học!</p>
            <button onClick={handleClosePopup}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;