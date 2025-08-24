import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import AzureTableService from './services/azureTableService';

// LoadingSpinner 컴포넌트 인라인 정의
const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading CLATHON...</p>
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
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const CEOPage = React.lazy(() => import('./components/CEOPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/SignUpPage'));
const UserDashboardPage = React.lazy(() => import('./components/UserDashboardPage'));
const PaymentSuccessPage = React.lazy(() => import('./components/PaymentSuccessPage'));
const PaymentFailPage = React.lazy(() => import('./components/PaymentFailPage'));

// 라이브 학습 페이지들 (현재 사용하지 않음)
// const GroupLivePage = React.lazy(() => import('./components/live/GroupLivePage'));
// const PersonalMentoringPage = React.lazy(() => import('./components/live/PersonalMentoringPage'));
// const CorporateMentoringPage = React.lazy(() => import('./components/CorporateMentoringPage'));

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
      case 1:
        navigate('/chatgpt-course');
        break;
      case 2:
        navigate('/google-ai-course');
        break;
      case 3:
        navigate('/ai-business-course');
        break;
      case 4:
        navigate('/ai-coding-course');
        break;
      case 5:
        navigate('/ai-education-documentary');
        break;
      case 6:
        navigate('/workflow-automation-master');
        break;
      case 999: // Premium Course - Google OPAL 업무 자동화
        navigate('/workflow-automation-master');
        break;
      default:
        console.log('Unknown course ID:', courseId);
        console.log('사용 가능한 강의 ID: 1(ChatGPT), 2(Google AI), 3(AI Business), 4(AI Coding), 5(AI Documentary), 6(Workflow), 999(Premium)');
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

// 멘토링 페이지 래퍼들 (현재 사용하지 않음)
// const GroupLivePageWrapper = () => {
//   const navigate = useNavigate();
//   const handleBack = () => {
//     navigate('/');
//   };
//   return (
//     <GroupLivePage onBack={handleBack} />
//   );
// };

// const PersonalMentoringPageWrapper = () => {
//   const navigate = useNavigate();
//   const handleBack = () => {
//     navigate('/');
//   };
//   return (
//     <PersonalMentoringPage onBack={handleBack} />
//   );
// };

// const CorporateMentoringPageWrapper = () => {
//   const navigate = useNavigate();
//   const handleBack = () => {
//     navigate('/');
//   };
//   return (
//     <CorporateMentoringPage onBack={handleBack} />
//   );
// };

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
            <Route path="/workflow-automation-master" element={<WorkflowAutomationMasterPageWrapper />} />
            <Route path="/faq" element={<FAQPageWrapper />} />
            <Route path="/ceo" element={<CEOPageWrapper />} />
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