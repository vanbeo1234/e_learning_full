import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import FontAwesome icons
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsAuthenticated }) => {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      console.log("🚀 Gửi yêu cầu đăng nhập với:", { userCode, password });

      const response = await fetch("http://localhost:8081/v1/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCode, password }),
      });

      console.log("📩 Trạng thái phản hồi:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Đăng nhập thành công, dữ liệu:", data);

        // Kiểm tra role chính xác không
        console.log("🧾 Vai trò người dùng:", data.role);

        // Lưu vào localStorage (sử dụng user object để dễ debug hơn)
        localStorage.setItem("token", data.token);
        localStorage.setItem("userCode", data.userCode);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", data.id);

        // Kiểm tra xem đã lưu đúng chưa

        // Set trạng thái đăng nhập (nếu dùng context)
        if (typeof setIsAuthenticated === "function") {
          setIsAuthenticated(true);
        }

        toast.success("Đăng nhập thành công!");

        // Điều hướng theo role
        if (data.role === "Student" || data.role === "Học viên") {
          console.log("➡️ Điều hướng đến /home");
          navigate("/home");
        } else if (data.role === "Lecturer" || data.role === "Giảng viên") {
          console.log("➡️ Điều hướng đến /courses");
          navigate("/courses");
        } else {
          console.log("➡️ Điều hướng đến /user-management");
          navigate("/user-management");
        }
      } else {
        const errorData = await response.json();
        console.error("❌ Lỗi từ server:", errorData);
        toast.error(
          errorData.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại."
        );
      }
    } catch (error) {
      console.error("🔥 Lỗi trong quá trình đăng nhập:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <ToastContainer />
      <header style={styles.loginHeader}>
        <div style={styles.loginLogo}>E LEARNING</div>
        <div style={styles.loginNavContainer}>
          <nav style={styles.loginNavLinks}>
            <a href="#" style={styles.loginNavLink}>
              Về chúng tôi
            </a>
            <a href="#" style={styles.loginNavLink}>
              Khóa học
            </a>
            <a href="#" style={styles.loginNavLink}>
              Liên hệ với chúng tôi
            </a>
            <a href="#" style={styles.loginNavLink}>
              FAQ's
            </a>
          </nav>
        </div>
      </header>
      <main style={styles.loginMainContainer}>
        <div style={styles.loginFormContainer}>
          <div style={styles.loginButtonContainer}>
            <Link to="/login">
              <button style={styles.loginButton}>Đăng nhập</button>
            </Link>
            <Link to="/signup">
              <button style={styles.registerButton}>Đăng ký</button>
            </Link>
          </div>
          <div style={styles.loginInputFields}>
            <div>
              <label htmlFor="userCode">Tên đăng nhập</label>
              <input
                type="text"
                id="userCode"
                placeholder="Nhập Tên người dùng của bạn"
                style={styles.loginInputField}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                required
                aria-label="User Code"
              />
            </div>
            <div>
              <label htmlFor="password">Mật khẩu</label>
              <div style={styles.loginPasswordContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  style={styles.loginInputField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <i
                  style={{
                    ...styles.loginPasswordIcon,
                    ...(passwordVisible ? styles.loginPasswordIconActive : {}),
                  }}
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </i>
              </div>
            </div>
            <button style={styles.loginSubmitButton} onClick={handleLogin}>
              Đăng nhập
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  loginHeader: {
    backgroundColor: "rgb(128, 229, 255)",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginLogo: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#008cff",
  },
  loginNavContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "5px",
  },
  loginNavLinks: {
    display: "flex",
    justifyContent: "space-between",
    listStyleType: "none",
    margin: "0",
    paddingRight: "150px",
  },
  loginNavLink: {
    textDecoration: "none",
    padding: "10px 20px",
    color: "#333",
  },
  loginNavLinkHover: {
    color: "#67a9ff",
  },
  loginMainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundSize: "cover",
    padding: "200px",
  },
  loginFormContainer: {
    backgroundColor: "#ffffff",
    width: "550px",
    maxHeight: "90vh",
    padding: "50px",
    border: "1px solid #88d5ff",
    boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
  },
  loginButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
    backgroundColor: "#9dc7ff",
    padding: "15px",
    borderRadius: "20px",
    transition: "background-color 0.3s",
  },
  loginButton: {
    padding: "15px 50px",
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    backgroundColor: "#4299e1",
    color: "white",
    transition: "background-color 0.3s",
  },
  registerButton: {
    padding: "15px 50px",
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    backgroundColor: "#edf2f7",
    color: "#005eff",
    marginLeft: "20px",
    transition: "background-color 0.3s",
  },
  loginInputFields: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontSize: "20px",
    padding: "20px",
  },
  loginInputField: {
    width: "100%",
    padding: "12px",
    border: "3px solid #a8cbff",
    borderRadius: "4px",
  },
  loginPasswordContainer: {
    position: "relative",
  },
  loginPasswordIcon: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#a0aec0",
    cursor: "pointer",
  },
  loginPasswordIconActive: {
    color: "#000000",
  },
  loginSubmitButton: {
    backgroundColor: "#4299e1",
    color: "white",
    width: "100%",
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default Login;
