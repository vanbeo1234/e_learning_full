import React, { useState } from 'react';
import '../../Style/adum.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8081/v1/api',
});

// Interceptor để thêm token vào mọi yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Sử dụng key 'token' như mã cũ
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400 && error.response?.data?.errorStatus === 907) {
      toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
    }
    return Promise.reject(error);
  }
);

const AddUserModal = ({
  formData,
  setFormData,
  handleAddUser, // Hàm này sẽ được gọi lại từ UserManagement
  setAddModalOpen,
  availableCertificates,
  addCertificate,
  removeCertificate,
}) => {
  const [errors, setErrors] = useState({});
  const [selectedCertificate, setSelectedCertificate] = useState('');

  // Hàm chuyển đổi ngày sang định dạng ISO (YYYY-MM-DD) để gửi API
  const convertToISODate = (inputDate) => {
    if (!inputDate) return '';
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hàm xác thực form trước khi gửi
  const validateForm = () => {
    const newErrors = {};
    if (!formData.id?.trim()) newErrors.id = 'Mã định danh là bắt buộc';
    if (!formData.name?.trim()) newErrors.name = 'Họ và tên là bắt buộc';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';
    if (!formData.status) newErrors.status = 'Trạng thái là bắt buộc';

    if (!formData.dob) {
      newErrors.dob = 'Ngày sinh là bắt buộc';
    } else if (new Date(formData.dob) > new Date()) {
      newErrors.dob = 'Ngày sinh không thể là ngày trong tương lai';
    }

    if (!formData.role) newErrors.role = 'Vai trò là bắt buộc';

    const phoneRegex = /^[0-9]{9,15}$/;
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9-15 chữ số)';
    }

    if (!formData.phoneCode) newErrors.phoneCode = 'Mã vùng điện thoại là bắt buộc';
    if (!formData.address?.trim()) newErrors.address = 'Địa chỉ là bắt buộc';

    if (formData.role === 'Giảng viên') {
      if (formData.experience === '' || formData.experience === null || formData.experience === undefined) {
        newErrors.experience = 'Năm kinh nghiệm là bắt buộc';
      }
      if (!formData.certifications?.length) {
        newErrors.certifications = 'Phải chọn ít nhất một chứng chỉ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xác thực dữ liệu sau khi thêm thành công
  const validateResponseData = (responseData, sentData) => {
    const errors = [];
    // Kiểm tra các trường quan trọng
    if (responseData.data?.userCode !== sentData.userCode) {
      errors.push(`Mã định danh trả về (${responseData.data?.userCode}) không khớp với mã gửi (${sentData.userCode}).`);
    }
    if (responseData.data?.email !== sentData.email) {
      errors.push(`Email trả về (${responseData.data?.email}) không khớp với email gửi (${sentData.email}).`);
    }
    if (responseData.data?.roleId !== sentData.roleId) {
      errors.push(`Vai trò trả về (${responseData.data?.roleId}) không khớp với vai trò gửi (${sentData.roleId}).`);
    }
    if (responseData.data?.statusCode !== sentData.statusCode) {
      errors.push(`Trạng thái trả về (${responseData.data?.statusCode}) không khớp với trạng thái gửi (${sentData.statusCode}).`);
    }
    return errors;
  };

  // Xử lý thay đổi số điện thoại (chỉ cho phép số, tối đa 15 chữ số)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 15);
    setFormData({ ...formData, phone: value });
  };

  // Xử lý thay đổi năm kinh nghiệm
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, experience: value === '' ? '' : Number(value) });
  };

  // Xử lý chọn chứng chỉ
  const handleCertificateChange = (e) => {
    const value = e.target.value;
    setSelectedCertificate(value);
    if (value) {
      addCertificate(value);
      setSelectedCertificate('');
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token'); // Kiểm tra token
        if (!token) {
          toast.error('Vui lòng đăng nhập lại để tiếp tục.');
          return;
        }

        const roleId = formData.role === 'Giảng viên' ? 2 : formData.role === 'Học viên' ? 3 : 1;
        const body = {
          userCode: formData.id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword || formData.password,
          gender: formData.gender === 'Nam' ? 1 : 0,
          dateOfBirth: convertToISODate(formData.dob),
          address: formData.address,
          phone: `${formData.phoneCode}${formData.phone}`,
          roleId: roleId,
          statusCode: formData.status === 'Hoạt động' ? 'ACTIVE' : 'INACTIVE',
          certification: formData.certifications.join(','),
          ...(roleId === 1 ? { createdBy: 'admin' } : {}),
          ...(roleId === 2 ? { experience: formData.experience } : {}),
        };

        const { data } = await api.post('/auth/register', body);
        console.warn('🧾 Registration response:\n', JSON.stringify(data, null, 2));

        if (data.errorStatus === 900) {
          // Xác thực dữ liệu trả về
          const validationErrors = validateResponseData(data, body);
          if (validationErrors.length > 0) {
            toast.warn(`Thêm người dùng thành công nhưng có lỗi dữ liệu: ${validationErrors.join(' ')}`);
          } else {
            const roleName = formData.role === 'Giảng viên' ? 'Giảng viên' : formData.role === 'Học viên' ? 'Học viên' : 'Quản lý';
            toast.success(`Đã thêm ${roleName} [${formData.id}] thành công!`);
          }
          setAddModalOpen(false);
          handleReset();
          handleAddUser(); // Gọi hàm từ UserManagement để làm mới danh sách
        } else {
          toast.error(data.message || 'Đăng ký thất bại!');
        }
      } catch (err) {
        console.error('Error in handleAddUser:', err);
        toast.error('Lỗi mạng hoặc server. Vui lòng thử lại.');
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      phoneCode: '+84',
      gender: '',
      status: 'Hoạt động',
      dob: '',
      role: '',
      address: '',
      certifications: [],
      experience: 0,
    });
    setErrors({});
    setSelectedCertificate('');
  };

  return (
    <div id="addModal" className="modal add-modal">
      <div className="modal-content">
        <span className="modal-close-btn" onClick={() => setAddModalOpen(false)}>×</span>
        <h2 className="modal-h2">Thêm người dùng mới</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="modal-grid-item">
              <label className="field-label" title="Mã định danh duy nhất cho người dùng">
                Mã định danh:
              </label>
              <input
                type="text"
                name="id"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
              {errors.id && <span className="error">{errors.id}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Họ và tên đầy đủ của người dùng">
                Họ và tên:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Mật khẩu phải có ít nhất 6 ký tự">
                Mật khẩu:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Xác nhận mật khẩu phải khớp với mật khẩu">
                Xác nhận mật khẩu:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Email hợp lệ để liên hệ">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="modal-grid-item full-width">
              <label className="field-label" title="Số điện thoại từ 9-15 chữ số">
                Số điện thoại:
              </label>
              <div className="phone-input-group">
                <select
                  className="phone-code-select"
                  value={formData.phoneCode || '+84'}
                  onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
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
                  type="text"
                  name="phone"
                  className="phone-number-input"
                  value={formData.phone || ''}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              {errors.phone && <span className="error">{errors.phone}</span>}
              {errors.phoneCode && <span className="error">{errors.phoneCode}</span>}
            </div>

            <div className="modal-grid-item horizontal-field">
              <label className="field-label" title="Chọn giới tính của người dùng">
                Giới tính:
              </label>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={formData.gender === 'Nam'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={formData.gender === 'Nữ'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  />
                  Nữ
                </label>
              </div>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

            <div className="modal-grid-item horizontal-field">
              <label className="field-label" title="Trạng thái hoạt động của người dùng">
                Trạng thái:
              </label>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Hoạt động"
                    checked={formData.status === 'Hoạt động'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  />
                  Hoạt động
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Không hoạt động"
                    checked={formData.status === 'Không hoạt động'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  />
                  Không hoạt động
                </label>
              </div>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Vai trò của người dùng trong hệ thống">
                Vai trò:
              </label>
              <select
                name="role"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="Học viên">Học viên</option>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Ngày sinh không thể là ngày trong tương lai">
                Ngày sinh:
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>

            <div className="modal-grid-item">
              <label className="field-label" title="Địa chỉ hiện tại của người dùng">
                Địa chỉ:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            {formData.role === 'Giảng viên' && (
              <>
                <div className="modal-grid-item">
                  <label className="field-label" title="Chọn các chứng chỉ của giảng viên">
                    Chứng chỉ:
                  </label>
                  <div className="certifications">
                    <select
                      value={selectedCertificate}
                      onChange={handleCertificateChange}
                    >
                      <option value="" disabled>Chọn chứng chỉ</option>
                      {availableCertificates.map((cert, i) => (
                        <option
                          key={i}
                          value={cert}
                          disabled={formData.certifications.includes(cert)}
                        >
                          {cert}
                        </option>
                      ))}
                    </select>
                    <div className="certificate-list">
                      {formData.certifications?.map((cert, idx) => (
                        <div key={idx} className="certificate-item">
                          {cert}
                          <button type="button" onClick={() => removeCertificate(cert)}>x</button>
                        </div>
                      ))}
                    </div>
                    {errors.certifications && <span className="error">{errors.certifications}</span>}
                  </div>
                </div>

                <div className="modal-grid-item">
                  <label className="field-label" title="Số năm kinh nghiệm giảng dạy">
                    Năm kinh nghiệm:
                  </label>
                  <select
                    name="experience"
                    value={formData.experience ?? ''}
                    onChange={handleExperienceChange}
                    required
                  >
                    <option value="">-- Chọn số năm --</option>
                    {[...Array(20).keys()].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.experience && <span className="error">{errors.experience}</span>}
                </div>
              </>
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit" className="modal-button-submit">Thêm</button>
            <button type="button" className="modal-button-reset" onClick={handleReset}>Reset</button>
            <button type="button" className="modal-button-reset" onClick={() => setAddModalOpen(false)}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;