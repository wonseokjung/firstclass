import React from 'react';

/**
 * FAQ - 왜 수강 기간이 3개월인가요?
 * 모든 강의 페이지에서 재사용 가능한 컴포넌트
 */
const WhyThreeMonthsFAQ: React.FC = () => {
    return (
        <div style={{
            background: '#f0f9ff',
            padding: '25px',
            borderRadius: '15px',
            border: '1px solid #bae6fd',
            marginTop: '20px'
        }}>
            <h4 style={{
                color: '#0369a1',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                fontWeight: '700',
                marginBottom: '15px'
            }}>
                💡 왜 수강 기간이 3개월인가요?
            </h4>
            <div style={{
                color: '#1b263b',
                lineHeight: '1.8',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
                <p style={{ margin: '0 0 15px 0' }}>
                    <strong>AI 분야는 변화 속도가 다른 분야와 비교할 수 없을 만큼 빠릅니다.</strong>
                </p>
                <p style={{ margin: '0 0 15px 0' }}>
                    6개월 전 영상도 이미 상당 부분이 바뀌어 있을 정도예요.
                    그래서 저희는 <strong>기초 강의도 주기적으로 재촬영</strong>하고,
                    <strong>매주 라이브로 최신 트렌드를 실시간 반영</strong>합니다.
                </p>
                <p style={{ margin: '0', color: '#0369a1', fontWeight: '600' }}>
                    ✅ 오래된 영상을 무제한으로 보는 것보다,<br />
                    ✅ 3개월간 최신 콘텐츠로 집중 학습하는 게<br />
                    ✅ AI 분야에서는 훨씬 효과적입니다!
                </p>
            </div>
        </div>
    );
};

export default WhyThreeMonthsFAQ;
