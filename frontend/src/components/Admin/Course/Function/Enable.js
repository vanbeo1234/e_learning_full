// src/components/CourseManagement/Function/Enable.jsx
import React, { useState } from 'react';
import Modala from './Modala';
import '../../Style/adcm.css';

const EnableCourses = ({ selectedCourses, setCourses, setSelectedCourses, disabled }) => {
  const [showModal, setShowModal] = useState(false);

  const handleEnable = () => {
    setCourses((prev) =>
      prev.map((course) =>
        selectedCourses.includes(course.id) ? { ...course, status: 'Hoạt động' } : course
      )
    );
    setSelectedCourses([]);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="btn btn-yellow"
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        Kích hoạt
      </button>
      <Modala
        show={showModal}
        type="cancel"
        title="Xác nhận kích hoạt"
        content="Bạn có chắc muốn kích hoạt lại các khóa học đã chọn?"
        onConfirm={handleEnable}
        onCancel={() => setShowModal(false)}
        confirmText="Xác nhận"
        cancelText="Hủy"
        modalClass="confirm-modal"
      />
    </>
  );
};

export default EnableCourses;