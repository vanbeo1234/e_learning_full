// src/components/CourseManagement/Function/Disable.jsx
import React, { useState } from 'react';
import Modala from './Modala';
import '../../Style/adcm.css';

const DisableCourses = ({ selectedCourses, setCourses, setSelectedCourses, disabled }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDisable = () => {
    setCourses((prev) =>
      prev.map((course) =>
        selectedCourses.includes(course.id) ? { ...course, status: 'Không hoạt động' } : course
      )
    );
    setSelectedCourses([]);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="btn btn-red"
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        Vô hiệu hóa
      </button>
      <Modala
        show={showModal}
        type="cancel"
        title="Xác nhận vô hiệu hóa"
        content="Bạn có chắc muốn vô hiệu hóa các khóa học đã chọn?"
        onConfirm={handleDisable}
        onCancel={() => setShowModal(false)}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="confirm-modal"
      />
    </>
  );
};

export default DisableCourses;