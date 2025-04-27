import React from "react";
import { Link } from "react-router-dom";
import '../Style/hocvien.css';

function Article() {
  const articles = [
    {
      category: "Chia sẻ học",
      title: "Tự Học Lập Trình Web Tại Nhà: Lộ Trình Cho Người Mới Bắt Đầu",
      description:
        "Bài viết hướng dẫn bạn từng bước xây dựng nền tảng vững chắc: từ HTML cơ bản, CSS nâng cao đến các project JavaScript thực tế.",
      image: "/images/learn-web.png",
      link: "/article/learn-web",
      author: "Lê Minh Phúc",
      avatar: "https://placehold.co/50x50", // Thay bằng ảnh thật nếu có
      subject: "HTML, CSS, JavaScript",
    },
    {
      category: "Kỹ năng học",
      title: "Học Trực Tuyến Có Hiệu Quả Không? 5 Cách Giúp Bạn Tập Trung Khi Học Online",
      description:
        "Bài viết mách bạn 5 mẹo đơn giản nhưng cực kỳ hiệu quả để giữ sự tập trung khi học từ xa, từ setup góc học tập đến cách sử dụng Pomodoro.",
      image: "/images/focus-online.png",
      link: "/article/focus-tips",
      author: "Trần Thị Hà",
      avatar: "https://placehold.co/50x50",
      subject: "Kỹ năng mềm",
    },
    {
      category: "Công nghệ giáo dục",
      title: "Ứng Dụng AI Trong Học Tập: Tối Ưu Quá Trình Học Trực Tuyến",
      description:
        "AI đang thay đổi cách chúng ta học online. Từ trợ lý học tập ảo, gợi ý bài học đến phân tích thói quen học để tối ưu hóa thời gian.",
      image: "/images/ai-learning.png",
      link: "/article/ai-learning",
      author: "Nguyễn Văn Hùng",
      avatar: "https://placehold.co/50x50",
      subject: "Trí tuệ nhân tạo",
    },
  ];
  

  return (
    <div className="flex-1 p-8">
      {/* Featured Posts */}
      <section className="featured-articles">
        <h2 className="text-2xl font-bold mb-4">Bài viết nổi bật</h2>
        <p className="text-gray-600 mb-6">Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.</p>
        <div className="articles-grid">
          {articles.map((article, index) => (
            <div className="article-card" key={index}>
              <div className="article-header">
                <img src={article.avatar} alt={article.author} className="article-avatar" />
                <div className="article-author">{article.author}</div>
                <i className="fas fa-ellipsis-h article-ellipsis"></i>
              </div>
              <div className="article-content">
                <span className="article-category">{article.category}</span>
                <h3 className="article-title">
                  <Link to={article.link}>{article.title}</Link>
                </h3>
                <p className="article-description">{article.description}</p>
                <div className="article-subject">{article.subject}</div>
              </div>
              <img src={article.image} alt={article.title} className="article-image" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Article;