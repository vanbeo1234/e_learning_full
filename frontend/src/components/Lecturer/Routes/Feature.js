import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../Layouts/Modal';
import '../Style/giangvien.css';

const Feature = ({ isEdit }) => {
  const [courseName, setCourseName] = useState('');
  const [courseContent, setCourseContent] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [lectures, setLectures] = useState([{ order: '', name: '', video: '', document: '', videoType: 'url' }]);
  const [coverImage, setCoverImage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [instructor, setInstructor] = useState('');
  const [courseVideo, setCourseVideo] = useState('');
  const [learnWhatYouGet, setLearnWhatYouGet] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [errors, setErrors] = useState({});

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && state?.course) {
      const course = state.course;
      setCourseName(course.courseName || '');
      setCourseContent(course.description || '');
      setObjectives(course.objectives || []);
      setLectures(course.lectures || [{ order: '', name: '', video: '', document: '', videoType: 'url' }]);
      setCoverImage(course.image || null);
      setStartDate(course.startDate || '');
      setEndDate(course.endDate || '');
      setCategory(course.category || '');
      setDuration(course.duration || '');
      setInstructor(course.instructor || '');
      setCourseVideo(course.courseVideo || '');
      setLearnWhatYouGet(course.learnWhatYouGet || []);
    }
  }, [isEdit, state]);

  const validateForm = () => {
    const newErrors = {};
    if (!courseName.trim()) newErrors.courseName = 'Tên khóa học là bắt buộc';
    if (!courseContent.trim()) newErrors.courseContent = 'Nội dung là bắt buộc';
    if (!startDate) newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    if (!endDate) newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = 'Ngày bắt đầu phải trước ngày kết thúc';
    }
    if (!coverImage) newErrors.coverImage = 'Ảnh bìa là bắt buộc';
    if (!category.trim()) newErrors.category = 'Danh mục là bắt buộc';
    if (!duration.trim()) newErrors.duration = 'Thời lượng là bắt buộc';
    if (!instructor.trim()) newErrors.instructor = 'Tên giảng viên là bắt buộc';
    if (objectives.length === 0) newErrors.objectives = 'Mục tiêu là bắt buộc';
    if (lectures.length === 0) newErrors.lectures = 'Ít nhất một bài giảng phải có';
    if (learnWhatYouGet.length === 0) newErrors.learnWhatYouGet = 'Ít nhất một mục "Học được gì" phải có';

    lectures.forEach((lecture, index) => {
      if (!lecture.name.trim()) {
        newErrors[`lectureName${index}`] = 'Tên bài giảng là bắt buộc';
      }
      if (!lecture.video && !lecture.document) {
        newErrors[`lectureFile${index}`] = 'Phải có ít nhất một file video hoặc tài liệu';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newCourse = {
        id: isEdit ? state.course.id : Date.now(),
        courseName,
        description: courseContent,
        image: coverImage || 'https://storage.googleapis.com/a1aa/image/0TzyXeqJ-3SrhNVPfxvj8ePIWFBxnJLCDSIO-0TWOhU.jpg',
        objectives,
        lectures,
        startDate,
        endDate,
        creationDate: isEdit ? state.course.creationDate : new Date().toISOString().split('T')[0],
        status: 'Hoạt động',
        instructor,
        lessons: lectures.length,
        category,
        duration,
        courseContent: lectures.map((lecture) => ({ title: lecture.name })),
        courseInfo: { title: courseName, description: courseContent },
        courseVideo: courseVideo || 'https://www.youtube.com/embed/sampleVideo',
        courseDateTime: { date: startDate, time: '08:00 AM' },
        learnWhatYouGet,
      };

      const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      if (isEdit) {
        const updatedCourses = existingCourses.map((course) =>
          course.id === newCourse.id ? newCourse : course
        );
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      } else {
        localStorage.setItem('courses', JSON.stringify([...existingCourses, newCourse]));
      }

      setShowSuccessModal(true);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    navigate('/course-management');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/course-management');
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleRemoveObjective = (index) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const handleAddLearnWhatYouGet = () => {
    setLearnWhatYouGet([...learnWhatYouGet, '']);
  };

  const handleRemoveLearnWhatYouGet = (index) => {
    setLearnWhatYouGet(learnWhatYouGet.filter((_, i) => i !== index));
  };

  const handleLearnWhatYouGetChange = (index, value) => {
    const newLearnWhatYouGet = [...learnWhatYouGet];
    newLearnWhatYouGet[index] = value;
    setLearnWhatYouGet(newLearnWhatYouGet);
  };

  const handleAddLecture = () => {
    setLectures([...lectures, { order: '', name: '', video: '', document: '', videoType: 'url' }]);
  };

  const handleRemoveLecture = (index) => {
    setLectures(lectures.filter((_, i) => i !== index));
  };

  const handleLectureChange = (index, field, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[index][field] = value;
    setLectures(updatedLectures);
  };

  const handleFileUpload = (index, file) => {
    const updatedLectures = [...lectures];
    updatedLectures[index].video = file ? URL.createObjectURL(file) : '';
    setLectures(updatedLectures);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="course-details">
      <div className="section">
        <h2>Mô tả</h2>
        <div className="input-group">
          <label htmlFor="course-name">
            Tên khóa học<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="course-name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          {errors.courseName && <span className="error">{errors.courseName}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="course-content">
            Nội dung<span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            id="course-content"
            value={courseContent}
            onChange={(e) => setCourseContent(e.target.value)}
          />
          {errors.courseContent && <span className="error">{errors.courseContent}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="category">Danh mục<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="duration">Thời lượng<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {errors.duration && <span className="error">{errors.duration}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="instructor">Giảng viên<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
          {errors.instructor && <span className="error">{errors.instructor}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="course-video">Video giới thiệu</label>
          <input
            type="text"
            id="course-video"
            value={courseVideo}
            onChange={(e) => setCourseVideo(e.target.value)}
          />
        </div>
      </div>
      <div className="section">
        <h2>Mục tiêu</h2>
        <div className="add-new" onClick={handleAddObjective}>
          <i className="fas fa-plus"></i>
          <span>Thêm mới</span>
        </div>
        {objectives.map((objective, index) => (
          <div className="input-group" key={index}>
            <input
              type="text"
              placeholder="Nhập mục tiêu"
              value={objective}
              onChange={(e) => handleObjectiveChange(index, e.target.value)}
            />
            <button className="remove-btn" onClick={() => handleRemoveObjective(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
        {errors.objectives && <span className="error">{errors.objectives}</span>}
      </div>
      <div className="section">
        <h2>Học được gì</h2>
        <div className="add-new" onClick={handleAddLearnWhatYouGet}>
          <i className="fas fa-plus"></i>
          <span>Thêm mới</span>
        </div>
        {learnWhatYouGet.map((item, index) => (
          <div className="input-group" key={index}>
            <input
              type="text"
              placeholder="Nhập nội dung học được"
              value={item}
              onChange={(e) => handleLearnWhatYouGetChange(index, e.target.value)}
            />
            <button className="remove-btn" onClick={() => handleRemoveLearnWhatYouGet(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
        {errors.learnWhatYouGet && <span className="error">{errors.learnWhatYouGet}</span>}
      </div>
      <div className="section">
        <h2>Nội dung khóa học</h2>
        <div className="add-new" onClick={handleAddLecture}>
          <i className="fas fa-plus"></i>
          <span>Thêm mới</span>
        </div>
        {lectures.map((lecture, index) => (
          <div className="course-content" key={index}>
            <div className="input-group">
              <label htmlFor={`order-${index}`}>Thứ tự</label>
              <input
                type="number"
                id={`order-${index}`}
                placeholder="Nhập thứ tự"
                value={lecture.order}
                onChange={(e) => handleLectureChange(index, 'order', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor={`lecture-name-${index}`}>
                Tên bài giảng<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                id={`lecture-name-${index}`}
                placeholder="Nhập tên bài giảng"
                value={lecture.name}
                onChange={(e) => handleLectureChange(index, 'name', e.target.value)}
              />
              {errors[`lectureName${index}`] && (
                <span className="error">{errors[`lectureName${index}`]}</span>
              )}
            </div>
            <div className="input-group">
              <label htmlFor={`video-type-${index}`}>Chọn loại video</label>
              <select
                id={`video-type-${index}`}
                value={lecture.videoType}
                onChange={(e) => handleLectureChange(index, 'videoType', e.target.value)}
              >
                <option value="url">Dán đường link video</option>
                <option value="file">Tải video lên</option>
              </select>
            </div>
            {lecture.videoType === 'url' ? (
              <div className="input-group">
                <label htmlFor={`video-url-${index}`}>Video URL</label>
                <input
                  type="text"
                  id={`video-url-${index}`}
                  placeholder="Nhập đường dẫn video"
                  value={lecture.video}
                  onChange={(e) => handleLectureChange(index, 'video', e.target.value)}
                />
              </div>
            ) : (
              <div className="input-group">
                <label htmlFor={`video-upload-${index}`}>Tải lên video</label>
                <input
                  type="file"
                  id={`video-upload-${index}`}
                  accept="video/*"
                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                />
                <i className="fas fa-upload upload-icon"></i>
              </div>
            )}
            <div className="input-group">
              <label htmlFor={`document-${index}`}>Tài liệu</label>
              <input
                type="text"
                id={`document-${index}`}
                placeholder="Nhập đường dẫn tài liệu"
                value={lecture.document}
                onChange={(e) => handleLectureChange(index, 'document', e.target.value)}
              />
            </div>
            <div className="buttons">
              <button className="cancel-btn" onClick={() => handleRemoveLecture(index)}>
                Xóa
              </button>
            </div>
            {errors[`lectureFile${index}`] && (
              <span className="error">{errors[`lectureFile${index}`]}</span>
            )}
          </div>
        ))}
        {errors.lectures && <span className="error">{errors.lectures}</span>}
      </div>
      <div className="section">
        <h2>Ảnh bìa</h2>
        <div
          className="cover-image"
          style={{
            backgroundImage: coverImage ? `url(${coverImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={() => document.getElementById('cover-image-upload').click()}
        >
          {!coverImage && <i className="fas fa-plus upload-icon"></i>}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ display: 'none' }}
            id="cover-image-upload"
          />
        </div>
        {errors.coverImage && <span className="error">{errors.coverImage}</span>}
      </div>
      <div className="learning-time-section">
        <h2>Thời gian học</h2>
        <div className="learning-time-row">
          <div className="learning-time-input">
            <label htmlFor="start-date">
              Ngày bắt đầu<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && <span className="learning-time-error">{errors.startDate}</span>}
          </div>
          <div className="learning-time-input">
            <label htmlFor="end-date">
              Ngày kết thúc<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && <span className="learning-time-error">{errors.endDate}</span>}
          </div>
        </div>
        {errors.dateRange && <span className="learning-time-error">{errors.dateRange}</span>}
      </div>
      <div className="footer-buttons">
        <button className="create-btn" onClick={handleSave}>
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Hủy
        </button>
      </div>
      <Modal
        show={showSuccessModal}
        title={isEdit ? 'Cập nhật khóa học thành công' : 'Thêm khóa học thành công'}
        onConfirm={handleCloseSuccessModal}
        onCancel={handleCloseSuccessModal}
      />
      <Modal
        show={showCancelModal}
        title="Bạn chắc chắn muốn hủy?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelModal}
      />
    </div>
  );
};

export default Feature;
