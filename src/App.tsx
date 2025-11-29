
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import AzureTableService from './services/azureTableService';
import { useReferralTracking } from './hooks/useReferralTracking';

// LoadingSpinner 컴포넌트 인라인 정의
const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading AI City Builders...</p>
    </div>
  </div>
);

// 동적 임포트로 코드 스플리팅
// 메인 페이지
const MainPage = React.lazy(() => import('./components/pages/MainPage'));
const AICityMapPage = React.lazy(() => import('./components/pages/AICityMapPage'));
const ChatGPTPrompts40Page = React.lazy(() => import('./components/pages/ChatGPTPrompts40Page'));
const AIMoneyMasterPromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyMasterPromptsPage'));
const AIMoneyImagePromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyImagePromptsPage'));
const AIMoneyVideoPromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyVideoPromptsPage'));
const FAQPage = React.lazy(() => import('./components/pages/FAQPage'));
const CEOPage = React.lazy(() => import('./components/pages/CEOPage'));
const ContactPage = React.lazy(() => import('./components/pages/ContactPage'));

// 강의 페이지
const ChatGPTCoursePage = React.lazy(() => import('./components/pages/courses/ChatGPTCoursePage'));
const GoogleAICoursePage = React.lazy(() => import('./components/pages/courses/GoogleAICoursePage'));
const AIBusinessCoursePage = React.lazy(() => import('./components/pages/courses/AIBusinessCoursePage'));
const AICodingCoursePage = React.lazy(() => import('./components/pages/courses/AICodingCoursePage'));
const AIEducationDocumentaryPage = React.lazy(() => import('./components/pages/courses/AIEducationDocumentaryPage'));
const AIBuildingCoursePage = React.lazy(() => import('./components/pages/courses/AIBuildingCoursePage'));
const AIBuildingCoursePlayerPage = React.lazy(() => import('./components/pages/courses/AIBuildingCoursePlayerPage'));
const ChatGPTAgentBeginnerPage = React.lazy(() => import('./components/pages/courses/ChatGPTAgentBeginnerPage'));
const ChatGPTAgentBeginnerPlayerPage = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/ChatGPTAgentBeginnerPlayerPage'));
const Day1Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day1Page'));
const Day2Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day2Page'));
const Day3Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day3Page'));
const Day4Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day4Page'));
const Day5Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day5Page'));
const Day6Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day6Page'));
const Day7Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day7Page'));
const Day8Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day8Page'));
const Day9Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day9Page'));
const Day10Page = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/Day10Page'));
const ChatGPTAgentBeginnerPaymentPage = React.lazy(() => import('./components/pages/courses/chatgpt-agent-beginner/PaymentPage'));
const CostOptimizationExamplesPage = React.lazy(() => import('./components/pages/courses/CostOptimizationExamplesPage'));
// const LessonDetailPage = React.lazy(() => import('./components/pages/courses/LessonDetailPage'));

// 인증 페이지
const LoginPage = React.lazy(() => import('./components/pages/auth/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/pages/auth/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('./components/pages/ForgotPasswordPage'));
const UserDashboardPage = React.lazy(() => import('./components/pages/auth/UserDashboardPage'));

// 결제 페이지
const PaymentSuccessPage = React.lazy(() => import('./components/pages/payment/PaymentSuccessPage'));
const PaymentFailPage = React.lazy(() => import('./components/pages/payment/PaymentFailPage'));

// 관리자 페이지
const AdminEnrollmentFixPage = React.lazy(() => import('./components/pages/admin/AdminEnrollmentFixPage'));
const AdminDashboardPage = React.lazy(() => import('./components/pages/admin/AdminDashboardPage'));
const PaymentDetailsViewPage = React.lazy(() => import('./components/pages/admin/PaymentDetailsViewPage'));

// 각 페이지 컴포넌트를 래핑해서 useNavigate 사용
const MainPageWrapper = () => {
  const navigate = useNavigate();
  
  // 추천 링크 감지 훅 사용
  useReferralTracking();

  // 404 페이지에서 리다이렉트된 경우 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    if (redirectPath) {
      navigate('/' + redirectPath);
    }
  }, [navigate]);

  // ⭐️ [수정] handleCourseSelect 함수 전체를 삭제합니다. MainPage가 자체적으로 처리합니다.

  return (
    // ⭐️ [수정] onCourseSelect 속성을 삭제합니다.
    <MainPage 
      onFAQClick={() => navigate('/faq')}
      onLoginClick={() => navigate('/login')}
      onSignUpClick={() => navigate('/signup')}
    />
  );
};

// ... (이하 다른 Wrapper 컴포넌트들은 기존과 동일합니다) ...

const ChatGPTCoursePageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatGPTCoursePage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const GoogleAICoursePageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <GoogleAICoursePage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AIBusinessCoursePageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIBusinessCoursePage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AICodingCoursePageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AICodingCoursePage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AIEducationDocumentaryPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIEducationDocumentaryPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  
  const FAQPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <FAQPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const CEOPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CEOPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const ContactPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ContactPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const LoginPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const SignUpPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUpPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const UserDashboardPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <UserDashboardPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const PaymentSuccessPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentSuccessPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const PaymentFailPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentFailPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AICityMapPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AICityMapPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AIBuildingCoursePageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIBuildingCoursePage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const AIBuildingCoursePlayerPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIBuildingCoursePlayerPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const ChatGPTAgentBeginnerPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatGPTAgentBeginnerPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const ChatGPTAgentBeginnerPlayerPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatGPTAgentBeginnerPlayerPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const CostOptimizationExamplesPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CostOptimizationExamplesPage onBack={() => navigate('/chatgpt-agent-beginner')} />
      </Suspense>
    );
  };

  const Day1PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day1Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day2')}
        />
      </Suspense>
    );
  };

  const Day2PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day2Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day3')}
        />
      </Suspense>
    );
  };

  const Day3PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day3Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day4')}
        />
      </Suspense>
    );
  };

  const Day4PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day4Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day5')}
        />
      </Suspense>
    );
  };

  const Day5PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day5Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day6')}
        />
      </Suspense>
    );
  };

  const Day6PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day6Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day7')}
        />
      </Suspense>
    );
  };

  const Day7PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day7Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day8')}
        />
      </Suspense>
    );
  };

  const Day8PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day8Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day9')}
        />
      </Suspense>
    );
  };

  const Day9PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day9Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day10')}
        />
      </Suspense>
    );
  };

  const Day10PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Day10Page 
          onBack={() => navigate('/chatgpt-agent-beginner')} 
          onNext={() => navigate('/chatgpt-agent-beginner/day11')}
        />
      </Suspense>
    );
  };

  const ChatGPTAgentBeginnerPaymentPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatGPTAgentBeginnerPaymentPage 
          onBack={() => navigate('/chatgpt-agent-beginner')}
        />
      </Suspense>
    );
  };

  // 기존 URL 리다이렉트 컴포넌트
  const RedirectToNewPlayerUrl = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/chatgpt-agent-beginner/player', { replace: true });
    }, [navigate]);
    return <LoadingSpinner />;
  };

  const RedirectToNewAIBuildingPlayerUrl = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/ai-building-course/player', { replace: true });
    }, [navigate]);
    return <LoadingSpinner />;
  };
  
  // AI Building Course 11월 1일 오픈 안내 컴포넌트
  const ComingSoonNotice = () => {
    const navigate = useNavigate();
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏗️</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            AI 건물 짓기 강의
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#0ea5e9',
            marginBottom: '30px',
            fontWeight: '600'
          }}>
            🗓️ 11월 1일 오픈 예정
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#4b5563',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            더 완성도 높은 강의와 혁신적인 교육 경험을 위해<br/>
            열심히 준비하고 있습니다! 💪
          </p>
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '30px'
          }}>
            <p style={{
              color: '#0ea5e9',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              ⏰ 기다리는 동안
            </p>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              다른 무료 강의들로 AI 실력을 미리 쌓아보세요!
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            다른 강의 보러가기 🚀
          </button>
        </div>
      </div>
    );
  };
  
  const ChatGPTPrompts40PageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatGPTPrompts40Page onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AIMoneyMasterPromptsPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIMoneyMasterPromptsPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  const AIMoneyImagePromptsPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIMoneyImagePromptsPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };

  const AIMoneyVideoPromptsPageWrapper = () => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AIMoneyVideoPromptsPage onBack={() => navigate('/')} />
      </Suspense>
    );
  };
  
  
  
  function App() {
    useEffect(() => {
      // Azure Table Service 초기화
      AzureTableService.initializeTables();
    }, []);
  
    return (
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<MainPageWrapper />} />
              <Route path="/chatgpt-course" element={<ChatGPTCoursePageWrapper />} />
              <Route path="/google-ai-course" element={<GoogleAICoursePageWrapper />} />
              <Route path="/ai-business-course" element={<AIBusinessCoursePageWrapper />} />
              <Route path="/ai-coding-course" element={<AICodingCoursePageWrapper />} />
              <Route path="/ai-education-documentary" element={<AIEducationDocumentaryPageWrapper />} />
              <Route path="/ai-building-course" element={<AIBuildingCoursePageWrapper />} />
              <Route path="/ai-building-course/player" element={<AIBuildingCoursePlayerPageWrapper />} />
              <Route path="/chatgpt-agent-beginner" element={<ChatGPTAgentBeginnerPageWrapper />} />
              <Route path="/chatgpt-agent-beginner/payment" element={<ChatGPTAgentBeginnerPaymentPageWrapper />} />
              <Route path="/chatgpt-agent-beginner/player" element={<ChatGPTAgentBeginnerPlayerPageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day1" element={<Day1PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day2" element={<Day2PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day3" element={<Day3PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day4" element={<Day4PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day5" element={<Day5PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day6" element={<Day6PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day7" element={<Day7PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day8" element={<Day8PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day9" element={<Day9PageWrapper />} />
              <Route path="/chatgpt-agent-beginner/day10" element={<Day10PageWrapper />} />
              <Route path="/cost-optimization-examples" element={<CostOptimizationExamplesPageWrapper />} />
              {/* 기존 URL 리다이렉트 */}
              <Route path="/chatgpt-agent-beginner-player" element={<RedirectToNewPlayerUrl />} />
              <Route path="/ai-building-course-player" element={<RedirectToNewAIBuildingPlayerUrl />} />
              <Route path="/workflow-automation-master" element={<ComingSoonNotice />} />
              <Route path="/faq" element={<FAQPageWrapper />} />
              <Route path="/ceo" element={<CEOPageWrapper />} />
              <Route path="/contact" element={<ContactPageWrapper />} />
              <Route path="/ai-city-map" element={<AICityMapPageWrapper />} />
              <Route path="/chatgpt-prompts-40plus" element={<ChatGPTPrompts40PageWrapper />} />
              <Route path="/ai-money-master-prompts" element={<AIMoneyMasterPromptsPageWrapper />} />
              <Route path="/ai-money-image-prompts" element={<AIMoneyImagePromptsPageWrapper />} />
              <Route path="/ai-money-video-prompts" element={<AIMoneyVideoPromptsPageWrapper />} />
              <Route path="/login" element={<LoginPageWrapper />} />
              <Route path="/signup" element={<SignUpPageWrapper />} />
              <Route path="/forgot-password" element={<Suspense fallback={<LoadingSpinner />}><ForgotPasswordPage /></Suspense>} />
              <Route path="/dashboard" element={<UserDashboardPageWrapper />} />
              <Route path="/payment/success" element={<PaymentSuccessPageWrapper />} />
              <Route path="/payment/fail" element={<PaymentFailPageWrapper />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/fix-enrollments" element={<AdminEnrollmentFixPage />} />
              <Route path="/admin/payment-details" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PaymentDetailsViewPage onBack={() => window.location.href = '/admin'} />
                </Suspense>
              } />
              {/* 멘토링 라우트들 제거됨 - 강의 사이트에 집중 */}
            </Routes>
          </Suspense>
        </div>
      </Router>
    );
  }
  
  export default App;
