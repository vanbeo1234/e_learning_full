import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Style/hocvien.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [courses, setCourses] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const coursesPerPage = 8;
  const bannerImages = ["/logo512.png", "/logo512.png", "/img/OIP (2).jpg"];
  const navigate = useNavigate();

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Không tìm thấy token trong localStorage!");
      return;
    }

    // Hàm gọi API để lấy danh sách khóa học
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8081/v1/api/course", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu khóa học");
        }

        const data = await response.json();
        if (data.body.errorStatus === 901) {
          const originalData = data.body.data || [];
          const dataWithImages = await fetchAllImages(originalData);
          setCourses(dataWithImages);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

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

  const fetchAllImages = async (dataArray) => {
    try {
      const imagePromises = dataArray.map(async (item) => {
        if (!item.backgroundImg) return item;

        const imageUrl = await fetchImage(item.backgroundImg.split("/").pop());
        return {
          ...item,
          backgroundImg: imageUrl || item.backgroundImg,
        };
      });
      const results = await Promise.all(imagePromises);
      return results;
    } catch (error) {
      return dataArray;
    }
  };

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const currentCourses = courses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Hàm trả về icon dựa vào category
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
      default:
        return <i className="fas fa-code"></i>;
    }
  };

  if (loading) {
    return <div>Đang tải khóa học...</div>;
  }

  return (
    <main className="homestudents-main-content">
      <div className="homestudents-banner">
        <img
          src={bannerImages[currentBannerIndex]}
          alt="Banner"
          className="homestudents-banner-image"
        />
      </div>
      <div className="homestudents-pagination">
        {bannerImages.map((_, index) => (
          <div
            key={index}
            className={
              index === currentBannerIndex ? "homestudents-active" : ""
            }
          ></div>
        ))}
      </div>

      <section className="homestudents-courses">
        <div className="homestudents-courses-header">
          <h2>Khóa học</h2>
        </div>
        <div className="homestudents-course-grid">
          {currentCourses.map((course, index) => (
            <div
              onClick={() => {
                localStorage.setItem("courseid", course?.id);
                navigate(`/course/${index}`);
              }}
              key={index}
              className="homestudents-course-card-link"
            >
              <div className="homestudents-course-card">
                <img
                  src={course.backgroundImg}
                  alt={course.title}
                  className="homestudents-course-image"
                />
                <div className="homestudents-course-header">
                  <span>
                    {getCategoryIcon(course.category)} {course.category}
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {course.duration}
                  </span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="homestudents-pagination-buttons">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "homestudents-disabled" : ""}
          >
            «
          </button>
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => handlePageChange(number + 1)}
              className={
                currentPage === number + 1 ? "homestudents-active" : ""
              }
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "homestudents-disabled" : ""
            }
          >
            »
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
