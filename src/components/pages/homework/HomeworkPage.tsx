import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Gift, Users, ChevronRight, X, Upload, Link as LinkIcon, MessageSquare, Trophy, Flame } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

const COLORS = {
    navy: '#1e3a5f',
    navyLight: '#2d4a6f',
    navyDark: '#0f2847',
    gold: '#f0b429',
    goldLight: '#fcd34d',
    white: '#ffffff',
    green: '#22c55e',
    purple: '#8b5cf6',
    orange: '#f97316'
};

// 강의별 설정
const STEPS = [
    { id: 'all', name: '전체', icon: '📚', color: COLORS.gold },
    { id: 'step1', name: 'Step 1: AI 건물주', icon: '🏠', color: '#3b82f6' },
    { id: 'step2', name: 'Step 2: AI 에이전트', icon: '🤖', color: '#22c55e' },
    { id: 'step3', name: 'Step 3: 바이브코딩', icon: '💻', color: COLORS.purple },
];

interface Homework {
    id: string;
    stepId: string;
    stepName: string;
    week: number;
    title: string;
    description: string;
    deadline: string;
    reward: number;
    completedBy: { name: string; completedAt: string }[];
    isCompleted?: boolean;
    mySubmission?: {
        link?: string;
        comment?: string;
        submittedAt: string;
    };
}

const HomeworkPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [totalBricks, setTotalBricks] = useState(0);
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
    const [submitLink, setSubmitLink] = useState('');
    const [submitComment, setSubmitComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [earnedBricks, setEarnedBricks] = useState(0);
    const [streakBonus, setStreakBonus] = useState(0);
    const [selectedStep, setSelectedStep] = useState('all');

    // 샘플 데이터 (나중에 Azure에서 가져오기)
    const sampleHomeworks: Homework[] = [
        {
            id: 'hw-step1-w3',
            stepId: 'step1',
            stepName: 'Step 1: AI 건물주 되기',
            week: 3,
            title: 'AI 유튜브 썸네일 3개 만들기',
            description: 'Canva, Leonardo AI, 또는 다른 AI 도구를 사용해서 유튜브 썸네일 3개를 만들어주세요. 완성된 썸네일 링크나 스크린샷을 공유해주세요!',
            deadline: '2026-01-14T20:00:00',
            reward: 15,
            completedBy: [
                { name: '김민수', completedAt: '2026-01-09T10:30:00' },
                { name: '이영희', completedAt: '2026-01-09T09:15:00' },
                { name: '박철수', completedAt: '2026-01-08T22:45:00' },
                { name: '최지우', completedAt: '2026-01-08T21:30:00' },
                { name: '정다은', completedAt: '2026-01-08T20:15:00' },
            ]
        },
        {
            id: 'hw-step2-w2',
            stepId: 'step2',
            stepName: 'Step 2: AI 에이전트 비기너',
            week: 2,
            title: 'Google OPAL로 에이전트 만들기',
            description: 'Google OPAL에서 간단한 에이전트를 만들어보세요. 완성된 에이전트 스크린샷을 공유해주세요!',
            deadline: '2026-01-15T20:00:00',
            reward: 15,
            completedBy: [
                { name: '송민호', completedAt: '2026-01-09T08:00:00' },
                { name: '강수진', completedAt: '2026-01-08T19:30:00' },
            ]
        },
        {
            id: 'hw-step1-w2',
            stepId: 'step1',
            stepName: 'Step 1: AI 건물주 되기',
            week: 2,
            title: 'ChatGPT로 유튜브 대본 작성하기',
            description: 'ChatGPT를 활용해서 5분 분량의 유튜브 대본을 작성해보세요.',
            deadline: '2026-01-07T20:00:00',
            reward: 10,
            completedBy: [
                { name: '김민수', completedAt: '2026-01-06T15:00:00' },
                { name: '이영희', completedAt: '2026-01-06T14:30:00' },
                { name: '박철수', completedAt: '2026-01-05T20:00:00' },
            ],
            isCompleted: true,
            mySubmission: {
                link: 'https://chatgpt.com/share/abc123',
                comment: 'ChatGPT로 처음 대본 써봤는데 생각보다 잘 나왔어요!',
                submittedAt: '2026-01-06T18:00:00'
            }
        },
        {
            id: 'hw-step3-w1',
            stepId: 'step3',
            stepName: 'Step 3: 바이브코딩',
            week: 1,
            title: 'Antigravity로 간단한 웹페이지 만들기',
            description: 'Antigravity를 사용해서 간단한 자기소개 웹페이지를 만들어보세요. 완성된 결과물 스크린샷이나 링크를 공유해주세요!',
            deadline: '2026-01-16T20:00:00',
            reward: 15,
            completedBy: [
                { name: '한소희', completedAt: '2026-01-09T11:00:00' },
                { name: '조현아', completedAt: '2026-01-09T10:30:00' },
            ]
        }
    ];

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userSession = sessionStorage.getItem('aicitybuilders_user_session');
                if (userSession) {
                    const user = JSON.parse(userSession);
                    setIsLoggedIn(true);
                    setUserName(user.name || user.email.split('@')[0]);
                    setUserEmail(user.email);

                    // 브릭 수 가져오기 (실제로는 Azure에서)
                    setTotalBricks(120);
                }

                // 숙제 목록 로드 (실제로는 Azure에서)
                setHomeworks(sampleHomeworks);
                setIsLoading(false);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    const getTimeRemaining = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0) return '마감됨';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}일 ${hours}시간 남음`;
        return `${hours}시간 남음`;
    };

    const getRecentCompletions = (completedBy: { name: string; completedAt: string }[]) => {
        const now = new Date();
        return completedBy.slice(0, 5).map(c => {
            const completedDate = new Date(c.completedAt);
            const diffMin = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60));

            let timeAgo;
            if (diffMin < 1) timeAgo = '방금';
            else if (diffMin < 60) timeAgo = `${diffMin}분 전`;
            else if (diffMin < 1440) timeAgo = `${Math.floor(diffMin / 60)}시간 전`;
            else timeAgo = `${Math.floor(diffMin / 1440)}일 전`;

            return { ...c, timeAgo };
        });
    };

    const handleOpenSubmitModal = (homework: Homework) => {
        setSelectedHomework(homework);
        setSubmitLink('');
        setSubmitComment('');
        setShowSubmitModal(true);
    };

    const handleSubmit = async () => {
        if (!selectedHomework) return;

        setIsSubmitting(true);

        try {
            // TODO: Azure에 숙제 제출 저장
            await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션

            // 브릭 적립
            const baseReward = selectedHomework.reward;
            const streak = 3; // TODO: 실제 연속 완료 횟수 계산
            const bonus = streak >= 3 ? 5 : 0;

            setEarnedBricks(baseReward);
            setStreakBonus(bonus);

            // 숙제 완료 상태 업데이트
            setHomeworks(prev => prev.map(hw =>
                hw.id === selectedHomework.id
                    ? {
                        ...hw,
                        isCompleted: true,
                        mySubmission: {
                            link: submitLink,
                            comment: submitComment,
                            submittedAt: new Date().toISOString()
                        },
                        completedBy: [
                            { name: userName, completedAt: new Date().toISOString() },
                            ...hw.completedBy
                        ]
                    }
                    : hw
            ));

            setShowSubmitModal(false);
            setShowSuccessModal(true);

        } catch (error) {
            console.error('제출 실패:', error);
            alert('제출에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 강의별로 필터링
    const filteredHomeworks = selectedStep === 'all'
        ? homeworks
        : homeworks.filter(hw => hw.stepId === selectedStep);

    const activeHomeworks = filteredHomeworks.filter(hw => !hw.isCompleted && new Date(hw.deadline) > new Date());
    const completedHomeworks = filteredHomeworks.filter(hw => hw.isCompleted);

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
                    <p style={{ color: 'white' }}>숙제 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
            <NavigationBar />

            {/* 헤더 */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f2847)',
                padding: 'clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px)',
                borderBottom: '2px solid rgba(240, 180, 41, 0.3)'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h1 style={{
                                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                fontWeight: '800',
                                color: 'white',
                                marginBottom: '10px'
                            }}>
                                📚 나의 숙제
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                                숙제를 완료하고 🧱 브릭을 모으세요!
                            </p>
                        </div>

                        {/* 브릭 현황 */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f0b429, #d97706)',
                            padding: '15px 25px',
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>🧱</span>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>내 브릭</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1b263b' }}>{totalBricks}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px)' }}>

                {/* 강의별 탭 */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    overflowX: 'auto',
                    paddingBottom: '5px'
                }}>
                    {STEPS.map(step => (
                        <button
                            key={step.id}
                            onClick={() => setSelectedStep(step.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                borderRadius: '12px',
                                border: selectedStep === step.id
                                    ? `2px solid ${step.color}`
                                    : '2px solid rgba(255,255,255,0.2)',
                                background: selectedStep === step.id
                                    ? `${step.color}20`
                                    : 'rgba(255,255,255,0.05)',
                                color: selectedStep === step.id ? step.color : 'rgba(255,255,255,0.7)',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span>{step.icon}</span>
                            {step.name}
                            {step.id !== 'all' && (
                                <span style={{
                                    background: selectedStep === step.id ? step.color : 'rgba(255,255,255,0.2)',
                                    color: selectedStep === step.id ? 'white' : 'rgba(255,255,255,0.6)',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700'
                                }}>
                                    {homeworks.filter(hw => hw.stepId === step.id && !hw.isCompleted && new Date(hw.deadline) > new Date()).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* 진행 중인 숙제 */}
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{
                        color: COLORS.gold,
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <Clock size={24} />
                        진행 중인 숙제 ({activeHomeworks.length})
                    </h2>

                    {activeHomeworks.length === 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '15px',
                            padding: '40px',
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.6)'
                        }}>
                            현재 진행 중인 숙제가 없습니다 🎉
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {activeHomeworks.map(homework => (
                                <div
                                    key={homework.id}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(15, 40, 71, 0.8))',
                                        borderRadius: '20px',
                                        border: '2px solid rgba(240, 180, 41, 0.4)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* 헤더 */}
                                    <div style={{
                                        background: 'rgba(240, 180, 41, 0.15)',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        <div>
                                            <span style={{
                                                background: COLORS.gold,
                                                color: '#1b263b',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700'
                                            }}>
                                                Week {homework.week}
                                            </span>
                                            <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '12px', fontSize: '0.9rem' }}>
                                                {homework.stepName}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={16} />
                                                {getTimeRemaining(homework.deadline)}
                                            </span>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                🧱 +{homework.reward}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 내용 */}
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>
                                            {homework.title}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '20px' }}>
                                            {homework.description}
                                        </p>

                                        {/* 완료한 멤버 */}
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            padding: '15px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{ color: '#22c55e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <CheckCircle size={18} />
                                                    완료한 멤버 ({homework.completedBy.length}명)
                                                </span>
                                            </div>

                                            {/* 최근 완료 피드 */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {getRecentCompletions(homework.completedBy).map((c, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        <span style={{ color: COLORS.gold }}>👤 {c.name}</span>
                                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                            {idx === 0 ? '🎉 ' : ''}{c.timeAgo} 완료
                                                        </span>
                                                    </div>
                                                ))}
                                                {homework.completedBy.length > 5 && (
                                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                                        +{homework.completedBy.length - 5}명 더
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 제출 버튼 */}
                                        <button
                                            onClick={() => handleOpenSubmitModal(homework)}
                                            style={{
                                                width: '100%',
                                                marginTop: '20px',
                                                padding: '15px',
                                                background: 'linear-gradient(135deg, #f0b429, #d97706)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#1b263b',
                                                fontSize: '1.1rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            🎯 나도 숙제 제출하기!
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 완료한 숙제 */}
                {completedHomeworks.length > 0 && (
                    <section>
                        <h2 style={{
                            color: '#22c55e',
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <CheckCircle size={24} />
                            완료한 숙제 ({completedHomeworks.length})
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {completedHomeworks.map(homework => (
                                <div
                                    key={homework.id}
                                    style={{
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        borderRadius: '15px',
                                        border: '2px solid rgba(34, 197, 94, 0.3)',
                                        padding: '20px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <span style={{
                                                background: '#22c55e',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                marginRight: '10px'
                                            }}>
                                                ✓ 완료
                                            </span>
                                            <span style={{ color: 'white', fontWeight: '600' }}>
                                                Week {homework.week}: {homework.title}
                                            </span>
                                        </div>
                                        <span style={{ color: COLORS.gold, fontWeight: '700' }}>
                                            🧱 +{homework.reward} 적립됨
                                        </span>
                                    </div>

                                    {homework.mySubmission && (
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                                💬 "{homework.mySubmission.comment}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* 제출 모달 */}
            {showSubmitModal && selectedHomework && (
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
                        background: 'linear-gradient(135deg, #1e3a5f, #0f2847)',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        border: '2px solid rgba(240, 180, 41, 0.4)'
                    }}>
                        {/* 모달 헤더 */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>
                                📤 숙제 제출
                            </h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* 모달 내용 */}
                        <div style={{ padding: '20px' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ color: COLORS.gold, fontWeight: '700', marginBottom: '5px' }}>
                                    Week {selectedHomework.week}
                                </div>
                                <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
                                    {selectedHomework.title}
                                </div>
                            </div>

                            {/* 링크 입력 */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <LinkIcon size={18} />
                                    결과물 링크 (선택)
                                </label>
                                <input
                                    type="url"
                                    value={submitLink}
                                    onChange={(e) => setSubmitLink(e.target.value)}
                                    placeholder="https://..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '10px',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {/* 한 줄 소감 */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <MessageSquare size={18} />
                                    한 줄 소감 (선택)
                                </label>
                                <textarea
                                    value={submitComment}
                                    onChange={(e) => setSubmitComment(e.target.value)}
                                    placeholder="숙제하면서 느낀 점을 공유해주세요!"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        borderRadius: '10px',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                />
                            </div>

                            {/* 보상 안내 */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '20px',
                                border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}>
                                <div style={{ color: '#22c55e', fontWeight: '700', marginBottom: '5px' }}>
                                    🎁 제출 시 받는 보상
                                </div>
                                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🧱 +{selectedHomework.reward} 브릭</span>
                                </div>
                            </div>

                            {/* 제출 버튼 */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: isSubmitting
                                        ? 'rgba(255,255,255,0.3)'
                                        : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isSubmitting ? '제출 중...' : '🎉 숙제 제출 완료!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 성공 모달 */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #0f2847)',
                        borderRadius: '25px',
                        maxWidth: '400px',
                        width: '100%',
                        padding: '40px',
                        textAlign: 'center',
                        border: '3px solid #22c55e'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎊</div>
                        <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
                            축하합니다!
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '25px' }}>
                            숙제를 완료했습니다!
                        </p>

                        <div style={{
                            background: 'linear-gradient(135deg, #f0b429, #d97706)',
                            borderRadius: '15px',
                            padding: '20px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ color: '#1b263b', fontSize: '2rem', fontWeight: '800' }}>
                                🧱 +{earnedBricks}
                            </div>
                            <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>
                                브릭 적립!
                            </div>
                        </div>

                        {streakBonus > 0 && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '20px',
                                border: '2px solid rgba(239, 68, 68, 0.4)'
                            }}>
                                <div style={{ color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Flame size={20} />
                                    연속 3주 완료 보너스!
                                </div>
                                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700', marginTop: '5px' }}>
                                    🧱 +{streakBonus} 추가!
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkPage;
