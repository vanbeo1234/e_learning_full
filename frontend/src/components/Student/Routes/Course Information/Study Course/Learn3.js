import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './learn.css';

const Learn3 = () => {
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showQA, setShowQA] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(2);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const totalLessons = 10;

  useEffect(() => {
    // API: Fetch progress data for Learn3
    fetch('https://api.example.com/progress/learn3')
      .then(response => response.json())
      .then(data => {
        console.log('Progress data for Learn3:', data);
        setCompletedLessons(data.completedLessons || 2);
      })
      .catch(error => {
        console.error('Error fetching progress data for Learn3:', error);
        setCompletedLessons(2);
      });

    // API: Fetch comments data for Learn3
    fetch('https://api.example.com/comments/learn3')
      .then(response => response.json())
      .then(data => {
        console.log('Comments data for Learn3:', data);
        setComments(data.comments || []);
      })
      .catch(error => console.error('Error fetching comments data for Learn3:', error));

    // API: Fetch saved note for Learn3
    fetch('https://api.example.com/notes/learn3')
      .then(response => response.json())
      .then(data => {
        console.log('Note data for Learn3:', data);
        setNewNote(data.note || '');
      })
      .catch(error => console.error('Error fetching note for Learn3:', error));
  }, []);

  const progressPercentage = (completedLessons / totalLessons) * 100;

  const toggleNotes = () => setShowNotes(!showNotes);
  const toggleQA = () => setShowQA(!showQA);
  const toggleRating = () => setShowRating(!showRating);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCommentData = {
      user: 'Current User',
      content: newComment,
      timestamp: new Date().toLocaleString(),
      avatar: 'path_to_avatar_image.jpg',
    };

    // API: Save new comment for Learn3
    fetch('https://api.example.com/comments/learn3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCommentData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Comment saved for Learn3:', data);
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment('');
      })
      .catch(error => console.error('Error saving comment for Learn3:', error));
  };

  const handleRating = (rate) => setRating(rate);

  const handleConfirmRating = () => {
    console.log('Rating:', rating, 'Comment:', comment);
    setRating(0);
    setComment('');
    toggleRating();
  };

  const handleSaveNote = () => {
    // API: Save note for Learn3
    fetch('https://api.example.com/notes/learn3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: newNote }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Note saved for Learn3:', data);
        setShowNotes(false);
      })
      .catch(error => console.error('Error saving note for Learn3:', error));
  };

  const courseContent = [
    '1. Giới thiệu',
    '2. Lập trình ES6++',
    '3. React, Redux',
    '4. JSX, Components, Props',
    '5. Create React App',
    '6. Hooks',
    '7. CSS, SCSS và CSS Modules',
    '8. React Router V6',
    '9. Redux (quản lý state)',
    '10. Deploy ứng dụng lên Headde',
  ];

  return (
    <div className="learn1-container">
      <div className="learn1-left-section">
        <div className="learn1-video-and-controls">
          <div className="learn1-video-section">
            <h2>3. React, Redux</h2>
            <video controls>
              <source src="path_to_redux_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="learn1-progress-notes-qa">
            <button onClick={toggleNotes} aria-label="Toggle Notes" className="notes-button">
              <i className="fas fa-plus"></i> Thêm ghi chú
            </button>
            {showNotes && (
              <div className="notes-popup">
                <h3 className="notes-title">Ghi chú của tôi</h3>
                <textarea
                  className="notes-input"
                  placeholder="Nhập ghi chú của bạn..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <div className="notes-buttons">
                  <button onClick={handleSaveNote} className="save-note-button">Lưu</button>
                  <button onClick={toggleNotes} className="close-notes-button">Đóng</button>
                </div>
              </div>
            )}
            <button onClick={toggleQA} aria-label="Toggle Q&A" className="qa-button">
              <i className="fas fa-comment-dots"></i> Hỏi đáp
            </button>
            {showQA && (
              <div className="qa-popup">
                <button onClick={toggleQA} aria-label="Close Q&A" className="close-qa-button">X</button>
                <div className="comments-list">
                  {comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <img src={comment.avatar} alt="Avatar" className="comment-avatar" />
                      <div className="comment-details">
                        <div className="comment-user">{comment.user}</div>
                        <div className="comment-timestamp">{comment.timestamp}</div>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="new-comment-section">
                  <textarea
                    className="new-comment-input"
                    placeholder="Nhập câu hỏi hoặc bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button onClick={handleAddComment} className="send-comment-button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navigation-rating-buttons">
          <div className="navigation-buttons">
            <Link to="/learn2">
              <button aria-label="Previous Lesson" className="previous-button">
                <i className="fas fa-arrow-left"></i> Bài trước
              </button>
            </Link>
            <Link to="/learn4">
              <button
                aria-label="Next Lesson"
                className="next-button"
                onClick={() => console.log('Navigating to /learn4')}
              >
                Tiếp theo <i className="fas fa-arrow-right"></i>
              </button>
            </Link>
          </div>
          <button onClick={toggleRating} className="rate-button">
            <i className="fas fa-star"></i> Đánh giá khóa học
          </button>
          {showRating && (
            <div className="rating-popup">
              <h3>Đánh giá khóa học</h3>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star ${star <= rating ? 'selected' : ''}`}
                    onClick={() => handleRating(star)}
                  ></i>
                ))}
              </div>
              <textarea
                className="comment-input"
                placeholder="Nhập nhận xét của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button className="confirm-button" onClick={handleConfirmRating}>
                Xác nhận
              </button>
              <button onClick={toggleRating} className="close-rating-button">Đóng</button>
            </div>
          )}
        </div>
      </div>

      <div className="learn1-content-rating">
        <div className="learn1-content-list">
          <h3>Nội dung khóa học</h3>
          <ul>
            {courseContent.map((lesson, index) => (
              <li key={index}>
                {lesson}
                {index > completedLessons && (
                  <i className="fas fa-lock" style={{ marginLeft: '8px', color: '#888' }}></i>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Learn3;