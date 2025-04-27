// src/components/CourseManagement.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modala from "./Function/Modala";
import "../Style/adcm.css";
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    courseName: "",
    instructor: "",
    creationDate: "",
    status: "",
  });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState("ADMIN"); // Giả định vai trò ADMIN tạm thời
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload);
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Lỗi decode token:", error);
      return true;
    }
  };

  // Đăng nhập để lấy token
  const login = async () => {
    try {
      const response = await fetch("http://localhost:8081/v1/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userCode: "admin002",
          password: "your_password_here", // Thay bằng mật khẩu thực tế từ Postman
        }),
      });
      const data = await response.json();
      console.log("Phản hồi login:", data);
      if (response.ok && data.body && data.body.accessToken) {
        const newToken = data.body.accessToken;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        console.log("Token mới:", newToken);
        return newToken;
      } else {
        throw new Error(data.body?.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return null;
    }
  };

  // Xử lý lỗi xác thực
  const handleUnauthorized = async () => {
    console.log("Token không hợp lệ, thử đăng nhập lại");
    const newToken = await login();
    if (!newToken) {
      console.log("Đăng nhập thất bại, chuyển hướng đến login");
      localStorage.removeItem("token");
      setToken("");
      alert(
        "Phiên của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
      );
      navigate("/login");
    }
    return newToken;
  };

  // Lấy danh sách khóa học
  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams({
        pageNumber: currentPage - 1,
        pageSize: itemsPerPage,
        ...(searchCriteria.courseName && {
          courseName: searchCriteria.courseName,
        }),
        ...(role === "ADMIN" &&
          searchCriteria.instructor && {
            instructorName: searchCriteria.instructor,
          }),
        ...(role !== "STUDENT" &&
          searchCriteria.status && {
            statusCode:
              searchCriteria.status === "Hoạt động" ? "ACTIVE" : "INACTIVE",
          }),
        ...(role === "ADMIN" &&
          searchCriteria.creationDate && {
            createdBy: searchCriteria.creationDate,
          }),
      });

      console.log("Gửi request fetchCourses với token:", token);
      const response = await fetch(
        `http://localhost:8081/v1/api/course?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        "Phản hồi fetchCourses:",
        response.status,
        response.statusText
      );
      if (response.status === 401) {
        console.log(
          "Lỗi 401 từ fetchCourses, phản hồi:",
          await response.text()
        );
        // const newToken = await handleUnauthorized();
        const newToken = localStorage.getItem("token");
        if (newToken) {
          // Thử lại với token mới
          const retryResponse = await fetch(
            `http://localhost:8081/v1/api/course?${params}`,
            {
              headers: { Authorization: `Bearer ${newToken}` },
            }
          );
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          const retryData = await retryResponse.json();
          processCourses(retryData);
        }
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      processCourses(data);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    }
  };

  // Xử lý dữ liệu khóa học
  const processCourses = (data) => {
    console.log("Dữ liệu fetchCourses:", data);
    if (data.body && data.body.errorStatus === 901) {
      const coursesData = data.body.data.map((course) => ({
        id: course.id,
        courseName: course.courseName,
        instructor: course.instructors[0]?.name || "N/A",
        lessons: course.lessonCount || 0,
        description: course.description,
        startDate: new Date(course.startDate).toLocaleDateString("vi-VN"),
        endDate: new Date(course.endDate).toLocaleDateString("vi-VN"),
        status:
          course.statusCode === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
      }));
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setTotalPages(data.body.pagination.totalPages);
    } else {
      console.error(
        "Lỗi lấy danh sách khóa học:",
        data.body?.message || "Lỗi không xác định"
      );
    }
  };

  // Khởi tạo component
  useEffect(() => {
    const initialize = async () => {
      console.log("Token hiện tại:", token);
      if (!token || isTokenExpired(token)) {
        console.log("Không có token hoặc token hết hạn, thử đăng nhập");
        const newToken = await login();
        if (!newToken) {
          console.log("Đăng nhập thất bại, chuyển hướng đến login");
          handleUnauthorized();
          return;
        }
      }

      // Bỏ qua fetchRole tạm thời vì lỗi 401
      await fetchCourses();
    };

    initialize();
  }, [token, navigate]);

  // Cập nhật danh sách khóa học
  useEffect(() => {
    if (token && role) {
      fetchCourses();
    }
  }, [currentPage, itemsPerPage, token, role]);

  const handleAddCourse = () => {
    navigate("/add-course");
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      setSelectedCourses(filteredCourses.map((course) => course.id));
    } else {
      setSelectedCourses([]);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id]
    );
  };

  const handleEditCourse = async (course) => {
    localStorage.setItem("courseid", course?.id);
    navigate(`/edit-course-admin/${course?.id}`);
  };

  const processCourseDetail = (data, courseId) => {
    if (data.body && data.body.errorStatus === 901) {
      navigate(`/edit-course/${courseId}`, {
        state: { course: data.body.data },
      });
    } else {
      console.error(
        "Lỗi lấy chi tiết khóa học:",
        data.body?.message || "Lỗi không xác định"
      );
    }
  };

  const showConfirmModal = (action) => {
    if (selectedCourses.length === 0) {
      alert("Vui lòng chọn ít nhất một khóa học");
      return;
    }
    setConfirmAction(action);
    setConfirmMessage(
      action === "disable"
        ? "Bạn có chắc muốn vô hiệu hóa các khóa học đã chọn?"
        : "Bạn có chắc muốn kích hoạt lại các khóa học đã chọn?"
    );
    setConfirmModalOpen(true);
  };

  const hideConfirmModal = () => {
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = async () => {
    try {
      const statusCode = confirmAction === "disable" ? "INACTIVE" : "ACTIVE";
      const response = await fetch(
        "http://localhost:8081/v1/api/course/bulk-update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseIds: selectedCourses, statusCode }),
        }
      );
      if (response.status === 401) {
        console.log(
          "Lỗi 401 từ handleConfirm, phản hồi:",
          await response.text()
        );
        // const newToken = await handleUnauthorized();
        const newToken = localStorage.getItem("token");
        if (newToken) {
          const retryResponse = await fetch(
            "http://localhost:8081/v1/api/course/bulk-update",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newToken}`,
              },
              body: JSON.stringify({ courseIds: selectedCourses, statusCode }),
            }
          );
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          const retryData = await retryResponse.json();
          processBulkUpdate(retryData);
        }
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      processBulkUpdate(data);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };

  const processBulkUpdate = (data) => {
    if (data.body && data.body.errorStatus === 901) {
      fetchCourses();
      setConfirmModalOpen(false);
      setSelectedCourses([]);
      setSelectAll(false);
    } else {
      console.error(
        "Lỗi cập nhật trạng thái:",
        data.body?.message || "Lỗi không xác định"
      );
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const canDisable =
    selectedCourses.length > 0 &&
    selectedCourses.some((id) => {
      const course = filteredCourses.find((course) => course.id === id);
      return course && course.status === "Hoạt động";
    });
  const canEnable =
    selectedCourses.length > 0 &&
    selectedCourses.some((id) => {
      const course = filteredCourses.find((course) => course.id === id);
      return course && course.status === "Không hoạt động";
    });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="course-management-container">
      <div className="course-management-content">
        <div className="course-management-card">
          <div className="course-management-search-form">
            <label htmlFor="courseName">
              Khóa học
              <input
                type="text"
                name="courseName"
                placeholder="Tên khóa học"
                value={searchCriteria.courseName}
                onChange={handleSearchChange}
              />
            </label>
            {role === "ADMIN" && (
              <label htmlFor="instructor">
                Giảng viên
                <input
                  type="text"
                  name="instructor"
                  placeholder="Tên giảng viên"
                  value={searchCriteria.instructor}
                  onChange={handleSearchChange}
                />
              </label>
            )}
            {role === "ADMIN" && (
              <label htmlFor="creationDate">
                Người tạo
                <input
                  type="text"
                  name="creationDate"
                  placeholder="Mã người tạo"
                  value={searchCriteria.creationDate}
                  onChange={handleSearchChange}
                />
              </label>
            )}
            {role !== "STUDENT" && (
              <label htmlFor="status">
                Trạng thái
                <select
                  name="status"
                  value={searchCriteria.status}
                  onChange={handleSearchChange}
                >
                  <option value="">Tất cả</option>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Không hoạt động">Không hoạt động</option>
                </select>
              </label>
            )}
          </div>

          <div className="course-management-action-buttons">
            <div>
              <button className="btn btn-green" onClick={handleAddCourse}>
                Thêm
              </button>
              {/* {role !== "STUDENT" && (
                <>
                  <button
                    className="btn btn-red"
                    onClick={() => showConfirmModal("disable")}
                    disabled={!canDisable}
                  >
                    Vô hiệu hóa
                  </button>
                  <button
                    className="btn btn-yellow"
                    onClick={() => showConfirmModal("enable")}
                    disabled={!canEnable}
                  >
                    Kích hoạt
                  </button>
                </>
              )} */}
              <button className="btn btn-blue" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>STT</th>
                  <th>Mã khóa học</th>
                  <th>Tên khóa học</th>
                  <th>Tên giảng viên</th>
                  <th>Số bài học</th>
                  <th>Mô tả</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Tính năng</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="row-checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCheckboxChange(course.id)}
                      />
                    </td>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{course.id}</td>
                    <td>{course.courseName}</td>
                    <td>{course.instructor}</td>
                    <td>{course.lessons}</td>
                    <td>{course.description}</td>
                    <td>{course.startDate}</td>
                    <td>{course.endDate}</td>
                    <td className="status">{course.status}</td>
                    <td>
                      <i
                        className="fas fa-pencil-alt icon-edit"
                        onClick={() => handleEditCourse(course)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-buttons">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => handlePageChange(number + 1)}
                className={currentPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      <Modala
        show={isConfirmModalOpen}
        type="cancel"
        title="Xác nhận hành động"
        content={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={hideConfirmModal}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="confirm-modal"
      />
    </div>
  );
};

export default CourseManagement;
