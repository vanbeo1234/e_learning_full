// File: components/UserManagement/Function/Edit.jsx
import React from "react";
import "../../Style/adum.css";

const EditUserModal = ({
  formData,
  setFormData,
  handleUpdateUser,
  setEditModalOpen,
  availableCertificates,
  addCertificate,
  removeCertificate,
}) => {
  return (
    <div id="editModal" className="modal edit-modal">
      <div className="modal-content">
        <span
          className="modal-close-btn"
          onClick={() => setEditModalOpen(false)}
        >
          ×
        </span>
        <h2 className="modal-h2">Chỉnh sửa người dùng</h2>

        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
        >
          <div className="modal-grid">
            {/* Mã định danh */}
            <div className="modal-grid-item">
              <label className="field-label">Mã định danh:</label>
              <input
                disabled
                type="text"
                name="id"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                required
              />
            </div>

            {/* Họ và tên */}
            <div className="modal-grid-item">
              <label className="field-label">Họ và tên:</label>
              <input
                disabled
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="modal-grid-item">
              <label className="field-label">Email:</label>
              <input
                disabled
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Giới tính */}
            <div className="modal-grid-item horizontal-field">
              <label className="field-label">Giới tính:</label>
              <div className="inline-options">
                <label>
                  <input
                    disabled
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={formData.gender === "Nam"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  />{" "}
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={formData.gender === "Nữ"}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  />{" "}
                  Nữ
                </label>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="modal-grid-item horizontal-field">
              <label className="field-label">Trạng thái:</label>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Hoạt động"
                    checked={formData.status === "Hoạt động"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />{" "}
                  Hoạt động
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Không hoạt động"
                    checked={formData.status === "Không hoạt động"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />{" "}
                  Không hoạt động
                </label>
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="modal-grid-item">
              <label className="field-label">Ngày sinh:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
              />
            </div>

            {/* Vai trò */}
            <div className="modal-grid-item">
              <label className="field-label">Vai trò:</label>
              <select
                disabled
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="Học viên">Học viên</option>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </div>

            {/* Số điện thoại */}
            <div className="modal-grid-item">
              <label className="field-label">Số điện thoại:</label>
              <div className="phone-input-group">
                <select
                  className="phone-code-select"
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneCode: e.target.value })
                  }
                  required
                >
                  <option value="+84">+84</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                  <option value="+91">+91</option>
                </select>
                <input
                  type="tel"
                  className="phone-number-input"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="modal-grid-item">
              <label className="field-label">Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {/* Kinh nghiệm */}
            {formData?.role != "Học viên" ? (
              <>
                <div className="modal-grid-item">
                  <label className="field-label">Năm kinh nghiệm:</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  >
                    {[...Array(20).keys()].map((year) => (
                      <option key={year + 1} value={year + 1}>
                        {year + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-grid-item">
                  <label className="field-label">Chứng chỉ:</label>
                  <div className="certifications">
                    <select
                      onChange={(e) => addCertificate(e.target.value)}
                      defaultValue=""
                      className="certificate-select"
                    >
                      <option value="" disabled>
                        Chọn chứng chỉ
                      </option>
                      {availableCertificates.map((certificate, index) => (
                        <option key={index} value={certificate}>
                          {certificate}
                        </option>
                      ))}
                    </select>

                    <div className="certificate-list">
                      {formData.certifications?.map((certificate, index) => (
                        <div key={index} className="certificate-item">
                          {certificate}
                          <button
                            type="button"
                            onClick={() => removeCertificate(certificate)}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="modal-buttons">
            <button type="submit" className="modal-button-submit">
              Cập nhật
            </button>
            <button
              type="reset"
              className="modal-button-reset"
              onClick={() => setEditModalOpen(false)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
