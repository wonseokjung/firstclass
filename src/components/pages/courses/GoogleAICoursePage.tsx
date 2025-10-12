import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Circle, MessageSquare, Award, Timer } from 'lucide-react';
import { saveProgress, getProgress, saveQuizResult, getQuizProgress } from '../../../data/courseData';
import NavigationBar from '../../common/NavigationBar';

interface GoogleAICoursePageProps {
  onBack: () => void;
}

interface MultipleChoiceQuestion {
  id: number;
  type: 'multiple';
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TrueFalseQuestion {
  id: number;
  type: 'true-false';
  question: string;
  correctAnswer: number;
}

type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion;

interface Quiz {
  timeLimit: number;
  requiredScore: number;
  questions: QuizQuestion[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  hasQuiz: boolean;
  quiz?: Quiz;
}

// Google AI 강의 데이터
const googleAICourse = {
  id: 'google-ai-mastery',
  title: 'Google AI 완전정복',
  instructor: 'Google AI Team',
  description: '구글이 개발한 최신 AI 도구들을 마스터하는 완벽한 가이드',
  rating: 4.9,
  studentCount: 8240,
  totalDuration: '1시간 57분',
  lessons: [
    {
      id: 1,
      title: '챗GPT 월 3만원, 이제 아끼세요! 구글 AI 무료로 쓰는 방법',
      description: '구글 계정 가입부터 Google AI Studio 사용법까지 완전정복',
      duration: '25분',
      videoUrl: 'https://youtu.be/PS716kLvZvU',
      hasQuiz: true,
      quiz: {
        timeLimit: 10,
        requiredScore: 70,
        questions: [
          {
            id: 1,
            type: 'multiple' as const,
            question: 'Google AI Studio의 주요 장점은 무엇인가요?',
            options: [
              '완전 무료 사용',
              '구글 데이터와 연동',
              '다양한 AI 모델 지원',
              '모든 것'
            ],
            correctAnswer: 3
          }
        ]
      }
    },
    {
      id: 2,
      title: '구글 VEO2로 AI 영상 만들기',
      description: '말만 하면 영상 뚝딱! 무료 AI 영상 생성 완전가이드',
      duration: '17분',
      videoUrl: 'https://youtu.be/jvrU5wVEgE8',
      hasQuiz: true,
      quiz: {
        timeLimit: 10,
        requiredScore: 70,
        questions: [
          {
            id: 1,
            type: 'true-false' as const,
            question: 'VEO2는 글이나 사진으로 영상을 만들 수 있습니다.',
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 3,
      title: '구글 AI 노트북LM으로 10배 빠르게 학습하기',
      description: '어떤 과목이든 마스터! 학습 효율 극대화 비법',
      duration: '16분',
      videoUrl: 'https://youtu.be/YFaz_nF0d08',
      hasQuiz: true,
      quiz: {
        timeLimit: 10,
        requiredScore: 70,
        questions: [
          {
            id: 1,
            type: 'multiple' as const,
            question: '노트북LM의 핵심 기능은 무엇인가요?',
            options: [
              'AI 자동 요약',
              '스터디 가이드 생성',
              'FAQ 및 연습문제 만들기',
              '모든 것'
            ],
            correctAnswer: 3
          }
        ]
      }
    },
    {
      id: 4,
      title: '구글 VEO3 완전정복 - 영화급 AI 영상',
      description: '프롬프트 하나로 영상, 소리, 음악, 대사까지 한 번에!',
      duration: '22분',
      videoUrl: 'https://youtu.be/tR9FIY_nqYo',
      hasQuiz: true,
      quiz: {
        timeLimit: 15,
        requiredScore: 75,
        questions: [
          {
            id: 1,
            type: 'multiple' as const,
            question: 'VEO3의 멀티모달 기능은 무엇을 의미하나요?',
            options: [
              '여러 형태의 입력 처리',
              '영상과 오디오 동시 생성',
              '다양한 스타일 지원',
              '모든 것'
            ],
            correctAnswer: 3
          }
        ]
      }
    },
    {
      id: 5,
      title: 'VEO3로 유튜브 1위 Mr.Beast 영상 만들기',
      description: '혼자서도 콘텐츠 제작 가능! 2000년 전 한국 생존기 제작',
      duration: '21분',
      videoUrl: 'https://youtu.be/L2sZlnaWzT4',
      hasQuiz: true,
      quiz: {
        timeLimit: 15,
        requiredScore: 75,
        questions: [
          {
            id: 1,
            type: 'true-false' as const,
            question: 'AI를 활용하면 1인 크리에이터도 고품질 콘텐츠를 제작할 수 있습니다.',
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 6,
      title: 'AI로 바이럴 영상 만들기 - 유리 과일 ASMR',
      description: '10분 만에 조회수 100만 터지는 꿀팁 대공개!',
      duration: '16분',
      videoUrl: 'https://youtu.be/z0Ypr3AWhss',
      hasQuiz: true,
      quiz: {
        timeLimit: 10,
        requiredScore: 70,
        questions: [
          {
            id: 1,
            type: 'multiple' as const,
            question: '바이럴 AI 영상 제작의 핵심은 무엇인가요?',
            options: [
              '창의적인 프롬프트',
              '높은 영상 퀄리티',
              '트렌드 파악',
              '모든 것'
            ],
            correctAnswer: 3
          }
        ]
      }
    }
  ] as Lesson[]
};

const GoogleAICoursePage: React.FC<GoogleAICoursePageProps> = ({ onBack }) => {
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

  useEffect(() => {
    // 사용자 정보 가져오기
    const userInfo = sessionStorage.getItem('clathon_user_session');
    const userEmail = userInfo ? JSON.parse(userInfo).email : undefined;
    
    // 저장된 진도 불러오기 (사용자별)
    const savedProgress = getProgress('google-ai-course', userEmail);
    setLessonsProgress(savedProgress);
    
    // 퀴즈 완료 상태 불러오기 (사용자별)
    const quizProgress = getQuizProgress('google-ai-course', userEmail);
    const quizCompletedState: Record<number, boolean> = {};
    Object.keys(quizProgress).forEach(key => {
      quizCompletedState[parseInt(key)] = quizProgress[parseInt(key)].passed;
    });
    setQuizCompleted(quizCompletedState);
    
    if (googleAICourse.lessons.length > 0) {
      setCurrentLesson(googleAICourse.lessons[0].id);
      const firstLesson = googleAICourse.lessons[0];
      if (firstLesson.videoUrl) {
        setVideoUrl(firstLesson.videoUrl);
      }
    }
  }, []);

  const currentLessonData = googleAICourse.lessons.find(lesson => lesson.id === currentLesson);

  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  const toggleLessonComplete = useCallback(async (lessonId: number) => {
    const newProgress = { ...lessonsProgress };
    newProgress[lessonId] = !newProgress[lessonId];
    setLessonsProgress(newProgress);
    
    // 사용자별 진도 저장
    const userInfo = sessionStorage.getItem('clathon_user_session');
    const userEmail = userInfo ? JSON.parse(userInfo).email : undefined;
    
    await saveProgress('google-ai-course', lessonId, newProgress[lessonId], userEmail);
  }, [lessonsProgress]);

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
    const lesson = googleAICourse.lessons.find(l => l.id === lessonId);
    if (lesson?.videoUrl) {
      setVideoUrl(lesson.videoUrl);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = googleAICourse.lessons.findIndex(l => l.id === currentLesson);
    if (currentIndex < googleAICourse.lessons.length - 1) {
      const nextLesson = googleAICourse.lessons[currentIndex + 1];
      handleLessonClick(nextLesson.id);
    }
  };

  const goToPrevLesson = () => {
    const currentIndex = googleAICourse.lessons.findIndex(l => l.id === currentLesson);
    if (currentIndex > 0) {
      const prevLesson = googleAICourse.lessons[currentIndex - 1];
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
        setTimeRemaining(currentLessonData.quiz.timeLimit * 60);
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
  const submitQuiz = useCallback(async () => {
    if (!currentLessonData?.quiz) return;
    
    let correctAnswers = 0;
    currentLessonData.quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / currentLessonData.quiz.questions.length) * 100);
    const passed = score >= currentLessonData.quiz.requiredScore;
    
    // 사용자별 퀴즈 결과 저장
    const userInfo = sessionStorage.getItem('clathon_user_session');
    const userEmail = userInfo ? JSON.parse(userInfo).email : undefined;
    
    await saveQuizResult('google-ai-course', currentLesson, score, passed, userEmail);
    setQuizCompleted(prev => ({ ...prev, [currentLesson]: passed }));
    
    // 퀴즈 통과 시 강의 완료 처리
    if (passed) {
      await toggleLessonComplete(currentLesson);
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

  const completedLessonsCount = Object.values(lessonsProgress).filter(Boolean).length;
  const progressPercentage = (completedLessonsCount / googleAICourse.lessons.length) * 100;

  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="Google AI 완전정복"
      />

      {/* 메인 콘텐츠 영역 - 2열 레이아웃 */}
      <div className="course-layout">
        {/* 왼쪽 메인 콘텐츠 */}
        <div className="course-main">
          {/* 히어로 섹션 */}
          <section className="course-hero">
            <div className="hero-content">
              <h1 className="hero-title">
                {googleAICourse.title}
              </h1>
              <p className="hero-subtitle">
                구글이 만든 최신 AI 도구들을 완벽하게 마스터하세요! VEO, Gemini, CLI까지 모든 것을 다루는 완전한 가이드
              </p>
              
              {/* 강의 메타 정보 */}
              <div className="course-meta-info">
                <div className="meta-item">
                  <Star size={16} />
                  <span>{googleAICourse.rating}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{googleAICourse.studentCount.toLocaleString()}명</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{googleAICourse.totalDuration}</span>
                </div>
              </div>

              {/* 학습 진도 */}
              <div className="learning-progress">
                <div className="progress-info">
                  <span>학습 진도: {completedLessonsCount}/{googleAICourse.lessons.length}강</span>
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
                disabled={currentLesson === googleAICourse.lessons.length}
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
            <p>총 {googleAICourse.lessons.length}강의 Google AI 완전정복</p>
          </div>
          
          <div className="lesson-list">
            {googleAICourse.lessons.map((lesson, index) => (
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
                        {(currentLessonData.quiz.questions[currentQuestionIndex] as MultipleChoiceQuestion).options.map((option: string, index: number) => (
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

export default GoogleAICoursePage; 