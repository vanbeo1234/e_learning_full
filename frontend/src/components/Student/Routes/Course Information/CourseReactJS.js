import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CListGroup } from "@coreui/react";
import "./course.css";
import { toast } from "react-toastify";

const CourseReactJS = () => {
  const [courseData, setCourseData] = useState({
    courseContent: [],
    courseInfo: {},
    courseVideo: "",
    courseDateTime: {},
    instructorName: "",
    learnWhatYouGet: [],
    learningOutcome: []
  });

  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [coverImage, setCoverImage] = useState();
  const [listTarget, setListTarget] =  useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseData();
    checkRegisterCourse();
  }, []);

  const fetchImage = async (imagename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/v1/api/registrations/uploads/${imagename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      return url;
    } catch (err) {
      return null;
    }
  };

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
      if (response?.data?.body?.errorStatus == 901) {
        setCourseData(response?.data?.body?.data);
        const path = await fetchImage(
          response?.data?.body?.data?.backgroundImg.split("/").pop()
        );
        setCoverImage(path);
        setListTarget( response?.data?.body?.data?.learningOutcome.split(","))
        setLoading(false);
      } else {
        toast.error(
          response?.data?.body?.message || "Lỗi khi lấy dữ liệu khóa học"
        );
      }
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu khóa học:", error);
      setLoading(false);
    }
  };

  const checkRegisterCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const courseid = localStorage.getItem("courseid");
      const id = localStorage.getItem("id");
      const response = await axios.get(
        "http://localhost:8081/v1/api/registrations/check-register-course",
        {
          params: { userId: id, courseId: courseid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status === 200) {
        setIsRegistered(response?.data?.success);
      } else {
        toast.error("Có lỗi khi lấy dữ liệu");
      }
    } catch (error) {
      toast.error("Có lỗi khi lấy dữ liệu");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleStartCourse = () => {
    const courseid = localStorage.getItem("courseid");
    navigate(`/course/detail/${courseid}`);
  };

  const registerCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const courseid = localStorage.getItem("courseid");
      const response = await axios.post(
        "http://localhost:8081/v1/api/registrations",
        {
          studentId: id,
          courseId: courseid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "đăng ký thành công");
        setShowPopup(true);
        setIsRegistered(true);
      } else {
        toast.error(response?.data?.message || "Lỗi");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          toast.error(
            `${error?.response?.data?.result?.message || "Lỗi không xác định"}`
          );
        }
      } else {
        toast.error("Lỗi không xác định. Vui lòng kiểm tra kết nối.");
      }
    }
  };

  return (
    <>
      <div className="courseReactJS-container">
        <div className="courseReactJS-info">
          <h2>{loading ? "Đang tải..." : courseData?.courseName}</h2>
          <p>
            {loading ? "Đang tải mô tả khóa học..." : courseData?.description}
          </p>

          <CListGroup className="courseReactJS-stars">
            <h2>Mục tiêu khóa học</h2>
            {loading ? (
              <p>Đang tải nội dung...</p>
            ) : (
              listTarget.map(item => (
                <div className="courseReactJS-item">
                <i className="fas fa-arrow-right"></i>
                {item}
              </div> 
              ))
            )}
          </CListGroup>
        </div>

        <div className="courseReactJS-image-section">
          <div className="courseReactJS-video-wrapper">
            {loading ? (
              <p>Đang tải ảnh...</p>
            ) : coverImage ? (
              <img
                src={coverImage}
                alt="background"
                style={{
                  width: "100%",
                  height: "215px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <p>Không có ảnh</p>
            )}
          </div>

          <div className="courseReactJS-register-button">
            <button onClick={isRegistered ? handleStartCourse : registerCourse}>
              {isRegistered ? "Học ngay" : "Đăng ký ngay"}
            </button>
          </div>

          <div className="courseReactJS-date-time">
            {loading ? (
              <p>Đang tải thông tin ngày giờ...</p>
            ) : (
              <>
                <p>
                  <i className="fas fa-calendar-alt"></i> Ngày bắt đầu:{" "}
                  {courseData?.startDate || "Không có thông tin"}
                </p>
                <p>
                  <i className="fas fa-calendar-alt"></i> Ngày kết thúc:{" "}
                  {courseData?.endDate || "Không có thông tin"}
                </p>
                <p>
                  <i className="fas fa-chalkboard-teacher"></i> Giảng viên:{" "}
                  {courseData?.instructors[0]?.name}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="courseReactJS-content">
        <h3>Nội dung khóa học</h3>
        <div className="courseReactJS-accordion">
          {loading ? (
            <p>Đang tải nội dung khóa học...</p>
          ) : (
            courseData?.lessons?.map((item, index) => (
              <div className="courseReactJS-accordion-item" key={index}>
                <button>
                  <span>
                    <i className="fas fa-book-open"></i> {index + 1}.{" "}
                    {item.lessonName}
                  </span>
                  <i className="fas fa-lock"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup-confirmation">
          <div className="popup-content">
            <h3>Đăng ký thành công!</h3>
            <p>Chúc mừng bạn đã đăng ký thành công khóa học!</p>
            <button onClick={handleClosePopup}>Đóng</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseReactJS;
