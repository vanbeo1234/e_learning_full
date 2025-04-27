import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { CourseProvider } from "./components/Admin/Course/Function/Context/CourseContext";

// Guest Components
import Welcome from "./components/Page/Welcome";
import Login from "./components/Page/Login";
import Signup from "./components/Page/Signup";

// Student Components
import Sidebar from "./components/Student/Layout/Sidebar";
import Header from "./components/Student/Layout/Header";
import Footer from "./components/Student/Layout/Footer";
import Home from "./components/Student/Routes/Home";
import MyCourse from "./components/Student/Routes/MyCourse";
import LearningProgress from "./components/Student/Routes/LearningProgress";
import Article from "./components/Student/Routes/Article";
import CourseReactJS from "./components/Student/Routes/Course Information/CourseReactJS";
import Learn1 from "./components/Student/Routes/Course Information/Study Course/Learn1";
import Learn2 from "./components/Student/Routes/Course Information/Study Course/Learn2";
import Learn3 from "./components/Student/Routes/Course Information/Study Course/Learn3";
import CourseDetail from "./components/Student/Routes/CourseDetail";

// Lecturer Components
import Sidebars from "./components/Lecturer/Layouts/Sidebar";
import Headers from "./components/Lecturer/Layouts/Header";
import Homes from "./components/Lecturer/Routes/Homes";
import CourseForm from "./components/Lecturer/Routes/CourseForm";
import CourseInfo from "./components/Lecturer/Routes/CourseInfo";
import CourseTable from "./components/Lecturer/Routes/CourseTable";
import FeedbackList from "./components/Lecturer/Routes/FeedbackList";
import Feature from "./components/Lecturer/Routes/Feature";

// Admin Components
import Headera from "./components/Admin/Layout/Headera";
import Sidebara from "./components/Admin/Layout/Sidebara";
import UserManagement from "./components/Admin/User/UserManagement";
import AddUserModal from "./components/Admin/User/Function/Add";
import EditUserModal from "./components/Admin/User/Function/Edit";
import UserSearchForm from "./components/Admin/User/Function/Search";
import CourseManagement from "./components/Admin/Course/CourseManagement";
import AddCourse from "./components/Admin/Course/Function/AddCourse";
import EditCourse from "./components/Admin/Course/Function/EditCourse";
import SearchCourses from "./components/Admin/Course/Function/Search";
import Modala from "./components/Admin/Course/Function/Modala";

// PrivateRoute Component for Role-Based Access
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

// AppContent Component to Handle Layout and Footer Logic
function AppContent() {
  const location = useLocation();
  // Include /course/:courseId in footer paths
  const showFooterPaths = [
    "/home",
    "/my-course",
    "/progress",
    "/article",
    "/course/:courseId",
  ];
  const shouldShowFooter =
    showFooterPaths.includes(location.pathname) ||
    location.pathname.startsWith("/course/");

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userCode");
    window.location.href = "/login"; // Force redirect to login
  };

  return (
    <div className="app-wrapper">
      <Routes>
        {/* Guest Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route
          path="/home"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Trang chủ" isSearch={true} />
                <Home />
              </div>
            </div>
          }
        />
        <Route
          path="/my-course"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Khóa học của tôi" />
                <MyCourse />
              </div>
            </div>
          }
        />
        <Route
          path="/progress"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Tiến độ học tập" />
                <LearningProgress />
              </div>
            </div>
          }
        />
        <Route
          path="/article"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Bài viết" />
                <Article />
              </div>
            </div>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Thông tin khóa học" />
                <CourseReactJS />
              </div>
            </div>
          }
        />
        <Route
          path="/course/detail/:courseId"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Chi tiết khóa học" />
                <CourseDetail />
              </div>
            </div>
          }
        />
        <Route
          path="/learn1"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Học ReactJS" />
                <Learn1 />
              </div>
            </div>
          }
        />
        <Route
          path="/learn2"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Học ReactJS" />
                <Learn2 />
              </div>
            </div>
          }
        />
        <Route
          path="/learn3"
          element={
            <div className="container">
              <Sidebar handleLogout={handleLogout} />
              <div className="content">
                <Header title="Học ReactJS" />
                <Learn3 />
              </div>
            </div>
          }
        />

        {/* Lecturer Routes */}
        {/* <Route
          path="/homeg"
          element={
            <div className="container">
              <Sidebars handleLogout={handleLogout} />
              <div className="content">
                <Headers title="Trang chủ giảng viên" />
                <Homes />
              </div>
            </div>
          }
        /> */}
        <Route
          path="/courses"
          element={
            <div className="container">
              <Sidebars handleLogout={handleLogout} />
              <div className="content">
                <Headers title="Danh sách khóa học" />
                <CourseTable />
              </div>
            </div>
          }
        />
        <Route
          path="/create-course"
          element={
            <div className="container">
              <Sidebars handleLogout={handleLogout} />
              <div className="content">
                <Headers title="Tạo khóa học mới" />
                <AddCourse isAdmin={false} />
              </div>
            </div>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <div className="container">
              <Sidebars handleLogout={handleLogout} />
              <div className="content">
                <Headers title="Chỉnh sửa khóa học" />
                {/* <Feature isEdit={true} /> */}
                <EditCourse isAdmin={false} />
              </div>
            </div>
          }
        />
        <Route
          path="/course-info/:id"
          element={
            <div className="container">
              {localStorage.getItem("userRole") === "Lecturer" ? (
                <Sidebars handleLogout={handleLogout} />
              ) : (
                <Sidebar handleLogout={handleLogout} />
              )}
              <div className="content">
                {localStorage.getItem("userRole") === "Lecturer" ? (
                  <Headers title="Thông tin khóa học" />
                ) : (
                  <Header title="Thông tin khóa học" />
                )}
                <CourseInfo />
              </div>
            </div>
          }
        />
        <Route
          path="/feedback"
          element={
            <div className="container">
              <Sidebars handleLogout={handleLogout} />
              <div className="content">
                <Headers title="Phản hồi từ học viên" />
                <FeedbackList />
              </div>
            </div>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/user-management"
          element={
            <div className="container">
              <Sidebara handleLogout={handleLogout} />
              <div className="main-content">
                <Headera title="Quản lý người dùng" />
                <UserManagement />
              </div>
            </div>
          }
        />
        <Route
          path="/course-management"
          element={
            <div className="container">
              <Sidebara handleLogout={handleLogout} />
              <div className="main-content">
                <Headera title="Quản lý khóa học" />
                <CourseManagement />
              </div>
            </div>
          }
        />
        <Route
          path="/add-course"
          element={
            <div className="container">
              <Sidebara handleLogout={handleLogout} />
              <div className="main-content">
                <Headera title="Thêm khóa học" />
                <AddCourse isAdmin={true} />
              </div>
            </div>
          }
        />
        <Route
          path="/edit-course-admin/:id"
          element={
            <div className="container">
              <Sidebara handleLogout={handleLogout} />
              <div className="main-content">
                <Headera title="Chỉnh sửa khóa học" />
                <EditCourse isAdmin={true} />
              </div>
            </div>
          }
        />

        {/* Redirect Unknown Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CourseProvider>
        <AppContent />
      </CourseProvider>
    </Router>
  );
}

export default App;
