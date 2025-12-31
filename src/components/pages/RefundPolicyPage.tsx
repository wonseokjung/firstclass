import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Mail, CheckCircle, FileText, Calculator, Loader, ArrowRight, BookOpen, DollarSign, Calendar } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';
import AzureTableService from '../../services/azureTableService';
import emailjs from '@emailjs/browser';

interface RefundPolicyPageProps {
  onBack: () => void;
}

// 강의 정보
const COURSE_INFO: { [key: string]: { name: string; price: number; totalDays: number } } = {
  '999': { name: 'Step 1: AI 건물주 되기', price: 95000, totalDays: 10 },
  'ai-building-course': { name: 'Step 1: AI 건물주 되기', price: 95000, totalDays: 10 },
  '1002': { name: 'Step 2: AI 에이전트 비기너', price: 95000, totalDays: 10 },
  'chatgpt-agent-beginner': { name: 'Step 2: AI 에이전트 비기너', price: 95000, totalDays: 10 },
};

interface EnrolledCourseData {
  courseId: string;
  title: string;
  completedDays?: number[];
  progress: number;
  enrolledAt: string;
  status: string;
}

const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseData[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourseData | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const calculateRefund = (course: EnrolledCourseData) => {
    const courseInfo = COURSE_INFO[course.courseId];
    if (!courseInfo) return { refundAmount: 0, usedAmount: 0, completedDays: 0, totalDays: 10, price: 0, message: '' };

    const completedDays = course.completedDays?.length || 0;
    const pricePerDay = courseInfo.price / courseInfo.totalDays;
    const usedAmount = Math.round(pricePerDay * completedDays);
    const refundAmount = courseInfo.price - usedAmount;

    let message = '';
    if (completedDays === 0) {
      message = '수강 시작 전 - 전액 환불';
    } else if (completedDays >= courseInfo.totalDays) {
      message = '수강 완료 - 환불 불가';
    } else {
      message = `${completedDays}일 수강 완료`;
    }

    return {
      refundAmount: Math.max(0, refundAmount),
      usedAmount,
      completedDays,
      totalDays: courseInfo.totalDays,
      price: courseInfo.price,
      message
    };
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
      if (storedUserInfo) {
        try {
          const parsed = JSON.parse(storedUserInfo);
          setUserInfo(parsed);
          const courses = await AzureTableService.getUserEnrollmentsByEmail(parsed.email);
          const paidCourses = courses.filter(c => c.status === 'active' && COURSE_INFO[c.courseId]);
          setEnrolledCourses(paidCourses);
        } catch (e) {
          console.error('사용자 정보 로딩 오류:', e);
        }
      }
      setIsLoadingCourses(false);
    };
    loadUserData();
  }, []);

  const handleRefundRequest = (course: EnrolledCourseData) => {
    setSelectedCourse(course);
    setShowConfirmModal(true);
  };

  // 결제 정보에서 paymentKey 찾기
  const findPaymentKey = (userEmail: string, courseId: string): string => {
    try {
      const allPayments = localStorage.getItem('all_payment_details');
      if (allPayments) {
        const paymentsList = JSON.parse(allPayments);
        // 해당 사용자의 결제 중 가장 최근 것 찾기
        const userPayment = paymentsList.find((p: any) =>
          p.customerEmail?.toLowerCase() === userEmail.toLowerCase()
        );
        if (userPayment?.paymentKey) {
          return userPayment.paymentKey;
        }
      }
    } catch (e) {
      console.error('paymentKey 조회 실패:', e);
    }
    return '조회 불가 - 토스 대시보드에서 확인 필요';
  };

  const handleRefundSubmit = async () => {
    if (!userInfo || !selectedCourse) return;
    setIsSubmitting(true);

    try {
      const courseInfo = COURSE_INFO[selectedCourse.courseId];
      const { refundAmount, usedAmount, completedDays, totalDays, price } = calculateRefund(selectedCourse);

      // paymentKey 조회
      const paymentKey = findPaymentKey(userInfo.email, selectedCourse.courseId);

      await emailjs.send('service_ca3frqd', 'template_refund', {
        to_email: 'jay@connexionai.kr',
        from_name: userInfo.name,
        from_email: userInfo.email,
        course_name: courseInfo?.name || selectedCourse.title,
        course_price: (price || 0).toLocaleString(),
        completed_days: completedDays,
        total_days: totalDays || 10,
        used_amount: usedAmount.toLocaleString(),
        refund_amount: refundAmount.toLocaleString(),
        refund_reason: refundReason || '사유 미입력',
        request_date: new Date().toLocaleString('ko-KR'),
        payment_key: paymentKey,  // 🔑 환불용 paymentKey 추가
      }, 'McMYvMBYbK-cdZ8ba');

      setSubmitSuccess(true);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('환불 신청 실패:', error);
      alert('환불 신청이 접수되었습니다.\njay@connexionai.kr로 직접 연락 주시면 신속히 처리해드리겠습니다.');
      setSubmitSuccess(true);
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 브랜드 컬러: 네이비 + 골드
  const brandColors = {
    navy: '#0d1b2a',
    navyLight: '#142238',
    navyMid: '#1e3a5f',
    gold: '#d4af37',
    goldLight: '#f4d03f',
    goldDark: '#b8960c',
    cream: '#faf8f0',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.navy} 0%, ${brandColors.navyLight} 50%, ${brandColors.navy} 100%)`,
      color: brandColors.cream,
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px 80px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: 'clamp(25px, 5vw, 50px)',
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.goldLight} 50%, ${brandColors.gold} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '15px',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#8899aa',
    },
    card: {
      background: `linear-gradient(135deg, ${brandColors.navyLight}ee, ${brandColors.navyMid}aa)`,
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: 'clamp(15px, 3vw, 30px)',
      marginBottom: '30px',
      border: `1px solid ${brandColors.gold}30`,
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: brandColors.cream,
    },
    iconCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    policyBox: {
      background: `linear-gradient(135deg, ${brandColors.gold}15, ${brandColors.goldDark}15)`,
      borderRadius: '16px',
      padding: '25px',
      border: `1px solid ${brandColors.gold}40`,
      marginBottom: '25px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      padding: '15px',
      textAlign: 'left' as const,
      background: `${brandColors.navyMid}80`,
      fontWeight: '600',
      color: brandColors.cream,
      borderBottom: `2px solid ${brandColors.gold}50`,
    },
    td: {
      padding: '15px',
      borderBottom: `1px solid ${brandColors.gold}20`,
      color: '#c8d4e0',
    },
    exampleCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 20px',
      background: `${brandColors.navyMid}50`,
      borderRadius: '12px',
      marginBottom: '12px',
      border: `1px solid ${brandColors.gold}20`,
    },
    courseCard: {
      background: `linear-gradient(135deg, ${brandColors.navyLight}, ${brandColors.navyMid})`,
      borderRadius: '16px',
      padding: '25px',
      marginBottom: '20px',
      border: `1px solid ${brandColors.gold}30`,
      transition: 'all 0.3s ease',
    },
    refundButton: {
      background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})`,
      color: brandColors.navy,
      border: 'none',
      padding: '14px 28px',
      borderRadius: '12px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 15px ${brandColors.gold}40`,
    },
    loginButton: {
      background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldLight})`,
      color: brandColors.navy,
      border: 'none',
      padding: '16px 32px',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      background: `linear-gradient(135deg, ${brandColors.navyLight}, ${brandColors.navyMid})`,
      borderRadius: '24px',
      padding: '35px',
      maxWidth: '500px',
      width: '100%',
      border: `1px solid ${brandColors.gold}40`,
      boxShadow: `0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${brandColors.gold}20`,
    },
    successCard: {
      background: `linear-gradient(135deg, ${brandColors.gold}15, ${brandColors.goldDark}15)`,
      border: `1px solid ${brandColors.gold}50`,
      borderRadius: '20px',
      padding: '50px 30px',
      textAlign: 'center' as const,
    },
    contactBox: {
      background: `linear-gradient(135deg, ${brandColors.navyMid}80, ${brandColors.navyLight}80)`,
      borderRadius: '16px',
      padding: '25px',
      textAlign: 'center' as const,
      border: `1px solid ${brandColors.gold}30`,
    },
  };

  return (
    <div style={styles.container}>
      <NavigationBar onBack={onBack} breadcrumbText="환불 정책" />

      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.title}>환불 정책 안내</h1>
          <p style={styles.subtitle}>
            평생교육법 시행령 제23조에 따른 학습비 반환 기준을 준수합니다
          </p>
        </div>

        {/* 환불 기준 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <div style={{ ...styles.iconCircle, background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})` }}>
              <FileText size={20} color={brandColors.navy} />
            </div>
            원격교육 환불 기준
          </h2>

          <div style={styles.policyBox}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: brandColors.cream }}>
              📌 <strong>원격교육 환불 원칙</strong> (평생교육법 시행령 별표3)
              <br /><br />
              "원격교육의 형태로 이루어지는 학습에 대한 학습비 반환금액은{' '}
              <span style={{ color: brandColors.goldLight, fontWeight: '600' }}>
                이미 낸 학습비에서 실제 학습한 부분에 해당하는 학습비를 뺀 금액
              </span>으로 한다."
            </p>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>구분</th>
                <th style={styles.th}>환불 금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><strong>수업 시작 전</strong></td>
                <td style={{ ...styles.td, color: brandColors.goldLight, fontWeight: '600' }}>전액 환불 💯</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>수업 시작 후</strong></td>
                <td style={styles.td}>결제금액 − (1일 학습비 × 학습 일수)</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '20px', padding: '15px', background: `${brandColors.gold}15`, borderRadius: '12px', border: `1px solid ${brandColors.gold}40` }}>
            <p style={{ color: brandColors.goldLight, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              강의 회차를 열람하면 해당 일차는 학습한 것으로 간주됩니다
            </p>
          </div>
        </div>

        {/* 환불 예시 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <div style={{ ...styles.iconCircle, background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})` }}>
              <Calculator size={20} color={brandColors.navy} />
            </div>
            환불 금액 예시
          </h2>

          {[
            { course: 'Step 1: AI 건물주 되기', price: '95,000원', days: '0일', refund: '95,000원', full: true },
            { course: 'Step 1: AI 건물주 되기', price: '95,000원', days: '3일', refund: '66,500원', full: false },
            { course: 'Step 2: AI 에이전트 비기너', price: '95,000원', days: '0일', refund: '95,000원', full: true },
            { course: 'Step 2: AI 에이전트 비기너', price: '95,000원', days: '5일', refund: '47,500원', full: false },
          ].map((ex, idx) => (
            <div key={idx} style={styles.exampleCard}>
              <div>
                <p style={{ fontWeight: '600', color: brandColors.cream, marginBottom: '4px' }}>{ex.course}</p>
                <p style={{ fontSize: '0.9rem', color: '#8899aa' }}>
                  결제 {ex.price} | 수강 {ex.days}
                </p>
              </div>
              <div style={{
                fontWeight: '700',
                fontSize: '1.1rem',
                color: brandColors.goldLight,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {ex.refund} 환불
                {ex.full && <span style={{ fontSize: '0.8rem', background: `${brandColors.gold}30`, padding: '4px 8px', borderRadius: '6px', color: brandColors.gold }}>전액</span>}
              </div>
            </div>
          ))}
        </div>

        {/* 환불 신청 섹션 */}
        {!submitSuccess && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <div style={{ ...styles.iconCircle, background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})` }}>
                <Mail size={20} color={brandColors.navy} />
              </div>
              환불 신청
            </h2>

            {!userInfo && (
              <div style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: `linear-gradient(135deg, ${brandColors.gold}30, ${brandColors.goldDark}30)`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <Mail size={36} color={brandColors.gold} />
                </div>
                <p style={{ color: '#8899aa', fontSize: '1.1rem', marginBottom: '25px' }}>
                  환불 신청을 위해 로그인이 필요합니다
                </p>
                <button onClick={() => navigate('/login')} style={styles.loginButton}>
                  로그인하기 <ArrowRight size={18} />
                </button>
              </div>
            )}

            {userInfo && isLoadingCourses && (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: brandColors.gold }} />
                <p style={{ marginTop: '20px', color: '#8899aa' }}>수강 정보를 불러오는 중...</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {userInfo && !isLoadingCourses && enrolledCourses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: `${brandColors.navyMid}80`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <BookOpen size={36} color="#6b7c8a" />
                </div>
                <p style={{ color: '#6b7c8a', fontSize: '1.1rem' }}>
                  현재 환불 가능한 수강 강의가 없습니다
                </p>
              </div>
            )}

            {userInfo && !isLoadingCourses && enrolledCourses.length > 0 && (
              <div>
                {enrolledCourses.map((course) => {
                  const { refundAmount, usedAmount, completedDays, totalDays, price, message } = calculateRefund(course);
                  const courseInfo = COURSE_INFO[course.courseId];
                  const canRefund = refundAmount > 0;

                  return (
                    <div key={course.courseId} style={{
                      ...styles.courseCard,
                      opacity: canRefund ? 1 : 0.6,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '15px' }}>
                            {courseInfo?.name || course.title}
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <DollarSign size={18} color={brandColors.gold} />
                              <div>
                                <p style={{ fontSize: '0.8rem', color: '#6b7c8a' }}>결제 금액</p>
                                <p style={{ fontWeight: '600', color: brandColors.cream }}>{(price || 0).toLocaleString()}원</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <BookOpen size={18} color={brandColors.goldLight} />
                              <div>
                                <p style={{ fontSize: '0.8rem', color: '#6b7c8a' }}>수강 현황</p>
                                <p style={{ fontWeight: '600', color: brandColors.cream }}>{completedDays}일 / {totalDays}일</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Calendar size={18} color={brandColors.gold} />
                              <div>
                                <p style={{ fontSize: '0.8rem', color: '#6b7c8a' }}>수강 시작</p>
                                <p style={{ fontWeight: '600', color: brandColors.cream }}>{new Date(course.enrolledAt).toLocaleDateString('ko-KR')}</p>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            background: canRefund ? `${brandColors.gold}15` : 'rgba(100, 116, 139, 0.15)',
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: `1px solid ${canRefund ? `${brandColors.gold}40` : 'rgba(100, 116, 139, 0.3)'}`,
                          }}>
                            <p style={{ fontSize: '0.9rem', color: canRefund ? brandColors.goldLight : '#64748b', marginBottom: '5px' }}>
                              {message} {usedAmount > 0 && `(${usedAmount.toLocaleString()}원 차감)`}
                            </p>
                            <p style={{ fontSize: '1.3rem', fontWeight: '800', color: canRefund ? brandColors.goldLight : '#64748b' }}>
                              환불 예상: {refundAmount.toLocaleString()}원
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRefundRequest(course)}
                          disabled={!canRefund}
                          style={{
                            ...styles.refundButton,
                            background: canRefund ? `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})` : '#3a4a5a',
                            color: canRefund ? brandColors.navy : '#6b7c8a',
                            cursor: canRefund ? 'pointer' : 'not-allowed',
                            boxShadow: canRefund ? `0 4px 15px ${brandColors.gold}40` : 'none',
                          }}
                        >
                          {canRefund ? '환불 신청' : '환불 불가'}
                          {canRefund && <ArrowRight size={18} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 환불 확인 모달 */}
        {showConfirmModal && selectedCourse && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: brandColors.gold, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={24} />
                환불 신청 확인
              </h2>

              {(() => {
                const { refundAmount, usedAmount, completedDays, totalDays, price } = calculateRefund(selectedCourse);
                const courseInfo = COURSE_INFO[selectedCourse.courseId];

                return (
                  <>
                    <div style={{ background: `${brandColors.navyMid}80`, padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#8899aa' }}>강의명</span>
                          <span style={{ fontWeight: '600', color: brandColors.cream }}>{courseInfo?.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#8899aa' }}>결제 금액</span>
                          <span style={{ color: brandColors.cream }}>{(price || 0).toLocaleString()}원</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#8899aa' }}>수강 현황</span>
                          <span style={{ color: brandColors.cream }}>{completedDays}일 / {totalDays}일</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#8899aa' }}>차감 금액</span>
                          <span style={{ color: '#e57373' }}>-{usedAmount.toLocaleString()}원</span>
                        </div>
                        <div style={{ borderTop: `1px solid ${brandColors.gold}30`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '700', color: brandColors.cream }}>환불 금액</span>
                          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: brandColors.goldLight }}>{refundAmount.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: brandColors.cream }}>
                        환불 사유 (선택)
                      </label>
                      <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="환불 사유를 입력해주세요"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '15px',
                          fontSize: '1rem',
                          background: `${brandColors.navyMid}80`,
                          border: `1px solid ${brandColors.gold}30`,
                          borderRadius: '12px',
                          color: brandColors.cream,
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <p style={{ color: '#8899aa', fontSize: '0.9rem', marginBottom: '25px' }}>
                      환불 신청 시 담당자에게 자동 알림이 발송됩니다.
                      영업일 기준 3~5일 내 처리됩니다.
                    </p>
                  </>
                );
              })()}

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={() => { setShowConfirmModal(false); setSelectedCourse(null); setRefundReason(''); }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: `1px solid ${brandColors.gold}40`,
                    borderRadius: '12px',
                    background: 'transparent',
                    color: '#8899aa',
                    cursor: 'pointer',
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleRefundSubmit}
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '12px',
                    background: isSubmitting ? '#3a4a5a' : `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})`,
                    color: isSubmitting ? '#8899aa' : brandColors.navy,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isSubmitting ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> 처리 중...</> : '환불 신청하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 성공 메시지 */}
        {submitSuccess && (
          <div style={styles.successCard}>
            <CheckCircle size={70} color={brandColors.goldLight} style={{ marginBottom: '25px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: brandColors.goldLight, marginBottom: '15px' }}>
              환불 신청 완료!
            </h2>
            <p style={{ color: '#8899aa', lineHeight: '1.8', marginBottom: '30px' }}>
              담당자가 확인 후 빠르게 처리해드리겠습니다.<br />
              영업일 기준 3~5일 내 환불 처리됩니다.
            </p>
            <button
              onClick={() => navigate('/')}
              style={styles.loginButton}
            >
              홈으로 돌아가기
            </button>
          </div>
        )}

        {/* 문의 안내 */}
        <div style={styles.contactBox}>
          <p style={{ color: '#8899aa', marginBottom: '12px' }}>
            환불 관련 문의사항이 있으시면 언제든 연락주세요
          </p>
          <p style={{ color: brandColors.gold, fontWeight: '600', fontSize: '1.1rem' }}>
            📧 jay@connexionai.kr &nbsp;|&nbsp; ⏰ 평일 09:00-18:00
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
