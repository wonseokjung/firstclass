import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, Play, Calendar, Zap } from 'lucide-react';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';
import { SkeletonCourseCard, SkeletonUserStats } from '../../common/SkeletonLoader';

interface UserDashboardPageProps {
  onBack: () => void;
}

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningTime: number;
  enrolledCourses: any[];
  purchasedCourses: any[];
}

interface RewardData {
  referralCode: string;
  totalRewards: number;
  pendingRewards: number;
  referralCount: number;
  rewardHistory: any[];
  stats: any;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLearningTime: 0,
    enrolledCourses: [],
    purchasedCourses: []
  });
  const [, setRewardData] = useState<RewardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // sessionStorage에서 사용자 정보 가져오기
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (!storedUserInfo) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);

        // Azure에서 사용자의 수강 정보 가져오기 - 이메일 기반
        console.log('🔍 대시보드에서 수강 정보 조회 시작:', parsedUserInfo.email);
        const enrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
        console.log('📋 대시보드에서 가져온 수강 정보:', enrollments);
        
        // 구매한 강의 정보 가져오기
        console.log('🛒 대시보드에서 구매 내역 조회 시작:', parsedUserInfo.email);
        const purchases = await AzureTableService.getUserPurchasedCourses(parsedUserInfo.email);
        console.log('💳 대시보드에서 가져온 구매 내역:', purchases);
        
        // 각 구매 항목의 필드를 상세히 출력
        purchases.forEach((purchase, idx) => {
          console.log(`📦 구매 항목 ${idx + 1} - 모든 필드:`, Object.keys(purchase));
          console.log(`📦 구매 항목 ${idx + 1} - 전체 데이터:`, purchase);
          console.table({
            courseId: purchase.courseId,
            courseName: purchase.courseName,
            courseTitle: purchase.courseTitle,
            orderName: purchase.orderName,
            amount: purchase.amount,
            orderId: purchase.orderId,
            paymentId: purchase.paymentId,
            externalPaymentId: purchase.externalPaymentId,
            purchasedAt: purchase.purchasedAt,
            timestamp: purchase.timestamp,
            createdAt: purchase.createdAt,
            completedAt: purchase.completedAt,
            paymentMethod: purchase.paymentMethod,
            status: purchase.status
          });
        });
        
        const stats: UserStats = {
          totalCourses: enrollments.length,
          completedCourses: enrollments.filter((course: any) => course.status === 'completed').length,
          inProgressCourses: enrollments.filter((course: any) => course.status === 'active').length,
          totalLearningTime: enrollments.reduce((total: number, course: any) => total + (course.learningTimeMinutes || 0), 0),
          enrolledCourses: enrollments,
          purchasedCourses: purchases
        };

        setUserStats(stats);
        // 리워드 데이터 로딩
        const rewards = await AzureTableService.getUserRewardStatus(parsedUserInfo.email);
        if (rewards) {
          setRewardData(rewards);
          console.log('🎁 리워드 데이터 로딩 완료:', rewards);
        }

      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const getProgressPercentage = () => {
    if (userStats.totalCourses === 0) return 0;
    return Math.round((userStats.completedCourses / userStats.totalCourses) * 100);
  };

  // const copyReferralCode = async () => {
  //   console.log('🔗 추천 코드 복사 버튼 클릭됨');
  //   console.log('📋 rewardData:', rewardData);
  //   
  //   if (rewardData?.referralCode) {
  //     try {
  //       await navigator.clipboard.writeText(rewardData.referralCode);
  //       setCopiedReferralCode(true);
  //       setTimeout(() => setCopiedReferralCode(false), 2000);
  //       console.log('✅ 추천 코드 복사 성공:', rewardData.referralCode);
  //     } catch (err) {
  //       console.error('❌ 복사 실패:', err);
  //       alert('복사에 실패했습니다.');
  //     }
  //   } else {
  //     console.error('❌ 추천 코드가 없습니다:', rewardData);
  //     alert('추천 코드를 찾을 수 없습니다.');
  //   }
  // };

  // const copyReferralLinkHandler = async () => {
  //   console.log('🔗 추천 링크 복사 버튼 클릭됨');
  //   console.log('📋 rewardData:', rewardData);
  //   
  //   if (rewardData?.referralCode) {
  //     try {
  //       const baseUrl = window.location.origin;
  //       const referralLink = `${baseUrl}/?ref=${rewardData.referralCode}`;
  //       await navigator.clipboard.writeText(referralLink);
  //       setCopiedReferralLink(true);
  //       setTimeout(() => setCopiedReferralLink(false), 2000);
  //       console.log('✅ 추천 링크 복사 성공:', referralLink);
  //     } catch (error) {
  //       console.error('❌ 링크 복사 실패:', error);
  //       alert('링크 복사에 실패했습니다.');
  //     }
  //   } else {
  //     console.error('❌ 추천 코드가 아직 생성되지 않았습니다:', rewardData);
  //     alert('추천 코드가 생성 중입니다. 잠시 후 다시 시도해주세요.');
  //   }
  // };



  if (isLoading) {
    return (
      <div className="masterclass-container">
        {/* 네비게이션바 */}
        <NavigationBar 
          onBack={onBack}
          breadcrumbText="내 학습 현황"
        />

        {/* 스켈레톤 로딩 UI */}
        <section style={{ 
          background: 'linear-gradient(135deg, #ffffff, #f8fafc, #f1f5f9)',
          padding: '60px 0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px'
          }}>
            {/* 스켈레톤 사용자 통계 */}
            <SkeletonUserStats />
          </div>
        </section>

        {/* 스켈레톤 강의 목록 */}
        <section style={{ padding: '80px 0', background: '#ffffff' }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {[1, 2, 3].map(i => (
                <SkeletonCourseCard key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="내 학습 현황"
      />

      {/* 대시보드 히어로 섹션 */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        padding: 'clamp(40px, 8vw, 80px) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          opacity: 0.5
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          opacity: 0.6
        }}></div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 40px)',
          position: 'relative',
          zIndex: 2
        }}>
          {/* 웰컴 메시지 */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: 'clamp(30px, 5vw, 50px)'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: '900',
              color: 'white',
              marginBottom: '15px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              안녕하세요, {userInfo?.name || '사용자'}님! 👋
            </h1>
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              오늘도 새로운 지식을 쌓아가는 멋진 하루 되세요!
            </p>
          </div>

          {/* 통계 카드 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* 총 수강 강의 카드 */}
            <div style={{
              background: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.15)';
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                borderRadius: '50%',
                width: 'clamp(56px, 10vw, 72px)',
                height: 'clamp(56px, 10vw, 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
              }}>
                <BookOpen size={28} color="white" />
              </div>
              <h3 style={{ 
                color: '#64748b', 
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', 
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                총 수강 강의
              </h3>
              <p style={{ 
                color: '#0ea5e9',
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: '900',
                margin: '0 0 5px 0'
              }}>
                {userStats.totalCourses}
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', 
                margin: 0,
                fontWeight: '500'
              }}>
                개 강의
              </p>
            </div>

            {/* 수강 중 카드 */}
            <div style={{
              background: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.15)';
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                width: 'clamp(56px, 10vw, 72px)',
                height: 'clamp(56px, 10vw, 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <Play size={28} color="white" />
              </div>
              <h3 style={{ 
                color: '#64748b', 
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', 
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                수강 중
              </h3>
              <p style={{ 
                color: '#10b981',
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: '900',
                margin: '0 0 5px 0'
              }}>
                {userStats.inProgressCourses}
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', 
                margin: 0,
                fontWeight: '500'
              }}>
                개 진행 중
              </p>
            </div>

            {/* 완료한 강의 카드 */}
            <div style={{
              background: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.15)';
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '50%',
                width: 'clamp(56px, 10vw, 72px)',
                height: 'clamp(56px, 10vw, 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
              }}>
                <Award size={28} color="white" />
              </div>
              <h3 style={{ 
                color: '#64748b', 
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', 
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                완료한 강의
              </h3>
              <p style={{ 
                color: '#f59e0b',
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: '900',
                margin: '0 0 5px 0'
              }}>
                {userStats.completedCourses}
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', 
                margin: 0,
                fontWeight: '500'
              }}>
                개 완료
              </p>
            </div>

            {/* 총 학습 시간 카드 */}
            <div style={{
              background: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 32px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.15)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.15)';
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '50%',
                width: 'clamp(56px, 10vw, 72px)',
                height: 'clamp(56px, 10vw, 72px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
              }}>
                <Clock size={28} color="white" />
              </div>
              <h3 style={{ 
                color: '#64748b', 
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', 
                marginBottom: '10px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                총 학습 시간
              </h3>
              <p style={{ 
                color: '#8b5cf6',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '900',
                margin: '0 0 5px 0'
              }}>
                {formatTime(userStats.totalLearningTime)}
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', 
                margin: 0,
                fontWeight: '500'
              }}>
                누적 시간
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 수강 중인 강의 섹션 */}
      <section style={{ 
        padding: 'clamp(60px, 10vw, 100px) 0', 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 40px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              padding: '8px 20px',
              borderRadius: '50px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: 'white',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                MY LEARNING
              </span>
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '900',
              marginBottom: '15px',
              color: '#1f2937'
            }}>
              📚 나의 학습 여정
            </h2>
            <p style={{ 
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              현재 수강 중인 강의들을 확인하고 학습을 이어가세요
            </p>
          </div>

          {userStats.enrolledCourses.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(20px, 4vw, 30px)',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {userStats.enrolledCourses.map((course, index) => {
                // 강의 이름 매핑 (옛날 이름 → 새 이름)
                const courseTitleMap: { [key: string]: string } = {
                  'ChatGPT AI AGENT 비기너편': 'Google Opal 유튜브 수익화 에이전트 기초',
                  'AI 건물 짓기 - 디지털 건축가 과정': 'AI 건물 짓기 - 디지털 건축가 과정'
                };

                const displayTitle = courseTitleMap[course.title] || course.title;

                return (
                <div key={index} style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: 'clamp(24px, 4vw, 32px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.12)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.12)';
                }}
                >
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h3 style={{ 
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0,
                        flex: 1
                      }}>
                        {displayTitle}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        background: course.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: course.status === 'active' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${course.status === 'active' ? '#10b981' : '#f59e0b'}`
                      }}>
                        {course.status === 'active' ? '🔥 수강 중' : 
                         course.status === 'completed' ? '✅ 완료' : '⏸️ 일시정지'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', color: '#64748b', fontWeight: '600' }}>진행률</span>
                      <span style={{ 
                        fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', 
                        fontWeight: '700', 
                        color: '#0ea5e9',
                        background: 'rgba(14, 165, 233, 0.1)',
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}>
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      background: '#e0f2fe',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
                    }}>
                      <div style={{
                        width: `${course.progress || 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
                        transition: 'width 0.5s ease',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(14, 165, 233, 0.3)'
                      }} />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} color="#666666" />
                        <span style={{ fontSize: '0.8rem', color: '#666666' }}>
                          {new Date(course.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                      {course.learningTimeMinutes && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="#666666" />
                          <span style={{ fontSize: '0.8rem', color: '#666666' }}>
                            {formatTime(course.learningTimeMinutes)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      console.log('🔘 이어서 학습 버튼 클릭됨!');
                      console.log('📚 강의 정보:', {
                        courseId: course.courseId,
                        title: course.title,
                        status: course.status
                      });
                      
                      // 강의 플레이어 페이지로 이동
                      const courseRoutes: { [key: string]: string } = {
                        '1002': '/chatgpt-agent-beginner/player',
                        'chatgpt-agent-beginner': '/chatgpt-agent-beginner/player',
                        '999': '/ai-building-course/player',
                        'ai-building': '/ai-building-course/player',
                        'ai-building-course': '/ai-building-course/player',
                        'workflow-automation': '/ai-building-course/player',
                        'prompt-engineering': '/ai-building-course/player',
                        'test12345': '/chatgpt-agent-beginner/player'
                      };
                      const route = courseRoutes[course.courseId] || '/chatgpt-agent-beginner/player';
                      
                      console.log('🚀 이동할 경로:', route);
                      
                      try {
                        navigate(route);
                        console.log('✅ navigate 호출 성공');
                      } catch (error) {
                        console.error('❌ navigate 오류:', error);
                        alert('페이지 이동 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
                      }
                    }}
                    className="watch-trailer-btn" 
                    style={{
                      width: '100%',
                      padding: 'clamp(12px, 2vw, 16px)',
                      borderRadius: '12px',
                      border: 'none',
                      background: course.status === 'completed' 
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: course.status === 'completed'
                        ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                        : '0 4px 15px rgba(14, 165, 233, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = course.status === 'completed'
                        ? '0 6px 20px rgba(245, 158, 11, 0.4)'
                        : '0 6px 20px rgba(14, 165, 233, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = course.status === 'completed'
                        ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                        : '0 4px 15px rgba(14, 165, 233, 0.3)';
                    }}>
                    <Play size={18} />
                    {course.status === 'completed' ? '다시 보기' : '이어서 학습'}
                  </button>
                </div>
              );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px'
              }}>
                <BookOpen size={48} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                아직 수강 중인 강의가 없습니다
              </h3>
              <p style={{ 
                color: '#666666',
                fontSize: '1rem',
                marginBottom: '30px',
                lineHeight: 1.6
              }}>
                새로운 강의를 시작해서 AI 마스터의 길을 걸어보세요!
              </p>
              <button 
                onClick={onBack}
                className="watch-trailer-btn"
                style={{
                  padding: '15px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Zap size={18} />
                강의 둘러보기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 구매한 강의 섹션 */}
      {userStats.purchasedCourses.length > 0 && (
        <section style={{ 
          padding: 'clamp(60px, 10vw, 100px) 0', 
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 40px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '8px 20px',
                borderRadius: '50px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: 'white',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  MY PURCHASES
                </span>
              </div>
              <h2 style={{ 
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '900',
                marginBottom: '15px',
                color: '#1f2937'
              }}>
                💳 구매한 강의
              </h2>
              <p style={{ 
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                결제 완료된 모든 강의 내역을 확인하세요
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(20px, 4vw, 30px)',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {userStats.purchasedCourses.map((purchase, index) => {
                // 강의 정보 매핑 (courseId 기반)
                const courseInfoMap: { [key: string]: string } = {
                  '1002': 'Google Opal 유튜브 수익화 에이전트 기초',
                  'chatgpt-agent-beginner': 'Google Opal 유튜브 수익화 에이전트 기초',
                  '999': 'Step 1: AI 건물주 되기 기초',
                  'ai-building': 'AI 건물 짓기 - 디지털 건축가 과정',
                  'ai-building-course': 'Step 1: AI 건물주 되기 기초',
                  'workflow-automation': 'AI 건물 짓기 - 디지털 건축가 과정',
                  'prompt-engineering': 'AI 건물 짓기 - 디지털 건축가 과정'
                };

                // 옛날 이름 매핑 (title 기반)
                const titleMap: { [key: string]: string } = {
                  'ChatGPT AI AGENT 비기너편': 'Google Opal 유튜브 수익화 에이전트 기초'
                };

                // 강의명 결정 (우선순위: courseId 매핑 > 저장된 이름의 매핑 > 저장된 이름 그대로)
                let displayCourseName = courseInfoMap[purchase.courseId];
                
                if (!displayCourseName) {
                  const savedName = purchase.courseName || purchase.courseTitle || purchase.orderName;
                  displayCourseName = savedName ? (titleMap[savedName] || savedName) : '강의';
                }
                
                // 디버깅: 강의명이 어떻게 결정되었는지 로그
                console.log(`🎯 강의 ${index + 1} 이름 결정:`, {
                  courseId: purchase.courseId,
                  courseName: purchase.courseName,
                  courseTitle: purchase.courseTitle,
                  orderName: purchase.orderName,
                  '매핑된이름': courseInfoMap[purchase.courseId],
                  '최종표시명': displayCourseName
                });

                // 구매일 결정 및 포맷 (실제 데이터에서 createdAt이 항상 있음)
                let displayDate = 'N/A';
                try {
                  const dateValue = purchase.createdAt     // 1순위: createdAt (항상 있음)
                    || purchase.completedAt                // 2순위: completedAt
                    || purchase.purchasedAt                // 3순위: purchasedAt
                    || purchase.timestamp;                 // 4순위: timestamp
                  
                  if (dateValue) {
                    const date = new Date(dateValue);
                    if (!isNaN(date.getTime())) {
                      displayDate = date.toLocaleDateString('ko-KR');
                    }
                  }
                } catch (e) {
                  console.error('날짜 파싱 오류:', e);
                }

                return (
                <div key={index} style={{
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: 'clamp(24px, 4vw, 32px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.12)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.12)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
                >
                  {/* 상단 배지 */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}>
                    ✓ 결제완료
                  </div>

                  <div style={{ marginBottom: '20px', paddingRight: '80px' }}>
                    <h3 style={{ 
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '12px'
                    }}>
                      {displayCourseName}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Calendar size={16} color="#64748b" />
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        구매일: {displayDate}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '20px',
                    marginTop: '20px'
                  }}>

                    {purchase.paymentMethod && (
                      <div style={{
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '15px'
                      }}>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                          결제 수단
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>
                          {purchase.paymentMethod === 'CARD' || purchase.paymentMethod === 'card' 
                            ? '💳 카드 결제' 
                            : purchase.paymentMethod}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('🔘 강의 시작하기 버튼 클릭됨!');
                        console.log('💳 구매 정보:', {
                          courseId: purchase.courseId,
                          courseName: displayCourseName,
                          amount: purchase.amount
                        });
                        
                        // 강의 플레이어 페이지로 이동
                        const courseRoutes: { [key: string]: string } = {
                          '1002': '/chatgpt-agent-beginner/player',
                          'chatgpt-agent-beginner': '/chatgpt-agent-beginner/player',
                          '999': '/ai-building-course/player',
                          'ai-building': '/ai-building-course/player',
                          'ai-building-course': '/ai-building-course/player',
                          'workflow-automation': '/ai-building-course/player',
                          'prompt-engineering': '/ai-building-course/player'
                        };
                        const route = courseRoutes[purchase.courseId] || '/chatgpt-agent-beginner/player';
                        
                        console.log('🚀 이동할 경로:', route);
                        
                        try {
                          navigate(route);
                          console.log('✅ navigate 호출 성공');
                        } catch (error) {
                          console.error('❌ navigate 오류:', error);
                          alert('페이지 이동 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      <Play size={18} />
                      강의 시작하기
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 학습 진행률 요약 섹션 */}
      {userStats.enrolledCourses.length > 0 && (
        <section style={{ 
          background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', 
          padding: '60px 0',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px'
          }}>
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center',
              background: 'rgba(248, 250, 252, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '40px'
            }}>
              <h3 style={{ 
                fontSize: '1.6rem',
                fontWeight: '600',
                marginBottom: '30px',
                color: '#1f2937'
              }}>
                🎯 학습 진행률
              </h3>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(var(--color-primary) 0deg ${getProgressPercentage() * 3.6}deg, #333 ${getProgressPercentage() * 3.6}deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                position: 'relative'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)'
                  }}>
                    {getProgressPercentage()}%
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem',
                    color: '#666666',
                    marginTop: '5px'
                  }}>
                    완료율
                  </span>
                </div>
              </div>
              <p style={{ 
                fontSize: '1rem',
                color: '#666666',
                marginBottom: '10px'
              }}>
                전체 <strong style={{ color: '#1f2937' }}>{userStats.totalCourses}개</strong> 강의 중 <strong style={{ color: '#1f2937' }}>{userStats.completedCourses}개</strong>를 완료했습니다!
              </p>
              {userStats.inProgressCourses > 0 && (
                <p style={{ 
                  fontSize: '0.9rem',
                  color: '#666666'
                }}>
                  현재 <strong style={{ color: '#1f2937' }}>{userStats.inProgressCourses}개</strong> 강의를 수강 중입니다.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>AI City Builders</h3>
            <p>정원석의 정석 시리즈로 시작하는 AI 마스터 여정</p>
          </div>
          
          <div className="footer-section">
            <h4>빠른 링크</h4>
            <ul>
              <li><a href="/">홈</a></li>
              <li><a href="/ai-building-course">AI 건물 짓기</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>고객 지원</h4>
            <ul>
              <li><a href="/terms">이용약관</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="mailto:jay@connexionai.kr">고객센터</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 커넥젼에이아이이. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboardPage;