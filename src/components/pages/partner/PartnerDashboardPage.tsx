import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService, { Partner, PartnerReferral, PartnerWithdrawal } from '../../../services/azureTableService';

// 브랜드 컬러 - 더 밝고 선명하게
const COLORS = {
  // 배경
  bgDark: '#0c1929',
  bgMain: '#132337',
  bgCard: '#1a3150',
  bgCardHover: '#234060',
  
  // 메인 컬러
  gold: '#fbbf24',
  goldLight: '#fcd34d',
  goldBright: '#fef08a',
  
  // 브릭 (오렌지)
  brick: '#f97316',
  brickLight: '#fb923c',
  brickBright: '#fdba74',
  
  // 텍스트
  white: '#ffffff',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  
  // 상태
  success: '#22c55e',
  successLight: '#4ade80',
  warning: '#eab308',
  warningLight: '#facc15',
  
  // 보더
  border: 'rgba(251, 191, 36, 0.3)',
  borderLight: 'rgba(251, 191, 36, 0.15)'
};

// Azure 데이터 타입 사용
type ReferralRecord = PartnerReferral;
type WithdrawalRecord = PartnerWithdrawal;

const PartnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'withdraw'>('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<Partner | null>(null);

  // Azure 데이터
  const [totalBricks, setTotalBricks] = useState(0);
  const [pendingBricks, setPendingBricks] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [withdrawnBricks, setWithdrawnBricks] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralHistory, setReferralHistory] = useState<ReferralRecord[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>([]);
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [purchasedCourseCount, setPurchasedCourseCount] = useState(0);

  // 파트너 데이터 로드
  const loadPartnerData = async (email: string, name: string) => {
    try {
      setLoading(true);
      
      // 구매한 강의 확인
      const enrollments = await AzureTableService.getUserEnrollmentsByEmail(email);
      const paidCourses = enrollments.filter(e => 
        ['999', '1000', '1001', '1002'].includes(e.courseId)
      );
      setHasPurchasedCourse(paidCourses.length > 0);
      setPurchasedCourseCount(paidCourses.length);
      
      // 강의 구매자만 파트너 데이터 로드
      if (paidCourses.length > 0) {
        // 파트너 정보 조회/생성
        const partner = await AzureTableService.getOrCreatePartner(email, name);
        if (partner) {
          setPartnerData(partner);
          setTotalBricks(partner.totalBricks);
          setPendingBricks(partner.pendingBricks);
          setWithdrawnBricks(partner.withdrawnBricks);
          setTotalReferrals(partner.totalReferrals);
        }

        // 추천 내역 조회
        const referrals = await AzureTableService.getReferrals(email);
        setReferralHistory(referrals);

        // 출금 내역 조회
        const withdrawals = await AzureTableService.getWithdrawals(email);
        setWithdrawalHistory(withdrawals);
      }

    } catch (error) {
      console.error('파트너 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setIsLoggedIn(true);
        setUserName(user?.name || '파트너');
        setUserEmail(user?.email || '');
        
        // 파트너 데이터 로드
        if (user?.email) {
          loadPartnerData(user.email, user?.name || '파트너');
        }
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 추천 링크 생성
  const getReferralLink = () => {
    const baseUrl = 'https://www.aicitybuilders.com';
    const referralCode = partnerData?.referralCode || 'PARTNER';
    return `${baseUrl}?ref=${referralCode}`;
  };

  // 링크 복사
  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 출금 신청
  const handleWithdrawSubmit = async () => {
    const amount = parseInt(withdrawAmount);
    if (amount < 100000) {
      alert('최소 출금 금액은 100,000 브릭입니다.');
      return;
    }
    
    const availableBricks = partnerData?.availableBricks || 0;
    if (amount > availableBricks) {
      alert('출금 가능한 브릭이 부족합니다.');
      return;
    }
    if (!bankName || !accountNumber || !accountHolder) {
      alert('계좌 정보를 모두 입력해주세요.');
      return;
    }

    // Azure에 출금 신청
    const result = await AzureTableService.requestWithdrawal(
      userEmail,
      amount,
      bankName,
      accountNumber,
      accountHolder
    );

    if (result.success) {
      alert(result.message);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountHolder('');
      // 데이터 새로고침
      loadPartnerData(userEmail, userName);
    } else {
      alert(result.message);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: COLORS.bgDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>🧱</div>
          <div style={{ color: COLORS.gold, fontSize: '1.3rem', fontWeight: '600' }}>
            브릭 로딩 중...
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  // 비로그인 상태
  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.bgMain} 100%)`
      }}>
        <NavigationBar />
        <div style={{ 
          maxWidth: '750px', 
          margin: '0 auto', 
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '4.5rem', 
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))'
          }}>🧱</div>
          <h1 style={{ 
            color: COLORS.white, 
            fontSize: '2.3rem', 
            fontWeight: '800',
            marginBottom: '15px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
          }}>
            브릭 파트너 프로그램
          </h1>
          <p style={{ 
            color: COLORS.textSecondary, 
            fontSize: '1.15rem', 
            marginBottom: '30px', 
            lineHeight: '1.8'
          }}>
            AI City Builders 강의를 추천하고<br/>
            <span style={{ 
              color: COLORS.gold, 
              fontWeight: '700',
              fontSize: '1.3rem'
            }}>판매 금액의 10%</span>를 브릭으로 받으세요!<br/>
            <span style={{ color: COLORS.textMuted, fontSize: '1rem' }}>
              (1 브릭 = 1원, 현금으로 출금 가능)
            </span>
          </p>

          {/* 파트너 미션 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.brick}10)`,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            border: `1px solid ${COLORS.gold}30`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🌟</div>
            <h3 style={{ 
              color: COLORS.gold, 
              fontSize: '1.3rem', 
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              We are the Messengers of Hope
            </h3>
            <p style={{ 
              color: COLORS.textPrimary, 
              fontSize: '1.05rem', 
              fontWeight: '600',
              marginBottom: '18px',
              lineHeight: '1.7'
            }}>
              우리는 희망을 전달하는 사람들입니다
            </p>
            <p style={{ 
              color: COLORS.textSecondary, 
              fontSize: '0.95rem', 
              lineHeight: '1.8'
            }}>
              인공지능 시대, 길을 잃지 않도록 <strong style={{ color: COLORS.gold }}>꿈의 좌표</strong>를 제시합니다.<br/>
              양질의 AI 교육을 전달하고, 빠르게 변하는 세상 속에서<br/>
              <strong style={{ color: COLORS.brickLight }}>올바른 지식</strong>을 전파하여<br/>
              사람들이 꿈과 희망을 잃지 않도록 돕습니다. 💫
            </p>
          </div>

          {/* 작동 방식 */}
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            border: `1px solid ${COLORS.gold}30`,
            textAlign: 'left'
          }}>
            <h3 style={{ color: COLORS.gold, fontSize: '1.1rem', marginBottom: '18px', textAlign: 'center' }}>
              🔄 이렇게 작동해요
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  background: COLORS.brick, 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>강의를 구매하면 파트너 자격 획득</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.9rem' }}>Step 1~4 중 1개 이상 구매 시</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  background: COLORS.brick, 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>나만의 추천 링크 생성</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.9rem' }}>aicitybuilders.com?ref=내코드</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  background: COLORS.brick, 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>링크로 누군가 강의 구매</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.9rem' }}>24시간 내 구매 시 인정</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  background: COLORS.gold, 
                  color: COLORS.bgDark, 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>4</div>
                <div>
                  <div style={{ color: COLORS.gold, fontWeight: '700' }}>판매 금액의 10% 브릭 적립!</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.9rem' }}>월말 정산 후 현금 출금 (최소 10만 브릭)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 수익 예시 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.brick}20, ${COLORS.gold}15)`,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '30px',
            border: `2px solid ${COLORS.gold}40`
          }}>
            <h3 style={{ color: COLORS.gold, fontSize: '1.1rem', marginBottom: '15px' }}>
              💰 수익 예시
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ 
                background: COLORS.bgDark, 
                padding: '15px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: '5px' }}>Step 1 판매 시</div>
                <div style={{ color: COLORS.brick, fontSize: '1.3rem', fontWeight: '800' }}>+3,660원</div>
              </div>
              <div style={{ 
                background: COLORS.bgDark, 
                padding: '15px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: '5px' }}>Step 2 판매 시</div>
                <div style={{ color: COLORS.brick, fontSize: '1.3rem', fontWeight: '800' }}>+7,970원</div>
              </div>
              <div style={{ 
                background: COLORS.bgDark, 
                padding: '15px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: '5px' }}>Step 3 판매 시</div>
                <div style={{ color: COLORS.textMuted, fontSize: '1.1rem', fontWeight: '600' }}>가격 미정</div>
              </div>
              <div style={{ 
                background: COLORS.bgDark, 
                padding: '15px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: '5px' }}>Step 4 판매 시</div>
                <div style={{ color: COLORS.textMuted, fontSize: '1.1rem', fontWeight: '600' }}>가격 미정</div>
              </div>
            </div>
            <p style={{ 
              color: COLORS.textMuted, 
              fontSize: '0.9rem', 
              marginTop: '15px',
              textAlign: 'center'
            }}>
              Step 1+2 판매 시 <strong style={{ color: COLORS.gold }}>11,630원</strong> 적립!
            </p>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.brick})`,
              color: COLORS.bgDark,
              border: 'none',
              padding: '18px 50px',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: `0 10px 40px rgba(251, 191, 36, 0.4)`,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.4)';
            }}
          >
            로그인하고 파트너 되기 →
          </button>
          
          <p style={{ 
            color: COLORS.textMuted, 
            fontSize: '0.9rem', 
            marginTop: '20px'
          }}>
            이미 강의를 구매하셨나요? 로그인하면 바로 시작!
          </p>
        </div>
      </div>
    );
  }

  // 강의 미구매자 안내
  if (!hasPurchasedCourse) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.bgMain} 100%)`
      }}>
        <NavigationBar />
        <div style={{ 
          maxWidth: '700px', 
          margin: '0 auto', 
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '5rem', 
            marginBottom: '25px',
            filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.5))'
          }}>🔒</div>
          <h1 style={{ 
            color: COLORS.white, 
            fontSize: '2.2rem', 
            fontWeight: '800',
            marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
          }}>
            파트너 자격이 필요해요!
          </h1>
          <p style={{ 
            color: COLORS.textSecondary, 
            fontSize: '1.15rem', 
            marginBottom: '35px', 
            lineHeight: '1.8'
          }}>
            브릭 파트너 프로그램은<br/>
            <strong style={{ color: COLORS.gold }}>유료 강의를 구매한 분</strong>만 참여할 수 있어요.
          </p>

          {/* 파트너 자격 조건 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.brick}15, ${COLORS.gold}10)`,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            border: `2px solid ${COLORS.gold}40`
          }}>
            <h3 style={{ color: COLORS.gold, fontSize: '1.1rem', marginBottom: '18px' }}>
              📋 파트너 자격 조건
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              textAlign: 'left'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px 15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>✅</span>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>Step 1~4 중 1개 이상 구매</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>유료 강의 구매자만 파트너 자격 부여</div>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px 15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>📊</span>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>강의 개수에 따른 혜택 없음</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>모든 파트너 동일하게 10% 커미션</div>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px 15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>⏰</span>
                <div>
                  <div style={{ color: COLORS.textPrimary, fontWeight: '600' }}>구매 즉시 파트너 자격</div>
                  <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>별도 신청 없이 자동으로 활성화</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 파트너 혜택 */}
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '35px',
            border: `1px solid ${COLORS.gold}30`
          }}>
            <h3 style={{ color: COLORS.gold, fontSize: '1.1rem', marginBottom: '18px' }}>
              🎁 파트너 혜택
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '15px',
              textAlign: 'center'
            }}>
              <div style={{ 
                padding: '15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
                <div style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '1.1rem' }}>10%</div>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>추천 수익</div>
              </div>
              <div style={{ 
                padding: '15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔗</div>
                <div style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '1.1rem' }}>전용 링크</div>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>자동 생성</div>
              </div>
              <div style={{ 
                padding: '15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💸</div>
                <div style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '1.1rem' }}>현금화</div>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>10만 브릭~</div>
              </div>
              <div style={{ 
                padding: '15px',
                background: COLORS.bgDark,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
                <div style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '1.1rem' }}>월말 정산</div>
                <div style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>매월 지급</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.brick})`,
              color: COLORS.bgDark,
              border: 'none',
              padding: '18px 50px',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: `0 10px 40px rgba(251, 191, 36, 0.4)`,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.4)';
            }}
          >
            강의 둘러보기 →
          </button>
          
          <p style={{ 
            color: COLORS.textMuted, 
            fontSize: '0.95rem', 
            marginTop: '25px'
          }}>
            강의 구매 후 이 페이지에서 파트너 활동을 시작하세요! 🚀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.bgMain} 100%)`
    }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 헤더 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.brick})`,
              padding: '10px 24px',
              borderRadius: '50px',
              marginBottom: '15px',
              boxShadow: `0 4px 20px rgba(251, 191, 36, 0.3)`
            }}>
              <span style={{ fontSize: '1.3rem' }}>🧱</span>
              <span style={{ color: COLORS.bgDark, fontWeight: '800', fontSize: '1rem' }}>BRICK PARTNER</span>
            </div>
            <h1 style={{ 
              color: COLORS.white, 
              fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
              fontWeight: '800',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {userName}님의 대시보드
            </h1>
          </div>
          
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={(partnerData?.availableBricks || 0) < 100000}
            style={{
              background: (partnerData?.availableBricks || 0) >= 100000 
                ? `linear-gradient(135deg, ${COLORS.success}, #16a34a)`
                : COLORS.textMuted,
              color: COLORS.white,
              border: 'none',
              padding: '16px 35px',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: (partnerData?.availableBricks || 0) >= 100000 ? 'pointer' : 'not-allowed',
              opacity: (partnerData?.availableBricks || 0) >= 100000 ? 1 : 0.5,
              boxShadow: (partnerData?.availableBricks || 0) >= 100000 
                ? `0 8px 30px rgba(34, 197, 94, 0.4)` 
                : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            💸 출금 신청
          </button>
        </div>

        {/* 파트너 미션 메시지 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bgDark})`,
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '35px',
          border: `2px solid ${COLORS.gold}50`,
          textAlign: 'center',
          boxShadow: `0 10px 40px ${COLORS.gold}15`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            fontSize: '12rem',
            opacity: 0.05
          }}>✨</div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌟</div>
            <h2 style={{ 
              color: COLORS.gold, 
              fontSize: '1.8rem', 
              fontWeight: '800',
              marginBottom: '15px',
              textShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
            }}>
              We are the Messengers of Hope
            </h2>
            <p style={{ 
              color: COLORS.white, 
              fontSize: '1.2rem', 
              fontWeight: '600',
              marginBottom: '25px',
              lineHeight: '1.7'
            }}>
              우리는 희망을 전달하는 사람들입니다
            </p>
            
            <div style={{
              background: `${COLORS.bgDark}80`,
              borderRadius: '16px',
              padding: '25px 30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ 
                color: COLORS.textPrimary, 
                fontSize: '1.05rem', 
                lineHeight: '1.9',
                marginBottom: '18px'
              }}>
                인공지능 시대, 길을 잃지 않도록<br/>
                <strong style={{ color: COLORS.gold }}>꿈의 좌표</strong>를 제시합니다.
              </p>
              <p style={{ 
                color: COLORS.textSecondary, 
                fontSize: '1rem', 
                lineHeight: '1.9'
              }}>
                단순히 수익만을 추구하는 것이 아닙니다.<br/>
                양질의 인공지능 교육을 세상에 전달하고,<br/>
                너무나도 빠르게 변하는 세상 속에서<br/>
                사람들에게 <strong style={{ color: COLORS.brickLight }}>올바른 지식</strong>을 전파합니다.
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.brick}20)`,
              padding: '15px 25px',
              borderRadius: '50px',
              border: `1px solid ${COLORS.gold}40`
            }}>
              <span style={{ fontSize: '1.2rem' }}>💫</span>
              <span style={{ 
                color: COLORS.gold, 
                fontWeight: '700',
                fontSize: '1.05rem'
              }}>
                그래서 그들이 이 세상을 더 잘 살고, 꿈과 희망을 잃지 않도록 합니다
              </span>
            </div>
          </div>
        </div>

        {/* 통계 카드 4개 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '35px'
        }}>
          
          {/* 총 브릭 - 메인 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.brick}, #ea580c)`,
            borderRadius: '24px',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 10px 40px rgba(249, 115, 22, 0.3)`
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-20px',
              fontSize: '8rem',
              opacity: 0.2
            }}>🧱</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1rem', 
                fontWeight: '600',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                총 적립 브릭
              </div>
              <div style={{ 
                color: COLORS.white, 
                fontSize: '3rem', 
                fontWeight: '900',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                {totalBricks.toLocaleString()}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '1rem', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                = ₩{totalBricks.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 출금 가능 */}
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '24px',
            padding: '30px',
            border: `2px solid ${COLORS.success}40`,
            boxShadow: `0 0 30px ${COLORS.success}10`
          }}>
            <div style={{ 
              color: COLORS.textSecondary, 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              출금 가능
            </div>
            <div style={{ 
              color: COLORS.successLight, 
              fontSize: '2.8rem', 
              fontWeight: '900' 
            }}>
              {(partnerData?.availableBricks || 0).toLocaleString()}
            </div>
            <div style={{ 
              color: COLORS.textMuted, 
              fontSize: '0.9rem', 
              marginTop: '8px' 
            }}>
              최소 100,000 브릭
            </div>
          </div>

          {/* 정산 대기 */}
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '24px',
            padding: '30px',
            border: `2px solid ${COLORS.warning}40`,
            boxShadow: `0 0 30px ${COLORS.warning}10`
          }}>
            <div style={{ 
              color: COLORS.textSecondary, 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              정산 대기
            </div>
            <div style={{ 
              color: COLORS.warningLight, 
              fontSize: '2.8rem', 
              fontWeight: '900' 
            }}>
              {pendingBricks.toLocaleString()}
            </div>
            <div style={{ 
              color: COLORS.textMuted, 
              fontSize: '0.9rem', 
              marginTop: '8px' 
            }}>
              월말 정산
            </div>
          </div>

          {/* 총 추천 수 */}
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '24px',
            padding: '30px',
            border: `2px solid ${COLORS.gold}40`,
            boxShadow: `0 0 30px ${COLORS.gold}10`
          }}>
            <div style={{ 
              color: COLORS.textSecondary, 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              총 추천 수
            </div>
            <div style={{ 
              color: COLORS.goldLight, 
              fontSize: '2.8rem', 
              fontWeight: '900' 
            }}>
              {totalReferrals}명
            </div>
            <div style={{ 
              color: COLORS.textMuted, 
              fontSize: '0.9rem', 
              marginTop: '8px' 
            }}>
              감사합니다! 🎉
            </div>
          </div>
        </div>

        {/* 추천 링크 섹션 */}
        <div style={{
          background: COLORS.bgCard,
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '35px',
          border: `2px solid ${COLORS.gold}30`,
          boxShadow: `0 0 40px ${COLORS.gold}08`
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔗</span>
            <h3 style={{ 
              color: COLORS.gold, 
              fontSize: '1.4rem', 
              fontWeight: '700',
              margin: 0
            }}>
              나의 추천 링크
            </h3>
          </div>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '280px',
              background: COLORS.bgDark,
              padding: '18px 22px',
              borderRadius: '16px',
              color: COLORS.textPrimary,
              fontSize: '1rem',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              border: `1px solid ${COLORS.borderLight}`
            }}>
              {getReferralLink()}
            </div>
            <button
              onClick={copyReferralLink}
              style={{
                background: copied 
                  ? `linear-gradient(135deg, ${COLORS.success}, #16a34a)`
                  : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.brick})`,
                color: copied ? COLORS.white : COLORS.bgDark,
                border: 'none',
                padding: '18px 35px',
                borderRadius: '16px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: `0 6px 25px ${copied ? 'rgba(34, 197, 94, 0.4)' : 'rgba(251, 191, 36, 0.3)'}`
              }}
            >
              {copied ? '✅ 복사 완료!' : '📋 복사하기'}
            </button>
          </div>
          <p style={{ 
            color: COLORS.textSecondary, 
            fontSize: '0.95rem', 
            marginTop: '18px', 
            lineHeight: '1.6' 
          }}>
            💡 이 링크로 강의가 판매되면 <strong style={{ color: COLORS.brick }}>가격의 10%</strong>가 브릭으로 적립됩니다!
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'overview', label: '📊 개요', icon: '📊' },
            { key: 'referrals', label: '👥 추천 내역', icon: '👥' },
            { key: 'withdraw', label: '💳 출금 내역', icon: '💳' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: activeTab === tab.key 
                  ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.brick})`
                  : COLORS.bgCard,
                color: activeTab === tab.key ? COLORS.bgDark : COLORS.textSecondary,
                border: 'none',
                padding: '14px 28px',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.key 
                  ? `0 6px 25px rgba(251, 191, 36, 0.3)` 
                  : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div style={{
          background: COLORS.bgCard,
          borderRadius: '24px',
          padding: '35px',
          border: `1px solid ${COLORS.borderLight}`
        }}>
          
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ 
                color: COLORS.white, 
                fontSize: '1.5rem', 
                fontWeight: '700',
                marginBottom: '30px' 
              }}>
                📊 이번 달 파트너 활동
              </h3>
              
              {/* 이번 달 성과 */}
              <div style={{
                background: COLORS.bgDark,
                borderRadius: '20px',
                padding: '30px',
                border: `1px solid ${COLORS.borderLight}`
              }}>
                <div style={{ 
                  color: COLORS.gold, 
                  fontSize: '1.1rem', 
                  fontWeight: '600',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>📅</span>
                  <span>2025년 12월</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '25px'
                }}>
                  <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    background: COLORS.bgCard,
                    borderRadius: '16px'
                  }}>
                    <div style={{ 
                      color: COLORS.textSecondary, 
                      fontSize: '0.95rem', 
                      marginBottom: '10px',
                      fontWeight: '500'
                    }}>추천 수</div>
                    <div style={{ 
                      color: COLORS.white, 
                      fontSize: '2.2rem', 
                      fontWeight: '800' 
                    }}>{referralHistory.length}명</div>
                  </div>
                  <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    background: COLORS.bgCard,
                    borderRadius: '16px'
                  }}>
                    <div style={{ 
                      color: COLORS.textSecondary, 
                      fontSize: '0.95rem', 
                      marginBottom: '10px',
                      fontWeight: '500'
                    }}>적립 브릭</div>
                    <div style={{ 
                      color: COLORS.brickLight, 
                      fontSize: '2.2rem', 
                      fontWeight: '800' 
                    }}>{totalBricks.toLocaleString()}</div>
                  </div>
                  <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    background: COLORS.bgCard,
                    borderRadius: '16px'
                  }}>
                    <div style={{ 
                      color: COLORS.textSecondary, 
                      fontSize: '0.95rem', 
                      marginBottom: '10px',
                      fontWeight: '500'
                    }}>예상 수익</div>
                    <div style={{ 
                      color: COLORS.successLight, 
                      fontSize: '2.2rem', 
                      fontWeight: '800' 
                    }}>₩{totalBricks.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div>
              <h3 style={{ 
                color: COLORS.white, 
                fontSize: '1.5rem', 
                fontWeight: '700',
                marginBottom: '30px' 
              }}>
                👥 추천 내역
              </h3>
              
              {referralHistory.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>날짜</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>강의명</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'right', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>강의 가격</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'right', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>적립 브릭</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'center', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralHistory.map((record) => (
                        <tr key={record.rowKey} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                          <td style={{ 
                            color: COLORS.textPrimary, 
                            padding: '18px 15px',
                            fontSize: '0.95rem'
                          }}>{new Date(record.referralDate).toLocaleDateString()}</td>
                          <td style={{ 
                            color: COLORS.textPrimary, 
                            padding: '18px 15px',
                            fontSize: '0.95rem'
                          }}>{record.courseName}</td>
                          <td style={{ 
                            color: COLORS.textPrimary, 
                            padding: '18px 15px', 
                            textAlign: 'right',
                            fontSize: '0.95rem'
                          }}>₩{record.coursePrice.toLocaleString()}</td>
                          <td style={{ 
                            color: COLORS.brick, 
                            padding: '18px 15px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '1rem'
                          }}>+{record.earnedBricks.toLocaleString()}</td>
                          <td style={{ padding: '18px 15px', textAlign: 'center' }}>
                            <span style={{
                              background: record.status === 'confirmed' 
                                ? `${COLORS.success}25` 
                                : `${COLORS.warning}25`,
                              color: record.status === 'confirmed' 
                                ? COLORS.successLight 
                                : COLORS.warningLight,
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: '600'
                            }}>
                              {record.status === 'confirmed' ? '✅ 확정' : '⏳ 대기'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: COLORS.textMuted
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>👥</div>
                  <p style={{ fontSize: '1.1rem' }}>아직 추천 내역이 없어요</p>
                  <p style={{ fontSize: '0.95rem', marginTop: '10px' }}>
                    추천 링크를 공유하고 브릭을 적립해보세요!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              <h3 style={{ 
                color: COLORS.white, 
                fontSize: '1.5rem', 
                fontWeight: '700',
                marginBottom: '30px' 
              }}>
                💳 출금 내역
              </h3>
              
              {withdrawalHistory.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>신청일</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'right', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>출금 금액</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'left', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>은행</th>
                        <th style={{ 
                          color: COLORS.textSecondary, 
                          padding: '18px 15px', 
                          textAlign: 'center', 
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalHistory.map((record) => (
                        <tr key={record.rowKey} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                          <td style={{ 
                            color: COLORS.textPrimary, 
                            padding: '18px 15px',
                            fontSize: '0.95rem'
                          }}>{new Date(record.requestDate).toLocaleDateString()}</td>
                          <td style={{ 
                            color: COLORS.successLight, 
                            padding: '18px 15px', 
                            textAlign: 'right', 
                            fontWeight: '700',
                            fontSize: '1rem'
                          }}>₩{record.amount.toLocaleString()}</td>
                          <td style={{ 
                            color: COLORS.textPrimary, 
                            padding: '18px 15px',
                            fontSize: '0.95rem'
                          }}>{record.bankName}</td>
                          <td style={{ padding: '18px 15px', textAlign: 'center' }}>
                            <span style={{
                              background: record.status === 'completed' 
                                ? `${COLORS.success}25` 
                                : record.status === 'rejected'
                                ? 'rgba(239, 68, 68, 0.25)'
                                : `${COLORS.warning}25`,
                              color: record.status === 'completed' 
                                ? COLORS.successLight 
                                : record.status === 'rejected'
                                ? '#f87171'
                                : COLORS.warningLight,
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: '600'
                            }}>
                              {record.status === 'completed' ? '✅ 완료' : 
                               record.status === 'rejected' ? '❌ 거절' : '⏳ 처리중'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: COLORS.textMuted
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>💳</div>
                  <p style={{ fontSize: '1.1rem' }}>아직 출금 내역이 없어요</p>
                  <p style={{ fontSize: '0.95rem', marginTop: '10px' }}>
                    100,000 브릭 이상 모으면 출금할 수 있어요!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 출금 모달 */}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: COLORS.bgCard,
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            border: `2px solid ${COLORS.gold}30`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5)`
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                💸 브릭 출금 신청
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: COLORS.textMuted,
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ color: COLORS.textSecondary }}>출금 가능:</span>
                <span style={{ 
                  color: COLORS.successLight, 
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  {(partnerData?.availableBricks || 0).toLocaleString()} 브릭
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                color: COLORS.textSecondary, 
                display: 'block', 
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                출금 금액 (브릭)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="최소 100,000"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.borderLight}`,
                  background: COLORS.bgDark,
                  color: COLORS.white,
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                color: COLORS.textSecondary, 
                display: 'block', 
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                은행명
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="예: 카카오뱅크"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.borderLight}`,
                  background: COLORS.bgDark,
                  color: COLORS.white,
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                color: COLORS.textSecondary, 
                display: 'block', 
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                계좌번호
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="- 없이 입력"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.borderLight}`,
                  background: COLORS.bgDark,
                  color: COLORS.white,
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                color: COLORS.textSecondary, 
                display: 'block', 
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                예금주
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="예금주명"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.borderLight}`,
                  background: COLORS.bgDark,
                  color: COLORS.white,
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.textMuted}`,
                  background: 'transparent',
                  color: COLORS.textSecondary,
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                취소
              </button>
              <button
                onClick={handleWithdrawSubmit}
                style={{
                  flex: 2,
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${COLORS.success}, #16a34a)`,
                  color: COLORS.white,
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: `0 6px 25px rgba(34, 197, 94, 0.4)`,
                  transition: 'all 0.3s ease'
                }}
              >
                출금 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboardPage;
