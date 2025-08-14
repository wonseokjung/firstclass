import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Circle, MessageSquare, Award, Timer } from 'lucide-react';
import { chatGPTCourse, saveProgress, getProgress, calculateProgressPercentage, getCompletedLessonsCount, saveQuizResult, getQuizProgress } from '../data/courseData';
import NavigationBar from './NavigationBar';

interface ChatGPTCoursePageProps {
  onBack: () => void;
}

const ChatGPTCoursePage: React.FC<ChatGPTCoursePageProps> = ({ onBack }) => {
  const [currentLesson, setCurrentLesson] = useState<number>(1);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [lessonsProgress, setLessonsProgress] = useState<Record<number, boolean>>({});
  
  // 퀴즈 관련 상태
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({});
  const [quizCompleted, setQuizCompleted] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ChatGPT 강의 데이터
  const course = chatGPTCourse;

  useEffect(() => {
    // 저장된 진도 불러오기
    const savedProgress = getProgress();
    setLessonsProgress(savedProgress);
    
    // 퀴즈 완료 상태 불러오기
    const quizProgress = getQuizProgress();
    const quizCompletedState: Record<number, boolean> = {};
    Object.keys(quizProgress).forEach(key => {
      quizCompletedState[parseInt(key)] = quizProgress[parseInt(key)].passed;
    });
    setQuizCompleted(quizCompletedState);
    
    if (course.lessons.length > 0) {
      setCurrentLesson(course.lessons[0].id);
      const firstLesson = course.lessons[0];
      if (firstLesson.videoUrl) {
        setVideoUrl(firstLesson.videoUrl);
      }
    }
  }, [course]);

  const currentLessonData = course.lessons.find(lesson => lesson.id === currentLesson);
  const progressPercentage = calculateProgressPercentage();
  const completedLessonsCount = getCompletedLessonsCount();

  const getEmbedUrl = (url: string) => {
    // YouTube URL 처리
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo URL 처리
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  const toggleLessonComplete = useCallback((lessonId: number) => {
    const newProgress = { ...lessonsProgress };
    newProgress[lessonId] = !newProgress[lessonId];
    setLessonsProgress(newProgress);
    saveProgress(lessonId, newProgress[lessonId]);
  }, [lessonsProgress]);

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (lesson?.videoUrl) {
      setVideoUrl(lesson.videoUrl);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson);
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      handleLessonClick(nextLesson.id);
    }
  };

  const goToPrevLesson = () => {
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson);
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1];
      handleLessonClick(prevLesson.id);
    }
  };

  // 퀴즈 모달 표시
  const showQuizModal = () => {
    if (currentLessonData?.hasQuiz && !quizCompleted[currentLesson]) {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizStarted(true);
      if (currentLessonData.quiz?.timeLimit) {
        setTimeRemaining(currentLessonData.quiz.timeLimit * 60); // 분을 초로 변환
      }
    }
  };

  // 퀴즈 답안 선택
  const handleQuizAnswer = (questionId: number, answer: string | number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // 다음 문제로 이동
  const nextQuestion = () => {
    if (currentLessonData?.quiz && currentQuestionIndex < currentLessonData.quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 이전 문제로 이동
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 퀴즈 제출
  const submitQuiz = useCallback(() => {
    if (!currentLessonData?.quiz) return;
    
    let correctAnswers = 0;
    currentLessonData.quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / currentLessonData.quiz.questions.length) * 100);
    const passed = score >= currentLessonData.quiz.requiredScore;
    
    saveQuizResult(currentLesson, score, passed);
    setQuizCompleted(prev => ({ ...prev, [currentLesson]: passed }));
    
    // 퀴즈 통과 시 강의 완료 처리
    if (passed) {
      toggleLessonComplete(currentLesson);
    }
    
    alert(`퀴즈 결과: ${score}점 (${passed ? '통과' : '재시도 필요'})`);
    setShowQuiz(false);
  }, [currentLessonData, userAnswers, currentLesson, toggleLessonComplete]);

  // 퀴즈 타이머
  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && quizStarted) {
      submitQuiz();
    }
  }, [timeRemaining, quizStarted, submitQuiz]);

  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="ChatGPT 완전정복"
      />

      {/* 메인 콘텐츠 영역 - 2열 레이아웃 */}
      <div className="course-layout">
        {/* 왼쪽 메인 콘텐츠 */}
        <div className="course-main">
          {/* 히어로 섹션 */}
          <section className="course-hero">
            <div className="hero-content">
              <h1 className="hero-title">
                {course.title}
              </h1>
              <p className="hero-subtitle">
                AI 멘토 JAY와 함께하는 ChatGPT 완전정복! 왕초보도 쉽게 배우는 체계적인 커리큘럼
              </p>
              
              {/* 강의 메타 정보 */}
              <div className="course-meta-info">
                <div className="meta-item">
                  <Star size={16} />
                  <span>{course.rating}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.studentCount.toLocaleString()}명</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.totalDuration}</span>
                </div>
              </div>

              {/* 학습 진도 */}
              <div className="learning-progress">
                <div className="progress-info">
                  <span>학습 진도: {completedLessonsCount}/{course.lessons.length}강</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* 비디오 영역 */}
          <section className="video-section">
            <div className="video-container">
              {videoUrl ? (
                <div className="video-player">
                  <iframe
                    ref={iframeRef}
                    src={`${getEmbedUrl(videoUrl)}?enablejsapi=1&controls=1`}
                    title={currentLessonData?.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="video-placeholder-content">
                    <MessageSquare size={64} className="video-placeholder-icon" />
                    <h3>강의를 선택해주세요</h3>
                    <p>오른쪽 커리큘럼에서 학습하고 싶은 강의를 선택하세요.</p>
                  </div>
                </div>
              )}
            </div>

            {/* 현재 강의 정보 */}
            {currentLessonData && (
              <div className="current-lesson-info">
                <h3 className="lesson-title">{currentLessonData.title}</h3>
                <p className="lesson-description">{currentLessonData.description}</p>
                
                <div className="lesson-meta">
                  <span className="lesson-duration">
                    <Clock size={16} />
                    {currentLessonData.duration}
                  </span>
                  
                  {/* 퀴즈 버튼 */}
                  {currentLessonData.hasQuiz && (
                    <button 
                      className={`quiz-btn ${quizCompleted[currentLesson] ? 'completed' : ''}`}
                      onClick={showQuizModal}
                      disabled={quizCompleted[currentLesson]}
                    >
                      <Award size={16} />
                      {quizCompleted[currentLesson] ? '퀴즈 완료' : '퀴즈 시작'}
                    </button>
                  )}
                  
                  <button 
                    className={`completion-btn ${lessonsProgress[currentLessonData.id] ? 'completed' : ''}`}
                    onClick={() => toggleLessonComplete(currentLessonData.id)}
                  >
                    {lessonsProgress[currentLessonData.id] ? (
                      <>
                        <CheckCircle size={16} />
                        완료됨
                      </>
                    ) : (
                      <>
                        <Circle size={16} />
                        완료하기
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 강의 네비게이션 */}
            <div className="lesson-navigation">
              <button 
                className="nav-btn prev-btn"
                onClick={goToPrevLesson}
                disabled={currentLesson === 1}
              >
                <ArrowLeft size={16} />
                이전 강의
              </button>
              <button 
                className="nav-btn next-btn"
                onClick={goToNextLesson}
                disabled={currentLesson === course.lessons.length}
              >
                다음 강의
                <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          </section>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="course-sidebar">
          <div className="sidebar-header">
            <h3>강의 커리큘럼</h3>
            <p>총 {course.lessons.length}강의 체계적인 학습 과정</p>
          </div>
          
          <div className="lesson-list">
            {course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className={`lesson-item ${lesson.id === currentLesson ? 'active' : ''} ${lessonsProgress[lesson.id] ? 'completed' : ''}`}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="lesson-item-content">
                  <div className="lesson-number">
                    {index + 1}
                  </div>
                  <div className="lesson-info">
                    <h4 className="lesson-title">{lesson.title}</h4>
                    <div className="lesson-meta">
                      <span className="lesson-duration">
                        <Clock size={14} />
                        {lesson.duration}
                      </span>
                      {lesson.hasQuiz && (
                        <span className="lesson-quiz">
                          <Award size={14} />
                          퀴즈
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lesson-status">
                    {lessonsProgress[lesson.id] ? (
                      <CheckCircle size={16} className="status-completed" />
                    ) : (
                      <Circle size={16} className="status-pending" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 퀴즈 모달 */}
      {showQuiz && currentLessonData?.quiz && (
        <div className="quiz-modal-overlay">
          <div className="quiz-modal">
            <div className="quiz-header">
              <h3>
                <Award size={20} />
                {currentLessonData.title} - 이해도 퀴즈
              </h3>
              <div className="quiz-info">
                <span className="quiz-progress">
                  {currentQuestionIndex + 1} / {currentLessonData.quiz.questions.length}
                </span>
                {timeRemaining > 0 && (
                  <span className="quiz-timer">
                    <Timer size={14} />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            <div className="quiz-content">
              {currentLessonData.quiz.questions[currentQuestionIndex] && (
                <div className="question-container">
                  <h4 className="question-text">
                    {currentLessonData.quiz.questions[currentQuestionIndex].question}
                  </h4>
                  
                  <div className="answers-container">
                    {currentLessonData.quiz.questions[currentQuestionIndex].type === 'multiple' && (
                      <div className="multiple-choice">
                        {currentLessonData.quiz.questions[currentQuestionIndex].options?.map((option, index) => (
                          <button
                            key={index}
                            className={`answer-option ${userAnswers[currentLessonData.quiz!.questions[currentQuestionIndex].id] === index ? 'selected' : ''}`}
                            onClick={() => handleQuizAnswer(currentLessonData.quiz!.questions[currentQuestionIndex].id, index)}
                          >
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {currentLessonData.quiz.questions[currentQuestionIndex].type === 'true-false' && (
                      <div className="true-false">
                        <button
                          className={`answer-option ${userAnswers[currentLessonData.quiz!.questions[currentQuestionIndex].id] === 1 ? 'selected' : ''}`}
                          onClick={() => handleQuizAnswer(currentLessonData.quiz!.questions[currentQuestionIndex].id, 1)}
                        >
                          참 (True)
                        </button>
                        <button
                          className={`answer-option ${userAnswers[currentLessonData.quiz!.questions[currentQuestionIndex].id] === 0 ? 'selected' : ''}`}
                          onClick={() => handleQuizAnswer(currentLessonData.quiz!.questions[currentQuestionIndex].id, 0)}
                        >
                          거짓 (False)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="quiz-actions">
              <button 
                className="quiz-nav-btn" 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                이전 문제
              </button>
              
              {currentQuestionIndex < currentLessonData.quiz.questions.length - 1 ? (
                <button 
                  className="quiz-nav-btn primary"
                  onClick={nextQuestion}
                  disabled={userAnswers[currentLessonData.quiz.questions[currentQuestionIndex].id] === undefined}
                >
                  다음 문제
                </button>
              ) : (
                <button 
                  className="quiz-submit-btn"
                  onClick={submitQuiz}
                  disabled={currentLessonData.quiz.questions.some(q => userAnswers[q.id] === undefined)}
                >
                  퀴즈 제출
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTCoursePage; 