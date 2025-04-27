// CourseInterface.js
import { useEffect, useState } from "react";
import "../Style/coursse.css";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPlayer from "react-player/youtube";

const CourseDetail = () => {
  const [activeLesson, setActiveLesson] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [currentLessons, setCurrentLessons] = useState();

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const courseid = localStorage.getItem("courseid");
      const response = await axios.get(
        "http://localhost:8081/v1/api/course/detail",
        {
          params: { courseId: courseid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.body?.errorStatus === 901) {
        const course = response?.data?.body?.data;
        setLessons(
          course?.lessons?.map((item) => ({
            id: item?.lessonId,
            title: item?.lessonName,
            videoLink: item?.videoLink,
            resourceLink: item?.resourceLink,
            locked: false,
            duration: "33:05",
          }))
        );
        setActiveLesson(course?.lessons[0]?.lessonId);
        setCurrentLessons({
          id: course?.lessons[0]?.lessonId,
          title: course?.lessons[0]?.lessonName,
          videoLink: course?.lessons[0]?.videoLink,
          resourceLink: course?.lessons[0]?.resourceLink,
          locked: false,
          duration: "33:05",
        });
      } else {
        toast.error(response?.data?.body?.message || "Lỗi không xác định");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu khóa học:", error);
    }
  };

  const LockIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const MessageSquareIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  return (
    <div className="container">
      {/* Left panel */}
      <div className="left-panel">
        <h1 className="title">{currentLessons?.title}</h1>

        {/* Video container */}
        <div className="video-container">
          <ReactPlayer
            url={currentLessons?.videoLink}
            className="react-player"
            width="100%"
            height="100%"
            controls={true}
            playing={true}
            muted={false}
            loop={true}
            onReady={() => console.log("Video đã sẵn sàng")}
            onError={(e) => console.log("Lỗi phát video", e)}
          />
        </div>

        {/* Progress bar */}
        <div className="progress-section">
          <div className="progress-button">
            <div className="progress-circle">
              <span className="progress-text">0%</span>
            </div>
            <span className="progress-label">
              {" "}
              {`0/${lessons.length} bài học`}
            </span>
          </div>

          <button className="note-button">
            <MessageSquareIcon />
            <span className="note-button-text">Ghi chú</span>
          </button>
        </div>
      </div>

      {/* Right panel - Course content */}
      <div className="right-panel">
        <div className="content-header">
          <h2 className="content-title">Nội dung khóa học</h2>
        </div>

        <div className="lessons-list">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`lesson-item ${
                lesson.id === activeLesson ? "active-lesson" : ""
              }`}
              onClick={() => {
                if (!lesson.locked) {
                  setActiveLesson(lesson.id);
                  setCurrentLessons(lesson);
                }
              }}
              style={{ cursor: lesson.locked ? "not-allowed" : "pointer" }}
            >
              <div className="lesson-info">
                <span
                  className={`lesson-title ${
                    lesson.id === activeLesson ? "active-lesson-title" : ""
                  }`}
                >
                  {index + 1}.{lesson.title}
                </span>
                {lesson.duration && (
                  <span className="lesson-duration">{lesson.duration}</span>
                )}
              </div>
              {lesson.locked && <LockIcon />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
