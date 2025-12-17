import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import AzureTableService from './services/azureTableService';
import { useReferralTracking } from './hooks/useReferralTracking';

// ============================================
// LoadingSpinner 컴포넌트
// ============================================
const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading AI City Builders...</p>
    </div>
  </div>
);

// ============================================
// 고차 컴포넌트 (HOC) - 반복 코드 제거
// ============================================

// 기본 페이지 래퍼 (onBack만 필요한 경우)
const withPageWrapper = <P extends { onBack: () => void }>(
  Component: React.ComponentType<P>,
  backPath: string = '/'
) => {
  const WrappedComponent: React.FC<Omit<P, 'onBack'>> = (props) => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component {...(props as P)} onBack={() => navigate(backPath)} />
      </Suspense>
    );
  };
  return WrappedComponent;
};

// onBack 없이 Suspense만 적용하는 래퍼
const withSuspense = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
  return WrappedComponent;
};

// Day 페이지 래퍼 (onBack + onNext 필요) - ChatGPT Agent Beginner용
const withDayPageWrapper = <P extends { onBack: () => void; onNext: () => void }>(
  Component: React.ComponentType<P>,
  dayNum: number
) => {
  const WrappedComponent: React.FC<Omit<P, 'onBack' | 'onNext'>> = (props) => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component 
          {...(props as P)} 
          onBack={() => navigate('/chatgpt-agent-beginner/player')} 
          onNext={() => navigate(`/chatgpt-agent-beginner/day${dayNum + 1}`)}
        />
      </Suspense>
    );
  };
  return WrappedComponent;
};

// AI Building Day 페이지 래퍼
const withAIBuildingDayPageWrapper = <P extends { onBack: () => void; onNext?: () => void }>(
  Component: React.ComponentType<P>,
  dayNum: number
) => {
  const WrappedComponent: React.FC<Omit<P, 'onBack' | 'onNext'>> = (props) => {
    const navigate = useNavigate();
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component 
          {...(props as P)} 
          onBack={() => navigate('/ai-building-course/player')} 
          onNext={dayNum < 10 ? () => navigate(`/ai-building-course/day${dayNum + 1}`) : undefined}
        />
      </Suspense>
    );
  };
  return WrappedComponent;
};

// ============================================
// 동적 임포트로 코드 스플리팅
// ============================================

// 메인 페이지
const MainPage = React.lazy(() => import('./components/pages/MainPage'));
const AIConstructionSitePage = React.lazy(() => import('./components/pages/AIConstructionSitePage'));
const AIConstructionSiteStep1Page = React.lazy(() => import('./components/pages/AIConstructionSiteStep1Page'));
const AIConstructionSiteStep2Page = React.lazy(() => import('./components/pages/AIConstructionSiteStep2Page'));
const AIConstructionSiteStep3Page = React.lazy(() => import('./components/pages/AIConstructionSiteStep3Page'));
const AIWorkflowEditorPage = React.lazy(() => import('./components/pages/AIWorkflowEditorPage'));
const RoadmapPage = React.lazy(() => import('./components/pages/RoadmapPage'));
const ChatGPTPrompts40Page = React.lazy(() => import('./components/pages/ChatGPTPrompts40Page'));
const AIMoneyMasterPromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyMasterPromptsPage'));
const AIMoneyImagePromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyImagePromptsPage'));
const AIMoneyVideoPromptsPage = React.lazy(() => import('./components/pages/ai-money-courses/AIMoneyVideoPromptsPage'));
const AIRealisticCharacterVideoPage = React.lazy(() => import('./components/pages/ai-money-courses/AIRealisticCharacterVideoPage'));
const FAQPage = React.lazy(() => import('./components/pages/FAQPage'));
const CEOPage = React.lazy(() => import('./components/pages/CEOPage'));
const ContactPage = React.lazy(() => import('./components/pages/ContactPage'));
const ClubsPage = React.lazy(() => import('./components/pages/ClubsPage'));

// 라이브 페이지
const LiveHubPage = React.lazy(() => import('./components/pages/live/LiveHubPage'));
const StepLivePage = React.lazy(() => import('./components/pages/live/StepLivePage'));
const FreeLivePage = React.lazy(() => import('./components/pages/live/FreeLivePage'));

// 커뮤니티 페이지
const CommunityHubPage = React.lazy(() => import('./components/pages/community/CommunityHubPage'));
const CommunityStepPage = React.lazy(() => import('./components/pages/community/CommunityStepPage'));

// 강의 페이지
const ChatGPTCoursePage = React.lazy(() => import('./components/pages/courses/ChatGPTCoursePage'));
const GoogleAICoursePage = React.lazy(() => import('./components/pages/courses/GoogleAICoursePage'));
const AIBusinessCoursePage = React.lazy(() => import('./components/pages/courses/AIBusinessCoursePage'));
const AICodingCoursePage = React.lazy(() => import('./components/pages/courses/AICodingCoursePage'));
const AILandlordPreviewPage = React.lazy(() => import('./components/pages/courses/AILandlordPreviewPage'));
const AIEducationDocumentaryPage = React.lazy(() => import('./components/pages/courses/AIEducationDocumentaryPage'));
const AIBuildingCoursePage = React.lazy(() => import('./components/pages/courses/AIBuildingCoursePage'));
const AIBuildingCoursePlayerPage = React.lazy(() => import('./components/pages/courses/AIBuildingCoursePlayerPage'));
const ChatGPTAgentBeginnerPage = React.lazy(() => import('./components/pages/courses/ChatGPTAgentBeginnerPage'));
const ContentBusinessPage = React.lazy(() => import('./components/pages/courses/ContentBusinessPage'));
const AgentDispatchPage = React.lazy(() => import('./components/pages/courses/AgentDispatchPage'));
const LongformToShortsPage = React.lazy(() => import('./components/pages/tools/LongformToShortsPage'));
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
const AIBuildingPaymentPage = React.lazy(() => import('./components/pages/courses/ai-building/PaymentPage'));

// AI Building Course Day 페이지들
const AIBuildingDay1Page = React.lazy(() => import('./components/pages/courses/ai-building/Day1Page'));
const AIBuildingDay2Page = React.lazy(() => import('./components/pages/courses/ai-building/Day2Page'));
const AIBuildingDay3Page = React.lazy(() => import('./components/pages/courses/ai-building/Day3Page'));
const AIBuildingDay4Page = React.lazy(() => import('./components/pages/courses/ai-building/Day4Page'));
const AIBuildingDay5Page = React.lazy(() => import('./components/pages/courses/ai-building/Day5Page'));
const AIBuildingDay6Page = React.lazy(() => import('./components/pages/courses/ai-building/Day6Page'));
const AIBuildingDay7Page = React.lazy(() => import('./components/pages/courses/ai-building/Day7Page'));
const AIBuildingDay8Page = React.lazy(() => import('./components/pages/courses/ai-building/Day8Page'));
const AIBuildingDay9Page = React.lazy(() => import('./components/pages/courses/ai-building/Day9Page'));
const AIBuildingDay10Page = React.lazy(() => import('./components/pages/courses/ai-building/Day10Page'));
const CostOptimizationExamplesPage = React.lazy(() => import('./components/pages/courses/CostOptimizationExamplesPage'));
const N8nAutomationIntermediatePage = React.lazy(() => import('./components/pages/courses/N8nAutomationIntermediatePage'));
const N8nAutomationAdvancedPage = React.lazy(() => import('./components/pages/courses/N8nAutomationAdvancedPage'));

// 인증 페이지
const LoginPage = React.lazy(() => import('./components/pages/auth/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/pages/auth/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('./components/pages/ForgotPasswordPage'));

// 파트너 프로그램
const PartnerDashboardPage = React.lazy(() => import('./components/pages/partner/PartnerDashboardPage'));
const UserDashboardPage = React.lazy(() => import('./components/pages/auth/UserDashboardPage'));

// 결제 페이지
const PaymentSuccessPage = React.lazy(() => import('./components/pages/payment/PaymentSuccessPage'));
const PaymentFailPage = React.lazy(() => import('./components/pages/payment/PaymentFailPage'));

// 환불 정책 페이지
const RefundPolicyPage = React.lazy(() => import('./components/pages/RefundPolicyPage'));

// 관리자 페이지
const AdminEnrollmentFixPage = React.lazy(() => import('./components/pages/admin/AdminEnrollmentFixPage'));
const AdminDashboardPage = React.lazy(() => import('./components/pages/admin/AdminDashboardPage'));
const PaymentDetailsViewPage = React.lazy(() => import('./components/pages/admin/PaymentDetailsViewPage'));

// ============================================
// HOC를 사용한 래핑된 컴포넌트들
// ============================================

// 강의 페이지
const ChatGPTCoursePageWrapped = withPageWrapper(ChatGPTCoursePage);
const GoogleAICoursePageWrapped = withPageWrapper(GoogleAICoursePage);
const AIBusinessCoursePageWrapped = withPageWrapper(AIBusinessCoursePage);
const AICodingCoursePageWrapped = withPageWrapper(AICodingCoursePage);
const AILandlordPreviewPageWrapped = withPageWrapper(AILandlordPreviewPage);
const AIEducationDocumentaryPageWrapped = withPageWrapper(AIEducationDocumentaryPage);
const AIBuildingCoursePageWrapped = withPageWrapper(AIBuildingCoursePage);
const AIBuildingCoursePlayerPageWrapped = withPageWrapper(AIBuildingCoursePlayerPage);
const ChatGPTAgentBeginnerPageWrapped = withPageWrapper(ChatGPTAgentBeginnerPage);
const ContentBusinessPageWrapped = withPageWrapper(ContentBusinessPage);
const AgentDispatchPageWrapped = withPageWrapper(AgentDispatchPage);
const ChatGPTAgentBeginnerPlayerPageWrapped = withPageWrapper(ChatGPTAgentBeginnerPlayerPage);
const N8nAutomationIntermediatePageWrapped = withPageWrapper(N8nAutomationIntermediatePage);
const N8nAutomationAdvancedPageWrapped = withPageWrapper(N8nAutomationAdvancedPage);
const CostOptimizationExamplesPageWrapped = withPageWrapper(CostOptimizationExamplesPage, '/chatgpt-agent-beginner');

// 결제 페이지
const AIBuildingPaymentPageWrapped = withPageWrapper(AIBuildingPaymentPage, '/ai-building-course');
const ChatGPTAgentBeginnerPaymentPageWrapped = withPageWrapper(ChatGPTAgentBeginnerPaymentPage, '/chatgpt-agent-beginner');

// 일반 페이지
const FAQPageWrapped = withPageWrapper(FAQPage);
const CEOPageWrapped = withPageWrapper(CEOPage);
const ContactPageWrapped = withPageWrapper(ContactPage);
const ClubsPageWrapped = withPageWrapper(ClubsPage);
const ChatGPTPrompts40PageWrapped = withPageWrapper(ChatGPTPrompts40Page);
const AIMoneyMasterPromptsPageWrapped = withPageWrapper(AIMoneyMasterPromptsPage);
const AIMoneyImagePromptsPageWrapped = withPageWrapper(AIMoneyImagePromptsPage);
const AIMoneyVideoPromptsPageWrapped = withPageWrapper(AIMoneyVideoPromptsPage);
const AIRealisticCharacterVideoPageWrapped = withPageWrapper(AIRealisticCharacterVideoPage);
const AIConstructionSitePageWrapped = withPageWrapper(AIConstructionSitePage);

// 인증 페이지
const LoginPageWrapped = withPageWrapper(LoginPage);
const SignUpPageWrapped = withPageWrapper(SignUpPage);
const UserDashboardPageWrapped = withPageWrapper(UserDashboardPage);
const PaymentSuccessPageWrapped = withPageWrapper(PaymentSuccessPage);
const PaymentFailPageWrapped = withPageWrapper(PaymentFailPage);
const RefundPolicyPageWrapped = withPageWrapper(RefundPolicyPage);

// Suspense만 적용 (onBack 없음)
const AIConstructionSiteStep1PageWrapped = withSuspense(AIConstructionSiteStep1Page);
const AIConstructionSiteStep2PageWrapped = withSuspense(AIConstructionSiteStep2Page);
const AIConstructionSiteStep3PageWrapped = withSuspense(AIConstructionSiteStep3Page);
const RoadmapPageWrapped = withSuspense(RoadmapPage);
const AIWorkflowEditorPageWrapped = withSuspense(AIWorkflowEditorPage);
const LiveHubPageWrapped = withPageWrapper(LiveHubPage, '/');
const StepLivePageWrapped = withPageWrapper(StepLivePage, '/live');
const FreeLivePageWrapped = withPageWrapper(FreeLivePage, '/live');
const CommunityHubPageWrapped = withSuspense(CommunityHubPage);
const CommunityStepPageWrapped = withSuspense(CommunityStepPage);
const ForgotPasswordPageWrapped = withSuspense(ForgotPasswordPage);

// Day 페이지들 - ChatGPT Agent Beginner
const Day1PageWrapped = withDayPageWrapper(Day1Page, 1);
const Day2PageWrapped = withDayPageWrapper(Day2Page, 2);
const Day3PageWrapped = withDayPageWrapper(Day3Page, 3);
const Day4PageWrapped = withDayPageWrapper(Day4Page, 4);
const Day5PageWrapped = withDayPageWrapper(Day5Page, 5);
const Day6PageWrapped = withDayPageWrapper(Day6Page, 6);
const Day7PageWrapped = withDayPageWrapper(Day7Page, 7);
const Day8PageWrapped = withDayPageWrapper(Day8Page, 8);
const Day9PageWrapped = withDayPageWrapper(Day9Page, 9);
const Day10PageWrapped = withDayPageWrapper(Day10Page, 10);

// Day 페이지들 - AI Building Course
const AIBuildingDay1PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay1Page, 1);
const AIBuildingDay2PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay2Page, 2);
const AIBuildingDay3PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay3Page, 3);
const AIBuildingDay4PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay4Page, 4);
const AIBuildingDay5PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay5Page, 5);
const AIBuildingDay6PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay6Page, 6);
const AIBuildingDay7PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay7Page, 7);
const AIBuildingDay8PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay8Page, 8);
const AIBuildingDay9PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay9Page, 9);
const AIBuildingDay10PageWrapped = withAIBuildingDayPageWrapper(AIBuildingDay10Page, 10);

// ============================================
// 특수 컴포넌트들 (HOC로 처리 불가)
// ============================================

// 메인 페이지 래퍼 (특수 로직 포함)
const MainPageWrapper = () => {
  const navigate = useNavigate();
  // 추천 추적은 GlobalReferralTracker에서 전역 처리
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    if (redirectPath) {
      navigate('/' + redirectPath);
    }
  }, [navigate]);

  return (
    <MainPage 
      onFAQClick={() => navigate('/faq')}
      onLoginClick={() => navigate('/login')}
      onSignUpClick={() => navigate('/signup')}
    />
  );
};

// 리다이렉트 컴포넌트들
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
  
// Coming Soon 안내 페이지
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '20px' }}>
            AI 건물 짓기 강의
          </h1>
        <h2 style={{ fontSize: '1.8rem', color: '#0ea5e9', marginBottom: '30px', fontWeight: '600' }}>
          🗓️ Coming Soon
          </h2>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '30px' }}>
          더 완성도 높은 강의와 혁신적인 교육 경험을 위해<br/>열심히 준비하고 있습니다! 💪
          </p>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
          <p style={{ color: '#0ea5e9', fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px' }}>
              ⏰ 기다리는 동안
            </p>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
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
          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
          >
            다른 강의 보러가기 🚀
          </button>
        </div>
      </div>
    );
  };
  
// 관리자 결제 상세 페이지 래퍼
const PaymentDetailsViewPageWrapper = () => (
      <Suspense fallback={<LoadingSpinner />}>
    <PaymentDetailsViewPage onBack={() => window.location.href = '/admin'} />
      </Suspense>
    );

// 🔗 전역 추천 코드 추적 컴포넌트 (모든 페이지에서 작동)
const GlobalReferralTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useReferralTracking();
  return <>{children}</>;
  };

// ============================================
// 메인 App 컴포넌트
// ============================================
  function App() {
    useEffect(() => {
      AzureTableService.initializeTables();
    }, []);
  
    return (
      <Router>
      <GlobalReferralTracker>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            {/* 메인 */}
              <Route path="/" element={<MainPageWrapper />} />
            
            {/* 강의 페이지 */}
            <Route path="/chatgpt-course" element={<ChatGPTCoursePageWrapped />} />
            <Route path="/google-ai-course" element={<GoogleAICoursePageWrapped />} />
            <Route path="/ai-business-course" element={<AIBusinessCoursePageWrapped />} />
            <Route path="/ai-coding-course" element={<AICodingCoursePageWrapped />} />
            <Route path="/ai-landlord-preview" element={<AILandlordPreviewPageWrapped />} />
            <Route path="/ai-education-documentary" element={<AIEducationDocumentaryPageWrapped />} />
            <Route path="/ai-building-course" element={<AIBuildingCoursePageWrapped />} />
            <Route path="/ai-building-course/payment" element={<AIBuildingPaymentPageWrapped />} />
            <Route path="/ai-building-course/player" element={<AIBuildingCoursePlayerPageWrapped />} />
            <Route path="/chatgpt-agent-beginner" element={<ChatGPTAgentBeginnerPageWrapped />} />
            <Route path="/content-business" element={<ContentBusinessPageWrapped />} />
            <Route path="/vibe-coding" element={<ContentBusinessPageWrapped />} />
            <Route path="/agent-dispatch" element={<AgentDispatchPageWrapped />} />
            <Route path="/solo-business" element={<AgentDispatchPageWrapped />} />
            <Route path="/chatgpt-agent-beginner/payment" element={<ChatGPTAgentBeginnerPaymentPageWrapped />} />
            <Route path="/chatgpt-agent-beginner/player" element={<ChatGPTAgentBeginnerPlayerPageWrapped />} />
            <Route path="/cost-optimization-examples" element={<CostOptimizationExamplesPageWrapped />} />
            <Route path="/n8n-automation-intermediate" element={<N8nAutomationIntermediatePageWrapped />} />
            <Route path="/n8n-automation-advanced" element={<N8nAutomationAdvancedPageWrapped />} />
            
            {/* Day 페이지들 - ChatGPT Agent Beginner */}
            <Route path="/chatgpt-agent-beginner/day1" element={<Day1PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day2" element={<Day2PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day3" element={<Day3PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day4" element={<Day4PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day5" element={<Day5PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day6" element={<Day6PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day7" element={<Day7PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day8" element={<Day8PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day9" element={<Day9PageWrapped />} />
            <Route path="/chatgpt-agent-beginner/day10" element={<Day10PageWrapped />} />
            
            {/* Day 페이지들 - AI Building Course */}
            <Route path="/ai-building-course/day1" element={<AIBuildingDay1PageWrapped />} />
            <Route path="/ai-building-course/day2" element={<AIBuildingDay2PageWrapped />} />
            <Route path="/ai-building-course/day3" element={<AIBuildingDay3PageWrapped />} />
            <Route path="/ai-building-course/day4" element={<AIBuildingDay4PageWrapped />} />
            <Route path="/ai-building-course/day5" element={<AIBuildingDay5PageWrapped />} />
            <Route path="/ai-building-course/day6" element={<AIBuildingDay6PageWrapped />} />
            <Route path="/ai-building-course/day7" element={<AIBuildingDay7PageWrapped />} />
            <Route path="/ai-building-course/day8" element={<AIBuildingDay8PageWrapped />} />
            <Route path="/ai-building-course/day9" element={<AIBuildingDay9PageWrapped />} />
            <Route path="/ai-building-course/day10" element={<AIBuildingDay10PageWrapped />} />
            
            {/* 리다이렉트 */}
              <Route path="/chatgpt-agent-beginner-player" element={<RedirectToNewPlayerUrl />} />
              <Route path="/ai-building-course-player" element={<RedirectToNewAIBuildingPlayerUrl />} />
              <Route path="/workflow-automation-master" element={<ComingSoonNotice />} />
            
            {/* 일반 페이지 */}
            <Route path="/faq" element={<FAQPageWrapped />} />
            <Route path="/ceo" element={<CEOPageWrapped />} />
            <Route path="/contact" element={<ContactPageWrapped />} />
            
            {/* 파트너 프로그램 */}
            <Route path="/partner" element={
              <Suspense fallback={<LoadingSpinner />}>
                <PartnerDashboardPage />
              </Suspense>
            } />
            <Route path="/clubs" element={<ClubsPageWrapped />} />
            <Route path="/roadmap" element={<RoadmapPageWrapped />} />
            <Route path="/chatgpt-prompts-40plus" element={<ChatGPTPrompts40PageWrapped />} />
            <Route path="/ai-money-master-prompts" element={<AIMoneyMasterPromptsPageWrapped />} />
            <Route path="/ai-money-image-prompts" element={<AIMoneyImagePromptsPageWrapped />} />
            <Route path="/ai-money-video-prompts" element={<AIMoneyVideoPromptsPageWrapped />} />
            <Route path="/ai-character-video-prompts" element={<AIRealisticCharacterVideoPageWrapped />} />
            
            {/* AI 건물 공사장 */}
            <Route path="/ai-construction-site" element={<AIConstructionSitePageWrapped />} />
            <Route path="/ai-construction-site/step1" element={<AIConstructionSiteStep1PageWrapped />} />
            <Route path="/ai-construction-site/step2" element={<AIConstructionSiteStep2PageWrapped />} />
            <Route path="/ai-construction-site/step3" element={<AIConstructionSiteStep3PageWrapped />} />
            <Route path="/tools/longform-to-shorts" element={
              <Suspense fallback={<LoadingSpinner />}>
                <LongformToShortsPage />
              </Suspense>
            } />
            <Route path="/ai-workflow-editor" element={<AIWorkflowEditorPageWrapped />} />
            
              {/* 라이브 페이지 */}
            <Route path="/live" element={<LiveHubPageWrapped />} />
            <Route path="/live/free" element={<FreeLivePageWrapped />} />
            <Route path="/live/:stepId" element={<StepLivePageWrapped />} />
            
              {/* 커뮤니티 */}
            <Route path="/community" element={<CommunityHubPageWrapped />} />
            <Route path="/community/:stepId" element={<CommunityStepPageWrapped />} />
            
            {/* 인증 */}
            <Route path="/login" element={<LoginPageWrapped />} />
            <Route path="/signup" element={<SignUpPageWrapped />} />
            <Route path="/forgot-password" element={<ForgotPasswordPageWrapped />} />
            <Route path="/dashboard" element={<UserDashboardPageWrapped />} />
            
            {/* 결제 */}
            <Route path="/payment/success" element={<PaymentSuccessPageWrapped />} />
            <Route path="/payment/fail" element={<PaymentFailPageWrapped />} />
            
            {/* 환불 정책 */}
            <Route path="/refund-policy" element={<RefundPolicyPageWrapped />} />
            
            {/* 관리자 */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/fix-enrollments" element={<AdminEnrollmentFixPage />} />
            <Route path="/admin/payment-details" element={<PaymentDetailsViewPageWrapper />} />
            </Routes>
          </Suspense>
        </div>
      </GlobalReferralTracker>
      </Router>
    );
  }
  
  export default App;
