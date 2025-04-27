import React, { useState, useEffect, useCallback, useMemo } from "react";
import AddUserModal from "./Function/Add";
import EditUserModal from "./Function/Edit";
import "../Style/adum.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserManagement = () => {
  // --- State ---
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    dob: "",
    role: "",
    status: "",
  });
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    phoneCode: "+84",
    address: "",
    dob: "",
    role: "",
    status: "Hoạt động",
    experience: 0,
    certifications: [],
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newlyAddedUserId, setNewlyAddedUserId] = useState(null);

  const availableCertificates = [
    "Chứng chỉ Sư phạm",
    "Chứng chỉ Giảng dạy Quốc tế TESOL",
    "Chứng chỉ IELTS 7.0+",
    "Chứng chỉ TOEFL iBT",
    "Chứng chỉ Quản lý Giáo dục",
    "Chứng chỉ Đào tạo Kỹ năng Mềm",
    "Chứng chỉ Công nghệ Giáo dục",
    "Chứng chỉ Phát triển Chương trình Đào tạo",
    "Chứng chỉ Đánh giá và Kiểm định Chất lượng Giáo dục",
    "Chứng chỉ Huấn luyện Doanh nghiệp",
  ];

  // Ánh xạ roleId
  const roleMapping = {
    "Học viên": "3",
    "Giảng viên": "2",
    "Quản lý": "1",
  };

  // Ánh xạ ngược từ roleId sang tên vai trò
  const roleIdToNameMapping = {
    3: "Học viên",
    2: "Giảng viên",
    1: "Quản lý",
  };

  // Memoize searchCriteria
  const memoizedSearchCriteria = useMemo(
    () => searchCriteria,
    [
      searchCriteria.name,
      searchCriteria.dob,
      searchCriteria.role,
      searchCriteria.status,
    ]
  );

  // --- Helper Functions ---
  const convertToISODate = useCallback((inputDate) => {
    if (!inputDate) return "";
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fetchUsers = useCallback(
    async (criteria, page) => {
      setIsLoading(true);
      try {
        const params = {
          name: criteria.name || "",
          dateOfBirth: criteria.dob ? convertToISODate(criteria.dob) : "",
          statusCode:
            criteria.status === "Hoạt động"
              ? "ACTIVE"
              : criteria.status === "Không hoạt động"
              ? "INACTIVE"
              : null,
          roleId: criteria.role ? roleMapping[criteria.role] : undefined,
          page: page - 1, // API sử dụng trang 0-based
          size: itemsPerPage,
        };

        console.log("API Request Params:", params); // Debug: Kiểm tra tham số gửi đi

        const response = await axios.get("http://localhost:8081/v1/api/user", {
          params,
        });
        if (response.status === 200 && response.data.errorStatus === 900) {
          if (!Array.isArray(response.data.data)) {
            throw new Error("Dữ liệu trả về không phải là mảng");
          }

          const users = response.data.data.map((user) => {
            return {
              id: user.id || user.userCode || "",
              name: user.fullName || user.name || "",
              email: user.emailAddress || user.email || "",
              phone: user.phoneNumber || user.phone || "",
              address: user.addressDetails || user.address || "",
              dob: user.birthDate || user.dateOfBirth || "",
              role: user.role_id
                ? roleIdToNameMapping[user.role_id] || user.role_id
                : user.role
                ? roleIdToNameMapping[user.role] || user.role
                : "",
              status: user.status
                ? user.status.toUpperCase() === "ACTIVE"
                  ? "Hoạt động"
                  : "Không hoạt động"
                : user.statusCode
                ? user.statusCode.toUpperCase() === "ACTIVE"
                  ? "Hoạt động"
                  : "Không hoạt động"
                : "",
              experience: user.experienceYears || user.experience || 0,
              certifications: user.cert
                ? [user.cert]
                : user.certification
                ? [user.certification]
                : [],
              gender: user.userGender || user.gender || "",
            };
          });

          console.log("Mapped Users:", users); // Debug: Kiểm tra dữ liệu sau ánh xạ

          setFilteredUsers(users);
          setTotalPages(response.data.pagination.totalPages || 1);
          if (users.length === 0) {
            toast.info(
              "Không có người dùng nào phù hợp với tiêu chí tìm kiếm."
            );
          } else {
            toast.success(response.data.message);
          }
        } else {
          throw new Error("Phản hồi không hợp lệ từ API");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response) {
          if (
            error.response.status === 400 &&
            error.response.data.body?.errorStatus === 901
          ) {
            toast.error(error.response.data.body.message);
          } else if (
            error.response.status === 500 &&
            error.response.data.body?.errorStatus === 902
          ) {
            toast.error(error.response.data.body.message);
          } else {
            toast.error("Lỗi không xác định khi lấy danh sách người dùng!");
          }
        } else {
          toast.error("Không thể kết nối đến server!");
        }
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, convertToISODate]
  );

  // --- Effects ---
  useEffect(() => {
    fetchUsers(memoizedSearchCriteria, currentPage);
  }, [fetchUsers, currentPage]);
  const cleanString = (str) => {
    return str.replace(/[^\x20-\x7E]/g, "").trim();
  };
  // --- Handlers ---
  const handleAddUser = async () => {
    try {
      setIsLoading(true);

      const roleId = formData.role === "Học viên" ? 3 : 2;
      const genderValue = formData.gender === "Nam" ? 1 : 0;
      const cleanedPassword = cleanString(formData.password);
      const cleanedConfirmPassword = cleanString(formData.confirmPassword);

      const payload = {
        userCode: formData.id.trim(),
        name: formData.name,
        email: formData.email,
        password: cleanedPassword,
        confirmPassword: cleanedConfirmPassword,
        phone: formData.phone,
        address: formData.address || null,
        dateOfBirth: formData.dob || null,
        roleId,
        statusCode: "ACTIVE",
        experience:
          roleId === 2 && formData.experience
            ? parseInt(formData.experience)
            : null,
        certification:
          roleId === 2 && formData.certifications.length > 0
            ? formData.certifications.join(",")
            : null,
        gender: genderValue,
        createdBy: "SYSTEM",
      };

      const response = await fetch(
        "http://localhost:8081/v1/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Phản hồi không hợp lệ (không phải JSON)");
      }

      const data = await response.json();

      if (
        (response.status === 201 || response.status === 200) &&
        data.errorStatus === 900
      ) {
        toast.success("Thêm người dùng thành công!");
        setAddModalOpen(false);
        resetForm();
        fetchUsers(memoizedSearchCriteria, 1);
      } else {
        let errorMessage = "Thêm người dùng thất bại.";
        if (data.errorStatus === 901) {
          errorMessage = "Email hoặc mã người dùng đã tồn tại.";
        } else if (data.errorStatus === 902) {
          errorMessage = "Lỗi hệ thống, vui lòng thử lại sau.";
        } else if (data.errorStatus === 905) {
          errorMessage = "Mật khẩu xác nhận không khớp.";
        } else if (data.errorStatus === 906) {
          errorMessage =
            "Mật khẩu không đủ mạnh. Phải có ít nhất 12 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        } else {
          errorMessage = data.message || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error in handleAddUser:", err);
      toast.error("Lỗi khi thêm người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  const addCertificate = (certificate) => {
    if (formData.certifications.length >= 10) {
      toast.error("Không thể thêm quá 10 chứng chỉ!");
      return;
    }
    if (!formData.certifications.includes(certificate)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certificate],
      }));
    } else {
      toast.error("Chứng chỉ đã được chọn!");
    }
  };

  const removeCertificate = (certificate) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (item) => item !== certificate
      ),
    }));
  };

  const toggleSelectAll = () => {
    setSelectedUsers(selectAll ? [] : filteredUsers.map((u) => u.id));
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleEditUser = (user) => {
    setFormData({
      ...user,
      password: "",
      confirmPassword: "",
      phoneCode: user.phone.slice(0, 3) || "+84",
      phone: user.phone.slice(3) || "",
    });
    setEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const request = {
        userCode: formData?.id,
        phone: formData?.phoneCode + formData?.phone,
        address: formData?.address,
        statusCode: formData?.status === "Hoạt động" ? "ACTIVE" : "INACTIVE",
        experience: formData?.experience,
        certification:
          formData?.certifications?.length > 0
            ? formData?.certifications[0]
            : "",
      };
      const response = await axios.put(
        "http://localhost:8081/v1/api/user",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.errorStatus == 900) {
        toast.success("Cập nhật người dùng thành công!");
        setEditModalOpen(false);
        resetForm();
        fetchUsers(memoizedSearchCriteria, currentPage);
      } else {
        toast.error(
          response?.data?.body?.message || "Lỗi khi cập nhật người dùng"
        );
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(memoizedSearchCriteria, 1);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      phone: "",
      phoneCode: "+84",
      address: "",
      dob: "",
      role: "",
      status: "Hoạt động",
      experience: 0,
      certifications: [],
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const disableSelected = async () => {
    setIsLoading(true);
    try {
      // TODO: Thêm API PATCH hoặc PUT để vô hiệu hóa người dùng
      toast.success("Vô hiệu hóa người dùng thành công!");
      fetchUsers(memoizedSearchCriteria, currentPage);
    } catch (error) {
      console.error("Error disabling users:", error);
      toast.error("Lỗi khi vô hiệu hóa người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  const enableSelected = async () => {
    setIsLoading(true);
    try {
      // TODO: Thêm API PATCH hoặc PUT để kích hoạt người dùng
      toast.success("Kích hoạt người dùng thành công!");
      fetchUsers(memoizedSearchCriteria, currentPage);
    } catch (error) {
      console.error("Error enabling users:", error);
      toast.error("Lỗi khi kích hoạt người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- New Logic for Button Disabling ---
  const canDisable =
    selectedUsers.length > 0 &&
    !selectedUsers.every((id) => {
      const user = filteredUsers.find((u) => u.id === id);
      return user?.status === "Không hoạt động";
    });

  const canEnable =
    selectedUsers.length > 0 &&
    !selectedUsers.every((id) => {
      const user = filteredUsers.find((u) => u.id === id);
      return user?.status === "Hoạt động";
    });

  // --- Phân trang ---
  const currentUsers = useMemo(() => {
    return filteredUsers; // API đã phân trang
  }, [filteredUsers]);

  // --- Render ---
  return (
    <div className="user-management-container">
      {isLoading && <div className="loading-overlay">Đang tải...</div>}
      <div className="user-management-content">
        <div className="user-management-card">
          <div className="user-management-search-form">
            <label htmlFor="name" className="align-left">
              Họ và tên:
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={searchCriteria.name}
                onChange={handleSearchChange}
              />
            </label>
            <label htmlFor="dob" className="shift-right">
              Ngày sinh:
              <input
                type="date"
                name="dob"
                value={searchCriteria.dob}
                onChange={handleSearchChange}
              />
            </label>
            <label htmlFor="role" className="shift-right">
              Vai trò:
              <select
                name="role"
                value={searchCriteria.role}
                onChange={handleSearchChange}
              >
                <option value="">Tất cả</option>
                <option value="Học viên">Học viên</option>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </label>
            <label htmlFor="status" className="align-right">
              Trạng thái:
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
          </div>

          <div className="user-management-action-buttons">
            <button
              className="btn btn-green"
              onClick={() => setAddModalOpen(true)}
            >
              Thêm
            </button>
            {/* <button
              className="btn btn-red"
              onClick={() => {
                if (!canDisable) {
                  toast.error("Tất cả người dùng đã chọn đã bị vô hiệu hóa!");
                  return;
                }
                setActionType('disable');
                setConfirmModalOpen(true);
              }}
              disabled={!canDisable}
            >
              Vô hiệu hóa
            </button>
            <button
              className="btn btn-yellow"
              onClick={() => {
                if (!canEnable) {
                  toast.error("Tất cả người dùng đã chọn đã được kích hoạt!");
                  return;
                }
                setActionType('enable');
                setConfirmModalOpen(true);
              }}
              disabled={!canEnable}
            >
              Kích hoạt
            </button> */}
            <button className="btn btn-blue" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>STT</th>
                  <th>Mã</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Kinh nghiệm</th>
                  <th>Chứng chỉ</th>
                  <th>Tính năng</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={
                        user.id === newlyAddedUserId ? "highlight-new-user" : ""
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                        />
                      </td>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>{user.gender}</td>
                      <td>{user.dob}</td>
                      <td>{user.role}</td>
                      <td className="status">{user.status}</td>
                      <td>{user.experience}</td>
                      <td>{user.certifications.join(", ") || "Không có"}</td>
                      <td>
                        <i
                          className="fas fa-pencil-alt icon-edit"
                          onClick={() => handleEditUser(user)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" style={{ textAlign: "center" }}>
                      Không có người dùng nào phù hợp với tiêu chí tìm kiếm.
                    </td>
                  </tr>
                )}
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
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddUserModal
          formData={formData}
          setFormData={setFormData}
          handleAddUser={handleAddUser}
          setAddModalOpen={setAddModalOpen}
          availableCertificates={availableCertificates}
          addCertificate={addCertificate}
          removeCertificate={removeCertificate}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          formData={formData}
          setFormData={setFormData}
          handleUpdateUser={handleUpdateUser}
          setEditModalOpen={setEditModalOpen}
          availableCertificates={availableCertificates}
          addCertificate={addCertificate}
          removeCertificate={removeCertificate}
        />
      )}

      {isConfirmModalOpen && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>
              Bạn có chắc chắn muốn{" "}
              {actionType === "disable" ? "vô hiệu hóa" : "kích hoạt"}{" "}
              {selectedUsers.length} người dùng đã chọn không?
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-red"
                onClick={() => setConfirmModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-green"
                onClick={() => {
                  if (actionType === "disable") {
                    disableSelected();
                  } else {
                    enableSelected();
                  }
                  setConfirmModalOpen(false);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
