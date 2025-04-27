import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/giangvien.css";
import { toast } from "react-toastify";
import axios from "axios";

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState({
    courseName: "",
    creationDate: "",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(storedCourses);
    setFilteredCourses(storedCourses);
  }, []); // Note: You might want to add a dependency or polling for real-time updates

  const handleSearch = () => {
    let filtered = [...courses];
    if (searchCriteria.courseName.trim()) {
      const term = searchCriteria.courseName.toLowerCase();
      filtered = filtered.filter((course) =>
        course.courseName.toLowerCase().includes(term)
      );
    }
    if (searchCriteria.creationDate) {
      filtered = filtered.filter((course) =>
        course.creationDate?.startsWith(searchCriteria.creationDate)
      );
    }
    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditCourse = (course) => {
    localStorage.setItem("courseid", course.id);
    navigate(`/edit-course/${course.id}`, { state: { course } });
  };

  const handleAddCourse = () => {
    navigate("/create-course");
  };

  const getAllCourseOfTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const response = await axios.get("http://localhost:8081/v1/api/course", {
        params: {
          instructorId: id,
          courseName: searchCriteria.courseName,
          createdDate: searchCriteria.creationDate,
          pageNumber: currentPage - 1,
          pageSize: itemsPerPage,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.body?.errorStatus === 901) {
        setFilteredCourses(response.data.body.data);
      } else {
        toast.error(
          response.data.body.message || "Có lỗi khi lấy danh sách kháo học"
        );
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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getAllCourseOfTeacher();
    }, 200); // Delay 200ms
    return () => clearTimeout(debounceTimer);
  }, [
    searchCriteria.courseName,
    searchCriteria.creationDate,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    getAllCourseOfTeacher();
  }, []);

  return (
    <div className="course-table-container">
      <div className="course-table-content">
        <div className="course-table-card">
          <div className="course-table-search-form">
            <label htmlFor="courseName">
              Khóa học
              <input
                type="text"
                name="courseName"
                placeholder="Tên khóa học"
                value={searchCriteria.courseName}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
              />
            </label>
            <label htmlFor="creationDate">
              Ngày tạo
              <input
                type="date"
                name="creationDate"
                value={searchCriteria.creationDate}
                onChange={handleSearchChange}
              />
            </label>
          </div>
          <div className="course-table-action-buttons">
            <div>
              <button className="btn btn-green" onClick={handleAddCourse}>
                Thêm khóa học
              </button>
              <button className="btn btn-blue" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã khóa học</th>
                  <th>Tên khóa học</th>
                  <th>Tên giảng viên</th>
                  <th>Số bài học</th>
                  <th>Mô tả</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Tính năng</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{course.id}</td>
                    <td>{course.courseName}</td>
                    <td>{course?.instructors[0]?.name || ""}</td>
                    <td>{course.lessonCount}</td>
                    <td>{course.description}</td>
                    <td>{course.startDate}</td>
                    <td>{course.endDate}</td>
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
          {/* <div className="pagination-buttons">
            <button onClick={() => handlePageChange(1)}>«</button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                className={number + 1 === currentPage ? "active" : ""}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(totalPages)}>»</button>
          </div> */}
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
    </div>
  );
};

export default CourseTable;
