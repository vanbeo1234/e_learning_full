import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Welcome() {
  const navigate = useNavigate();

  // Carousel state for main section
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselItems = [
    {
      image: 'https://images.unsplash.com/photo-1516321310762-47d9e56de51c?q=80&w=2070&auto=format&fit=crop',
      title: 'Học Mọi Lúc, Mọi Nơi',
      text: 'Khám phá các khóa học chất lượng cao, được thiết kế để bạn tự do học tập theo lịch trình của riêng mình.',
    },
    {
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
      title: 'Giảng Viên Hàng Đầu',
      text: 'Học từ các chuyên gia giàu kinh nghiệm, được chứng nhận bởi các tổ chức quốc tế.',
    },
    {
      image: 'https://images.unsplash.com/photo-1501504901894-7c8d995ab56a?q=80&w=2070&auto=format&fit=crop',
      title: 'Kỹ Năng Cho Tương Lai',
      text: 'Nâng cao kỹ năng lập trình, quản lý dự án, và hơn thế nữa với các khóa học thực tiễn.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  // Testimonials state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: 'Nguyễn Thị E',
      occupation: 'Nhà Phát Triển Web',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: '“Khóa học tại E-LEARNING đã thay đổi cách tôi học lập trình. Nội dung thực tiễn, giảng viên tận tâm, và hỗ trợ 24/7 giúp tôi tiến bộ vượt bậc!” 🌟',
    },
    {
      name: 'Trần Văn F',
      occupation: 'Kỹ Sư Phần Mềm',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      text: '“Tôi rất ấn tượng với lộ trình học cá nhân hóa. Các dự án thực tế giúp tôi áp dụng ngay kiến thức vào công việc.”',
    },
    {
      name: 'Lê Thị G',
      occupation: 'Sinh Viên CNTT',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      text: '“E-LEARNING cung cấp tài liệu phong phú và cộng đồng học tập tuyệt vời. Tôi đã tự tin hơn khi làm dự án nhóm!”',
    },
    {
      name: 'Phạm Văn H',
      occupation: 'Chuyên Gia DevOps',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: '“Công nghệ AI hỗ trợ học tập tại đây thật sự khác biệt. Tôi học nhanh hơn và luôn được cập nhật xu hướng mới.”',
    },
  ];

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // Calculate indices for left, center, and right testimonials
  const leftIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  const rightIndex = (currentTestimonial + 1) % testimonials.length;
  
  const courses = [
    { title: 'SQL', image: 'https://cdn-icons-png.flaticon.com/512/4299/4299956.png' },
    { title: 'Java', image: 'https://cdn-icons-png.flaticon.com/512/226/226777.png' },
    { title: 'Python', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' },
    { title: 'C#', image: 'https://cdn-icons-png.flaticon.com/512/6132/6132220.png' },
    { title: 'HTML', image: 'https://cdn-icons-png.flaticon.com/512/732/732212.png' },
    { title: 'React', image: 'https://cdn-icons-png.flaticon.com/512/1126/1126012.png' },
    { title: 'JavaScript', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png' },
    { title: 'CSS', image: 'https://cdn-icons-png.flaticon.com/512/732/732190.png' },
  ];

  const features = [
    {
      icon: 'fas fa-chalkboard-teacher',
      title: 'Giảng Viên Kỹ Năng Cao',
      text: 'Học từ các chuyên gia hàng đầu với kinh nghiệm thực tiễn và chứng chỉ quốc tế.',
    },
    {
      icon: 'fas fa-laptop',
      title: 'Lớp Học Trực Tuyến',
      text: 'Truy cập các bài giảng tương tác, tài liệu đa dạng, và hỗ trợ 24/7.',
    },
    {
      icon: 'fas fa-code',
      title: 'Kỹ Năng Lập Trình Web Nâng Cao',
      text: 'Phát triển kỹ năng lập trình chuyên sâu với các dự án thực tế.',
    },
    {
      icon: 'fas fa-rocket',
      title: 'Cải Tiến Liên Tục',
      text: 'Cập nhật nội dung mới nhất để bạn luôn đi đầu trong ngành công nghệ.',
    },
  ];

  return (
    <div className="welcome-bg">
      <header className="welcome-header">
        <div className="welcome-logo">E-LEARNING</div>
        <div className="welcome-nav-container">
          <nav className="welcome-nav-links">
            <a href="#about">Về Chúng Tôi</a>
            <a href="#courses">Khóa Học</a>
            <a href="#contact">Liên Hệ</a>
            <a href="#faq">FAQ</a>
            <a href="#" onClick={() => navigate('/login')}>
              Đăng Nhập
            </a>
          </nav>
          <button className="welcome-nav-button" onClick={() => navigate('/signup')}>
            THAM GIA NGAY
          </button>
        </div>
      </header>

      {/* Main Section with Carousel */}
      <main className="welcome-main">
        <div className="welcome-carousel">
          <button className="welcome-carousel-arrow welcome-prev" onClick={handlePrevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="welcome-carousel-item" style={{ backgroundImage: `url(${carouselItems[currentSlide].image})` }}>
            <div className="welcome-carousel-content">
              <h1 className="welcome-main-title">{carouselItems[currentSlide].title}</h1>
              <p className="welcome-main-text">{carouselItems[currentSlide].text}</p>
              <button className="welcome-carousel-button" onClick={() => navigate('/signup')}>
                Bắt Đầu Học Ngay
              </button>
            </div>
          </div>
          <button className="welcome-carousel-arrow welcome-next" onClick={handleNextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className="welcome-carousel-dots">
            {carouselItems.map((_, index) => (
              <span
                key={index}
                className={`welcome-dot ${index === currentSlide ? 'welcome-dot-active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section className="welcome-features">
          <h2 className="welcome-features-title">Tại Sao Chọn E-LEARNING?</h2>
          <div className="welcome-features-grid">
            {features.map((feature, index) => (
              <div className="welcome-feature" key={index}>
                <i className={`${feature.icon} welcome-feature-icon`}></i>
                <h3 className="welcome-feature-title">{feature.title}</h3>
                <p className="welcome-feature-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* About Section */}
      <section className="welcome-about" id="about">
        <h2 className="welcome-about-title">Chào Mừng Đến Với E-LEARNING</h2>
        <p className="welcome-about-text">
          E-LEARNING là nền tảng học trực tuyến hàng đầu, mang đến trải nghiệm học tập linh hoạt, hiện đại và hiệu quả. Chúng tôi cung cấp các khóa học đa dạng từ lập trình, thiết kế, đến kỹ năng quản lý, được giảng dạy bởi các chuyên gia hàng đầu.
        </p>
        <div className="welcome-about-features">
          <ul className="welcome-about-list">
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Giảng viên quốc tế với chứng chỉ uy tín</span>
            </li>
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Nội dung cập nhật liên tục, phù hợp xu hướng</span>
            </li>
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Hỗ trợ học viên 24/7 qua chat và diễn đàn</span>
            </li>
          </ul>
          <ul className="welcome-about-list">
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Lộ trình học tập cá nhân hóa</span>
            </li>
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Công nghệ học tập tiên tiến với AI</span>
            </li>
            <li className="welcome-about-item">
              <i className="fas fa-check-circle welcome-about-icon"></i>
              <span>Chứng chỉ hoàn thành được công nhận rộng rãi</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Course Categories */}
      <section className="welcome-courses" id="courses">
        <h2 className="welcome-courses-title">Khám Phá Các Khóa Học</h2>
        <div className="welcome-courses-container">
          <div className="welcome-course-row">
            {courses.slice(0, 4).map((course, index) => (
              <article className="welcome-course" key={index}>
                <img alt={`Khóa học ${course.title}`} className="welcome-course-image" src={course.image} />
                <h3 className="welcome-course-title">{course.title}</h3>
                <div className="welcome-course-duration">
                  <i className="fas fa-clock"></i>
                  <span>3 tháng</span>
                </div>
                <p className="welcome-course-text">Khóa học chuyên sâu với các dự án thực tế và hỗ trợ tận tình.</p>
                <div className="welcome-course-buttons">
                  <button className="welcome-course-button" onClick={() => navigate(`/course/${index + 1}`)}>
                    Tìm Hiểu Thêm
                  </button>
                  <button className="welcome-course-button welcome-join" onClick={() => navigate('/signup')}>
                    Tham Gia
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="welcome-course-row">
            {courses.slice(4).map((course, index) => (
              <article className="welcome-course" key={index}>
                <img alt={`Khóa học ${course.title}`} className="welcome-course-image" src={course.image} />
                <h3 className="welcome-course-title">{course.title}</h3>
                <div className="welcome-course-duration">
                  <i className="fas fa-clock"></i>
                  <span>3 tháng</span>
                </div>
                <p className="welcome-course-text">Khóa học chuyên sâu với các dự án thực tế và hỗ trợ tận tình.</p>
                <div className="welcome-course-buttons">
                  <button className="welcome-course-button" onClick={() => navigate(`/course/${index + 5}`)}>
                    Tìm Hiểu Thêm
                  </button>
                  <button className="welcome-course-button welcome-join" onClick={() => navigate('/signup')}>
                    Tham Gia
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="welcome-popular-courses">
        <h2 className="welcome-popular-courses-title">Các Khóa Học Nổi Bật</h2>
        <div className="welcome-popular-courses-container">
          {[
            {
              title: 'Thiết Kế & Phát Triển Web',
              image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
            },
            {
              title: 'Lập Trình Python Cơ Bản',
              image: 'https://images.unsplash.com/photo-1516321310762-47d9e56de51c?q=80&w=2070&auto=format&fit=crop',
            },
            {
              title: 'ReactJS Chuyên Sâu',
              image: 'https://images.unsplash.com/photo-1501504901894-7c8d995ab56a?q=80&w=2070&auto=format&fit=crop',
            },
          ].map((course, index) => (
            <article className="welcome-popular-course" key={index}>
              <img alt={course.title} className="welcome-popular-course-image" src={course.image} />
              <h3 className="welcome-popular-course-title">{course.title}</h3>
              <div className="welcome-popular-course-rating">
                <span>4.8</span>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <div className="welcome-popular-course-buttons">
                <button className="welcome-popular-course-button" onClick={() => navigate(`/course/${index + 1}`)}>
                  Tìm Hiểu
                </button>
                <button
                  className="welcome-popular-course-button welcome-join"
                  onClick={() => navigate('/signup')}
                >
                  Tham Gia
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="welcome-instructors">
        <h2 className="welcome-instructors-title">Đội Ngũ Giảng Viên</h2>
        <div className="welcome-instructors-container">
          {[
            { name: 'Nguyễn Văn A', title: 'Chuyên Gia Lập Trình' },
            { name: 'Trần Thị B', title: 'Giảng Viên Python' },
            { name: 'Lê Văn C', title: 'Chuyên Gia DevOps' },
            { name: 'Phạm Thị D', title: 'Thiết Kế UI/UX' },
          ].map((instructor, index) => (
            <div className="welcome-instructor" key={index}>
              <img
                alt={`Giảng viên ${instructor.name}`}
                className="welcome-instructor-image"
                src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 1}.jpg`}
              />
              <h4 className="welcome-instructor-name">{instructor.name}</h4>
              <p className="welcome-instructor-title">{instructor.title}</p>
              <div className="welcome-instructor-social">
                <a href="https://instagram.com" className="welcome-social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://facebook.com" className="welcome-social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://x.com" className="welcome-social-link">
                  <i className="fab fa-x-twitter"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="welcome-testimonials">
        <h2 className="welcome-testimonials-title">Ý Kiến Học Viên</h2>
        <div className="welcome-testimonials-container">
          <button
            className="welcome-testimonial-arrow welcome-testimonial-prev"
            onClick={handlePrevTestimonial}
            aria-label="Previous testimonial"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Left Testimonial (Blurred) */}
          <div className="welcome-testimonial welcome-testimonial-left">
            <img
              alt={`Học viên ${testimonials[leftIndex].name}`}
              className="welcome-testimonial-image"
              src={testimonials[leftIndex].image}
            />
            <h4 className="welcome-testimonial-name">{testimonials[leftIndex].name}</h4>
            <p className="welcome-testimonial-occupation">{testimonials[leftIndex].occupation}</p>
            <p className="welcome-testimonial-text">{testimonials[leftIndex].text}</p>
          </div>

          {/* Center Testimonial (Active, Clear) */}
          <div className="welcome-testimonial welcome-testimonial-center">
            <img
              alt={`Học viên ${testimonials[currentTestimonial].name}`}
              className="welcome-testimonial-image"
              src={testimonials[currentTestimonial].image}
            />
            <h4 className="welcome-testimonial-name">{testimonials[currentTestimonial].name}</h4>
            <p className="welcome-testimonial-occupation">{testimonials[currentTestimonial].occupation}</p>
            <p className="welcome-testimonial-text">{testimonials[currentTestimonial].text}</p>
          </div>

          {/* Right Testimonial (Blurred) */}
          <div className="welcome-testimonial welcome-testimonial-right">
            <img
              alt={`Học viên ${testimonials[rightIndex].name}`}
              className="welcome-testimonial-image"
              src={testimonials[rightIndex].image}
            />
            <h4 className="welcome-testimonial-name">{testimonials[rightIndex].name}</h4>
            <p className="welcome-testimonial-occupation">{testimonials[rightIndex].occupation}</p>
            <p className="welcome-testimonial-text">{testimonials[rightIndex].text}</p>
          </div>

          <button
            className="welcome-testimonial-arrow welcome-testimonial-next"
            onClick={handleNextTestimonial}
            aria-label="Next testimonial"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="welcome-testimonial-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`welcome-testimonial-dot ${
                index === currentTestimonial ? 'welcome-testimonial-dot-active' : ''
              }`}
              onClick={() => setCurrentTestimonial(index)}
            ></span>
          ))}
        </div>
      </section>

      <footer className="welcome-footer" id="contact">
  <div className="welcome-footer-container">
    {/* Logo + Info */}
    <div className="welcome-footer-column">
      <div className="welcome-footer-logo">
        <div className="welcome-logo-box">E-LEARNING</div>
      </div>
      <p>
        <strong>Điện thoại:</strong> +84 123 456 789
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:support@elearning.vn">support@elearning.vn</a>
      </p>
      <p>
        <strong>Địa chỉ:</strong>{' '}
        <a
          href="https://maps.google.com/?q=Cau+Giay,+Ha+Noi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Số 80 Dịch Vọng, Cầu Giấy, Hà Nội
        </a>
      </p>
      <img
        src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png"
        alt="DMCA Protected"
        className="welcome-dmca-badge"
      />
    </div>

    {/* Về E-LEARNING */}
    <div className="welcome-footer-column">
      <h4 className="welcome-footer-subtitle">VỀ E-LEARNING</h4>
      <ul className="welcome-footer-links">
        <li><a href="#about">Giới Thiệu</a></li>
        <li><a href="#contact">Liên Hệ</a></li>
        <li><a href="#terms">Điều Khoản</a></li>
        <li><a href="#privacy">Bảo Mật</a></li>
      </ul>
    </div>

    {/* Sản Phẩm */}
    <div className="welcome-footer-column">
      <h4 className="welcome-footer-subtitle">SẢN PHẨM</h4>
      <ul className="welcome-footer-links">
        <li><a href="#nester">Game Nester</a></li>
        <li><a href="#css-diner">Game CSS Diner</a></li>
        <li><a href="#css-selectors">Game CSS Selectors</a></li>
        <li><a href="#froggy">Game Froggy</a></li>
        <li><a href="#froggy-pro">Game Froggy Pro</a></li>
        <li><a href="#scoops">Game Scoops</a></li>
      </ul>
    </div>

    {/* Công Cụ */}
    <div className="welcome-footer-column">
      <h4 className="welcome-footer-subtitle">CÔNG CỤ</h4>
      <ul className="welcome-footer-links">
        <li><a href="#cv-maker">Tạo CV Xin Việc</a></li>
        <li><a href="#link-shortener">Rút Gọn Liên Kết</a></li>
        <li><a href="#clip-path">Clip-path Maker</a></li>
        <li><a href="#snippet">Snippet Generator</a></li>
        <li><a href="#css-grid">CSS Grid Generator</a></li>
        <li><a href="#face-alert">Cảnh Báo Sờ Tay Lên Mặt</a></li>
      </ul>
    </div>

    {/* Thông Tin Công Ty */}
    <div className="welcome-footer-column">
      <h4 className="welcome-footer-subtitle">CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC E-LEARNING</h4>
      <p><strong>Mã số thuế:</strong> 0123456789</p>
      <p><strong>Ngày thành lập:</strong> 29/04/2025</p>
      <p>
        <strong>Lĩnh vực:</strong> Giáo dục, công nghệ - lập trình. Chúng tôi tập trung xây dựng và phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.
      </p>
    </div>
  </div>

  <div className="welcome-footer-bottom">
    <p>© 2018 - 2025 E-LEARNING. Nền tảng học lập trình hàng đầu Việt Nam</p>
    <div className="welcome-footer-social">
      <a href="https://youtube.com" aria-label="YouTube" className="welcome-social-link">
        <i className="fab fa-youtube"></i>
      </a>
      <a href="https://facebook.com" aria-label="Facebook" className="welcome-social-link">
        <i className="fab fa-facebook-square"></i>
      </a>
      <a href="https://tiktok.com" aria-label="TikTok" className="welcome-social-link">
        <i className="fab fa-tiktok"></i>
      </a>
    </div>
  </div>
</footer>

      {/* Scroll to Top */}
      <div className="welcome-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up"></i>
      </div>
    </div>
  );
}

export default Welcome;