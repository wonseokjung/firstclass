import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';

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
const PaymentPage = React.lazy(() => import('./components/PaymentPage'));
const PromptEngineeringMasterPage = React.lazy(() => import('./components/PromptEngineeringMasterPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));

// 각 페이지 컴포넌트를 래핑해서 useNavigate 사용
const MainPageWrapper = () => {
  const navigate = useNavigate();

  const handleCourseSelect = (courseId: number) => {
    // 다큐멘터리 (ID 2)인 경우 다큐멘터리 페이지로 이동
    if (courseId === 2) {
      navigate('/documentary');
    } else if (courseId === 3) {
      // Google AI 클래스 (ID 3)인 경우 Google AI 페이지로 이동
      navigate('/google-ai');
    } else if (courseId === 4) {
      // AI Business 클래스 (ID 4)인 경우 AI Business 페이지로 이동
      navigate('/ai-business');
    } else if (courseId === 5) {
      // AI Coding 클래스 (ID 5)인 경우 AI Coding 페이지로 이동
      navigate('/ai-coding');
    } else if (courseId === 999) {
      // 프롬프트의정석 (ID 999)인 경우 프롬프트 엔지니어링 페이지로 이동
      navigate('/prompt-engineering');
    } else {
      navigate('/course');
    }
  };

  const handlePaymentClick = () => {
    navigate('/payment');
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  return (
    <MainPage 
      onCourseSelect={handleCourseSelect}
      onPaymentClick={handlePaymentClick}
      onFAQClick={handleFAQClick}
    />
  );
};

const ChatGPTCoursePageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <ChatGPTCoursePage onBack={handleBack} />;
};

const GoogleAICoursePageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <GoogleAICoursePage onBack={handleBack} />;
};

const AIBusinessCoursePageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <AIBusinessCoursePage onBack={handleBack} />;
};

const AICodingCoursePageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <AICodingCoursePage onBack={handleBack} />;
};

const AIEducationDocumentaryPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <AIEducationDocumentaryPage onBack={handleBack} />;
};

const PaymentPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handlePaymentSuccess = () => {
    navigate('/course');
  };

  return (
    <PaymentPage 
      courseId="ai-business-mastery"
      onSuccess={handlePaymentSuccess}
      onBack={handleBack} 
    />
  );
};

const PromptEngineeringMasterPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PromptEngineeringMasterPage onBack={handleBack} />
  );
};

const FAQPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <FAQPage onBack={handleBack} />
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainPageWrapper />} />
            <Route path="/course" element={<ChatGPTCoursePageWrapper />} />
            <Route path="/google-ai" element={<GoogleAICoursePageWrapper />} />
            <Route path="/ai-business" element={<AIBusinessCoursePageWrapper />} />
            <Route path="/ai-coding" element={<AICodingCoursePageWrapper />} />
            <Route path="/documentary" element={<AIEducationDocumentaryPageWrapper />} />
            <Route path="/payment" element={<PaymentPageWrapper />} />
            <Route path="/prompt-engineering" element={<PromptEngineeringMasterPageWrapper />} />
            <Route path="/faq" element={<FAQPageWrapper />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
