import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import AzureTableService from './services/azureTableService';

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
const MainPage = React.lazy(() => import('./components/MainPage'));
const ChatGPTCoursePage = React.lazy(() => import('./components/ChatGPTCoursePage'));
const GoogleAICoursePage = React.lazy(() => import('./components/GoogleAICoursePage'));
const AIBusinessCoursePage = React.lazy(() => import('./components/AIBusinessCoursePage'));
const AICodingCoursePage = React.lazy(() => import('./components/AICodingCoursePage'));
const AIEducationDocumentaryPage = React.lazy(() => import('./components/AIEducationDocumentaryPage'));


const WorkflowAutomationMasterPage = React.lazy(() => import('./components/WorkflowAutomationMasterPage'));
const AICityMapPage = React.lazy(() => import('./components/AICityMapPage'));
const ChatGPTPrompts40Page = React.lazy(() => import('./components/ChatGPTPrompts40Page'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const CEOPage = React.lazy(() => import('./components/CEOPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/SignUpPage'));
const UserDashboardPage = React.lazy(() => import('./components/UserDashboardPage'));
const PaymentSuccessPage = React.lazy(() => import('./components/PaymentSuccessPage'));
const PaymentFailPage = React.lazy(() => import('./components/PaymentFailPage'));


// 각 페이지 컴포넌트를 래핑해서 useNavigate 사용
const MainPageWrapper = () => {
  const navigate = useNavigate();

  // 404 페이지에서 리다이렉트된 경우 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    if (redirectPath) {
      navigate('/' + redirectPath);
    }
  }, [navigate]);

  const handleCourseSelect = (courseId: number) => {
    switch(courseId) {
      case 1: // ChatGPT
        navigate('/chatgpt-course');
        break;
      case 2: // AI Education Documentary
        navigate('/ai-education-documentary');
        break;
      case 3: // Google AI
        navigate('/google-ai-course');
        break;
      case 4: // AI Business
        navigate('/ai-business-course');
        break;
      case 5: // AI Coding
        navigate('/ai-coding-course');
        break;
      case 6: // ChatGPT Prompts 40+ (Free Course)
        navigate('/chatgpt-prompts-40plus');
        break;
      case 999: // Premium Course 1 - AI 건물 짓기
        navigate('/ai-building-course');
        break;
      case 1000: // Premium Course 2 - AI 마을 만들기 (Coming Soon)
        alert('🏘️ 강의 2: AI 마을 만들기는 Coming Soon! 곧 만나보실 수 있습니다.');
        break;
      case 1001: // Premium Course 3 - AI 도시 세우기 (Coming Soon)
        alert('🏙️ 강의 3: AI 도시 세우기는 Coming Soon! 곧 만나보실 수 있습니다.');
        break;
      default:
        console.log('Unknown course ID:', courseId);
        console.log('사용 가능한 강의 ID: 1(ChatGPT), 2(Documentary), 3(Google AI), 4(AI Business), 5(AI Coding), 6(ChatGPT Prompts 40+), 999(Premium-1), 1000(Premium-2), 1001(Premium-3)');
    }
  };

  return (
    <MainPage 
      onCourseSelect={handleCourseSelect}
      onFAQClick={() => navigate('/faq')}
      onLoginClick={() => navigate('/login')}
      onSignUpClick={() => navigate('/signup')}
    />
  );
};

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

const WorkflowAutomationMasterPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WorkflowAutomationMasterPage onBack={() => navigate('/')} />
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
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AICityMapPage />
    </Suspense>
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
            <Route path="/ai-building-course" element={<WorkflowAutomationMasterPageWrapper />} />
            {/* 기존 URL 리다이렉트 */}
            <Route path="/workflow-automation-master" element={<WorkflowAutomationMasterPageWrapper />} />
            <Route path="/faq" element={<FAQPageWrapper />} />
            <Route path="/ceo" element={<CEOPageWrapper />} />
            <Route path="/ai-city-map" element={<AICityMapPageWrapper />} />
            <Route path="/chatgpt-prompts-40plus" element={<ChatGPTPrompts40PageWrapper />} />
            <Route path="/login" element={<LoginPageWrapper />} />
            <Route path="/signup" element={<SignUpPageWrapper />} />
            <Route path="/dashboard" element={<UserDashboardPageWrapper />} />
            <Route path="/payment/success" element={<PaymentSuccessPageWrapper />} />
            <Route path="/payment/fail" element={<PaymentFailPageWrapper />} />
            {/* 멘토링 라우트들 제거됨 - 강의 사이트에 집중 */}
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;