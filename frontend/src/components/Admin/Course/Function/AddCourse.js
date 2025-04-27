// src/components/AddCourse.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modala from "./Modala";
import "../../Style/adcm.css";
import { v4 as uuidv4 } from "uuid";
import { useCourseContext } from "../Function/Context/CourseContext";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../../../uploadImage";

const AddCourse = ({ isAdmin }) => {
  const { addCourse } = useCourseContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    instructor: "",
    instructorId: "",
    lessons: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Hoạt động",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [instructorPage, setInstructorPage] = useState(1);
  const [file, setfile] = useState(null);
  const instructorsPerPage = 5;

  useEffect(() => {
    if (isSaved && showSuccessModal) {
      if (isAdmin)
        navigate("/course-management", { state: { newCourseAdded: true } });
      else navigate("/courses");
    }
  }, [isSaved, showSuccessModal, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim())
      newErrors.courseName = "Tên khóa học không được bỏ trống";
    else if (formData.courseName.length > 100)
      newErrors.courseName = "Tên khóa học không được vượt quá 100 ký tự";

    if (!formData.instructor && isAdmin)
      newErrors.instructor = "Vui lòng chọn một giảng viên";

    if (!formData.description.trim())
      newErrors.description = "Nội dung không được bỏ trống";
    else if (formData.description.length > 500)
      newErrors.description = "Nội dung không được vượt quá 500 ký tự";

    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!formData.endDate) newErrors.endDate = "Ngày kết thúc là bắt buộc";
    else if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    objectives.forEach((objective, index) => {
      if (!objective.trim())
        newErrors[`objective${index}`] = "Mục tiêu không được để trống";
      else if (objective.length > 200)
        newErrors[`objective${index}`] =
          "Mục tiêu không được vượt quá 200 ký tự";
    });

    if (lectures.length === 0) {
      newErrors.lectures = "Phải có ít nhất một bài giảng";
    } else {
      lectures.forEach((lecture, index) => {
        if (!lecture.name.trim())
          newErrors[`lectureName${index}`] =
            "Tên bài giảng không được để trống";
        else if (lecture.name.length > 100)
          newErrors[`lectureName${index}`] =
            "Tên bài giảng không được vượt quá 100 ký tự";

        if (!lecture.video)
          newErrors[`lectureVideo${index}`] =
            "Video bài giảng không được để trống";
        if (!lecture.document)
          newErrors[`lectureDocument${index}`] =
            "Tài liệu bài giảng không được để trống";
      });
    }

    if (!coverImage) newErrors.coverImage = "Ảnh bìa là bắt buộc";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8081/v1/api/registrations/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        toast.error("Có lỗi khi upload ảnh");
        return null;
      }
    } catch (error) {
      toast.error("Có lỗi khi upload ảnh");
      return null;
    }
  };

  const handleAddObjective = () => setObjectives([...objectives, ""]);

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    setErrors((prev) => ({ ...prev, [`objective${index}`]: "" }));
  };

  const handleRemoveObjective = (index) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`objective${index}`];
      return newErrors;
    });
  };

  const handleAddLecture = () => {
    setLectures([
      ...lectures,
      {
        order: lectures?.length + 1,
        name: "",
        videoType: "url",
        video: "",
        document: "",
      },
    ]);
  };

  const handleLectureChange = (index, field, value) => {
    const newLectures = [...lectures];
    newLectures[index][field] = value;
    setLectures(newLectures);
    setErrors((prev) => ({ ...prev, [`lecture${field}${index}`]: "" }));
  };

  const handleRemoveLecture = (index) => {
    const newLectures = lectures.filter((_, i) => i !== index);
    setLectures(newLectures);
    setErrors((prev) => {
      const newErrors = { ...prev };
      ["order", "name", "video", "document"].forEach((field) => {
        delete newErrors[`lecture${field}${index}`];
      });
      return newErrors;
    });
  };

  const handleFileUpload = (index, file) => {
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      handleLectureChange(index, "video", videoUrl);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setfile(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleStudentSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setStudents(selected);
  };

  const [instructors, setInstructors] = useState([]);

  const getAllTeacher = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8081/v1/api/user/by-role?roleId=2",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status === 200) {
        setInstructors(response.data);
      } else {
        toast.error(response.message || "Có lỗi khi lấy danh sách giảng viên");
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTeacher();
  }, []);

  const filteredInstructors = instructors.filter(
    (instructor) =>
      (searchCode
        ? instructor.code.toLowerCase().includes(searchCode.toLowerCase())
        : true) &&
      (searchName
        ? instructor.name.toLowerCase().includes(searchName.toLowerCase())
        : true)
  );

  const totalInstructorPages = Math.ceil(
    filteredInstructors.length / instructorsPerPage
  );
  const currentInstructors = filteredInstructors.slice(
    (instructorPage - 1) * instructorsPerPage,
    instructorPage * instructorsPerPage
  );

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
  };

  const handleConfirmInstructor = () => {
    if (selectedInstructor) {
      setFormData((prev) => ({
        ...prev,
        instructor: selectedInstructor.name,
        instructorId: selectedInstructor?.id,
      }));
      setErrors((prev) => ({ ...prev, instructor: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        instructor: "Vui lòng chọn một giảng viên",
      }));
      return;
    }
    console.log("ok");
    setShowInstructorModal(false);
    setSearchCode("");
    setSearchName("");
    setSelectedInstructor(null);
    setInstructorPage(1);
  };

  const handleCancelInstructor = () => {
    setShowInstructorModal(false);
    setSearchCode("");
    setSearchName("");
    setSelectedInstructor(null);
    setInstructorPage(1);
  };

  const handleSave = async () => {
    if (isLoading) return;
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    setIsLoading(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const pathImage = await handleUploadImage();
        const newCourse = {
          courseName: formData.courseName,
          description: formData.description,
          learningOutcome: objectives.join(", "),
          backgroundImg: pathImage,
          startDate: formData.startDate,
          endDate: formData.endDate,
          lessonCount: lectures?.length || 0,
          statusCode: formData.status === "Hoạt động" ? "ACTIVE" : "INACTIVE",
          instructorIds: isAdmin ? [formData?.instructorId] : [id],
          lessons: lectures.map((lecture) => ({
            lessonName: lecture.name,
            lessonOrder: lecture.order,
            videoLink: lecture.video,
            resourceLink: lecture.document,
          })),
        };

        const response = await axios.post(
          "http://localhost:8081/v1/api/course",
          newCourse,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📦 Phản hồi từ server:", response.data);

        // Nếu phản hồi có errorStatus === 901 thì là thành công
        if (response?.data?.body?.errorStatus === 901) {
          setIsSaved(true);
          setShowSuccessModal(true);
          setErrors({}); // Xóa lỗi cũ
        } else {
          // Ngược lại, chỉ log lỗi nếu thực sự có message khác
          const serverMessage = response?.data?.message || "Không rõ lý do";
          setErrors({ general: `Lỗi từ server: ${serverMessage}` });
        }
      } catch (error) {
        console.error("❌ Lỗi khi tạo khóa học:", error);

        if (error.response) {
          if (error.response.status === 401) {
            setErrors({
              general: "⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            });
          } else {
            setErrors({
              general:
                error.response.data?.message || "❌ Tạo khóa học thất bại.",
            });
          }
        } else {
          setErrors({
            general: "❌ Lỗi không xác định. Vui lòng kiểm tra kết nối.",
          });
        }
      }
    }

    setIsLoading(false);
  };

  const handleCancel = () => setShowCancelModal(true);

  const handleOpenInstructorModal = () => {
    setShowInstructorModal(true);
    setInstructorPage(1);
  };

  const handleInstructorPageChange = (page) => {
    setInstructorPage(page);
  };

  return (
    <div className="add-course-details">
      <div className="add-course-section">
        <h2>Mô tả</h2>
        <div className="add-course-input-group">
          <label htmlFor="course-name">
            Tên khóa học <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="course-name"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            maxLength={100}
          />
          {errors.courseName && (
            <span className="error">{errors.courseName}</span>
          )}
        </div>

        <div className="add-course-input-group">
          <label htmlFor="course-content">
            Nội dung <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            id="course-content"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={500}
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="section">
        <h2>
          Mục tiêu <span style={{ color: "red" }}>*</span>
        </h2>
        <div className="add-new" onClick={handleAddObjective}>
          <i className="fas fa-plus"></i> <span>Thêm mới</span>
        </div>
        {objectives.map((objective, index) => (
          <div className="input-group" key={index}>
            <input
              type="text"
              placeholder="Nhập mục tiêu"
              value={objective}
              onChange={(e) => handleObjectiveChange(index, e.target.value)}
              maxLength={200}
            />
            <button
              className="remove-btn"
              onClick={() => handleRemoveObjective(index)}
            >
              <i className="fas fa-trash"></i>
            </button>
            {errors[`objective${index}`] && (
              <span className="error">{errors[`objective${index}`]}</span>
            )}
          </div>
        ))}
      </div>

      <div className="section">
        <h2>
          Nội dung khóa học <span style={{ color: "red" }}>*</span>
        </h2>
        <div className="add-new" onClick={handleAddLecture}>
          <i className="fas fa-plus"></i> <span>Thêm mới</span>
        </div>
        {errors.lectures && <span className="error">{errors.lectures}</span>}
        {lectures.map((lecture, index) => (
          <div className="course-content" key={index}>
            <div className="input-group">
              <label>
                Thứ tự <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                placeholder="Nhập thứ tự"
                value={index + 1}
                disabled
                // onChange={(e) =>
                //   handleLectureChange(index, "order", e.target.value)
                // }
                min={1}
              />
              {/* {errors[`lectureOrder${index}`] && (
                <span className="error">{errors[`lectureOrder${index}`]}</span>
              )} */}
            </div>

            <div className="input-group">
              <label>
                Tên bài giảng <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên bài giảng"
                value={lecture.name}
                onChange={(e) =>
                  handleLectureChange(index, "name", e.target.value)
                }
                maxLength={100}
              />
              {errors[`lectureName${index}`] && (
                <span className="error">{errors[`lectureName${index}`]}</span>
              )}
            </div>

            <div className="input-group">
              <label>Chọn loại video</label>
              <select
                value={lecture.videoType || "url"}
                onChange={(e) =>
                  handleLectureChange(index, "videoType", e.target.value)
                }
              >
                <option value="url">Dán đường link video</option>
                <option value="file">Tải video lên</option>
              </select>
            </div>

            {lecture.videoType === "url" ? (
              <div className="input-group">
                <label>
                  Video URL <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="url"
                  placeholder="Nhập URL video"
                  value={lecture.video}
                  onChange={(e) =>
                    handleLectureChange(index, "video", e.target.value)
                  }
                />
                {errors[`lectureVideo${index}`] && (
                  <span className="error">
                    {errors[`lectureVideo${index}`]}
                  </span>
                )}
              </div>
            ) : (
              <div className="input-group">
                <label>
                  Tải lên video <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                />
                {errors[`lectureVideo${index}`] && (
                  <span className="error">
                    {errors[`lectureVideo${index}`]}
                  </span>
                )}
              </div>
            )}

            <div className="input-group">
              <label>
                Tài liệu <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="url"
                placeholder="Nhập URL tài liệu"
                value={lecture.document}
                onChange={(e) =>
                  handleLectureChange(index, "document", e.target.value)
                }
              />
              {errors[`lectureDocument${index}`] && (
                <span className="error">
                  {errors[`lectureDocument${index}`]}
                </span>
              )}
            </div>

            <div className="buttons">
              {/* <button
                className="save-btn"
                onClick={() => console.log("Lưu bài giảng", lecture)}
              >
                Lưu
              </button> */}
              <button
                className="cancel-btn"
                onClick={() => handleRemoveLecture(index)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>
          Ảnh bìa <span style={{ color: "red" }}>*</span>
        </h2>
        <div
          className="cover-image"
          style={{
            backgroundImage: coverImage ? `url(${coverImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => document.getElementById("cover-image-upload").click()}
        >
          {!coverImage && <i className="fas fa-plus upload-icon"></i>}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="cover-image-upload"
            onChange={handleCoverImageChange}
          />
        </div>
        {errors.coverImage && (
          <span className="error">{errors.coverImage}</span>
        )}
      </div>

      <div className="learning-time-section">
        <h2>Thời gian học</h2>
        <div className="learning-time-row">
          <div className="learning-time-input">
            <label>
              Ngày bắt đầu <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              name="startDate"
              onChange={handleChange}
            />
            {errors.startDate && (
              <span className="learning-time-error">{errors.startDate}</span>
            )}
          </div>
          <div className="learning-time-input">
            <label>
              Ngày kết thúc <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              name="endDate"
              onChange={handleChange}
            />
            {errors.endDate && (
              <span className="learning-time-error">{errors.endDate}</span>
            )}
          </div>
        </div>

        {isAdmin ? (
          <div className="select-instructor-group">
            <h2>
              Chọn giảng viên <span style={{ color: "red" }}>*</span>
            </h2>
            <button
              className="select-instructor-btn"
              onClick={handleOpenInstructorModal}
            >
              {formData.instructor || "Chọn giảng viên"}
            </button>
            {errors.instructor && (
              <span className="error">{errors.instructor}</span>
            )}
          </div>
        ) : null}
      </div>

      <div className="footer-buttons">
        <button
          className="create-btn"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Đang tạo..." : "Tạo mới"}
        </button>
        <button
          className="cancel-btn"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Hủy
        </button>
      </div>

      {errors.general && (
        <div className="error general-error">{errors.general}</div>
      )}

      <Modala
        show={showSuccessModal}
        title="Tạo khóa học thành công"
        onConfirm={() => {
          setShowSuccessModal(false);
          setIsSaved(true);
        }}
        onCancel={() => {
          setShowSuccessModal(false);
          setIsSaved(true);
        }}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="add-modal"
      />

      <Modala
        show={showCancelModal}
        title="Bạn chắc chắn muốn hủy?"
        onConfirm={() => navigate("/course-management")}
        onCancel={() => setShowCancelModal(false)}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="add-modal"
      />

      <Modala
        show={showInstructorModal}
        title="Tìm kiếm giảng viên"
        onConfirm={handleConfirmInstructor}
        onCancel={handleCancelInstructor}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="instructor-modal"
      >
        <div className="instructor-search">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Mã giảng viên"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Tên giảng viên"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">Tìm kiếm</button>
          </div>
          <div className="instructor-table-container">
            <table className="instructor-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Stt</th>
                  <th>Mã định danh</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày sinh</th>
                  <th>Năm kinh nghiệm</th>
                </tr>
              </thead>
              <tbody>
                {currentInstructors.map((instructor, index) => (
                  <tr key={instructor.id}>
                    {/* <td>
                      <input
                        type="radio"
                        name="instructor"
                        value={instructor.id}
                        checked={selectedInstructor?.id === instructor.id}
                        // onChange={() => handleInstructorSelect(instructor)}
                        onClick={() => handleInstructorSelect(instructor)}
                      />
                    </td> */}
                    <td>
                      <input
                        type="radio"
                        name="instructor"
                        checked={selectedInstructor?.id === instructor.id}
                        onChange={() => handleInstructorSelect(instructor)}
                      />
                    </td>

                    <td>
                      {index + 1 + (instructorPage - 1) * instructorsPerPage}
                    </td>
                    <td>{instructor.code}</td>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    <td>{instructor.phone}</td>
                    <td>{instructor.dateOfBirth}</td>
                    <td>{instructor.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => handleInstructorPageChange(1)}
              disabled={instructorPage === 1}
            >
              «
            </button>
            {[...Array(totalInstructorPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => handleInstructorPageChange(number + 1)}
                className={instructorPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => handleInstructorPageChange(totalInstructorPages)}
              disabled={instructorPage === totalInstructorPages}
            >
              »
            </button>
          </div>
        </div>
      </Modala>
    </div>
  );
};

export default AddCourse;
