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

// 라이브 학습 페이지들
const GroupLivePage = React.lazy(() => import('./components/live/GroupLivePage'));
const PersonalMentoringPage = React.lazy(() => import('./components/live/PersonalMentoringPage'));

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
      // 업무 자동화 코스 (ID 999)인 경우 워크플로우 자동화 페이지로 이동
      navigate('/workflow-automation');
    } else {
      navigate('/course');
    }
  };



    const handleFAQClick = () => {
    navigate('/faq');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <MainPage 
      onCourseSelect={handleCourseSelect}
      onFAQClick={handleFAQClick}
      onLoginClick={handleLoginClick}
      onSignUpClick={handleSignUpClick}
    />
  );
};

const ChatGPTCoursePageWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('clathon_user_session');
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const userInfo = sessionStorage.getItem('clathon_user_session');
  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return <ChatGPTCoursePage onBack={handleBack} />;
};

const GoogleAICoursePageWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('clathon_user_session');
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const userInfo = sessionStorage.getItem('clathon_user_session');
  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return <GoogleAICoursePage onBack={handleBack} />;
};

const AIBusinessCoursePageWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('clathon_user_session');
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const userInfo = sessionStorage.getItem('clathon_user_session');
  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return <AIBusinessCoursePage onBack={handleBack} />;
};

const AICodingCoursePageWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('clathon_user_session');
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const userInfo = sessionStorage.getItem('clathon_user_session');
  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return <AICodingCoursePage onBack={handleBack} />;
};

const AIEducationDocumentaryPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <AIEducationDocumentaryPage onBack={handleBack} />;
};





const WorkflowAutomationMasterPageWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('clathon_user_session');
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const userInfo = sessionStorage.getItem('clathon_user_session');
  if (!userInfo) {
    return <LoadingSpinner />;
  }

  return (
    <WorkflowAutomationMasterPage onBack={handleBack} />
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

const CEOPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <CEOPage onBack={handleBack} />
  );
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <LoginPage onBack={handleBack} />
  );
};

const SignUpPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <SignUpPage onBack={handleBack} />
  );
};

const UserDashboardPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <UserDashboardPage onBack={handleBack} />
  );
};

const PaymentSuccessPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PaymentSuccessPage onBack={handleBack} />
  );
};

const PaymentFailPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PaymentFailPage onBack={handleBack} />
  );
};

const GroupLivePageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <GroupLivePage onBack={handleBack} />
  );
};

const PersonalMentoringPageWrapper = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PersonalMentoringPage onBack={handleBack} />
  );
};

function App() {
  // 앱 시작 시 Azure Table Storage 테이블 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await AzureTableService.initializeTables();
        console.log('CLATHON Azure Tables initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Azure Tables:', error);
      }
    };

    initializeApp();
  }, []);

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


            <Route path="/workflow-automation" element={<WorkflowAutomationMasterPageWrapper />} />
            <Route path="/prompt-engineering" element={<WorkflowAutomationMasterPageWrapper />} />
            <Route path="/faq" element={<FAQPageWrapper />} />
            <Route path="/ceo" element={<CEOPageWrapper />} />
            <Route path="/login" element={<LoginPageWrapper />} />
            <Route path="/signup" element={<SignUpPageWrapper />} />
            <Route path="/dashboard" element={<UserDashboardPageWrapper />} />
            <Route path="/payment/success" element={<PaymentSuccessPageWrapper />} />
            <Route path="/payment/fail" element={<PaymentFailPageWrapper />} />
            <Route path="/group-live" element={<GroupLivePageWrapper />} />
            <Route path="/personal-mentoring" element={<PersonalMentoringPageWrapper />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
