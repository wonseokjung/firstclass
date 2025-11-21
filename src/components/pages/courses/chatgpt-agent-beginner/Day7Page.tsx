import React from 'react';
import { ArrowLeft, Lock, Calendar } from 'lucide-react';

interface Day7PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day7Page: React.FC<Day7PageProps> = ({ onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          borderRadius: '50%',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
        }}>
          <Lock size={40} color="white" />
        </div>

        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          🚀 7강 준비 중
        </h2>

        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <Calendar size={24} color="#92400e" />
            <p style={{
              color: '#92400e',
              fontSize: '1.1rem',
              margin: 0,
              fontWeight: '700'
            }}>
              2025년 11월 21일 오후 10시
            </p>
          </div>
          <p style={{
            color: '#78350f',
            fontSize: '0.95rem',
            margin: 0,
            lineHeight: '1.7'
          }}>
            <strong style={{ fontSize: '1.05rem', color: '#92400e' }}>📢 중요 업데이트 안내</strong><br/>
            <br/>
            최신 유튜브 추천 알고리즘 논문이 공개되어,<br/>
            이를 반영한 새로운 내용으로 7강을 재촬영하였습니다.<br/>
            <br/>
            <strong style={{ color: '#92400e' }}>▸ 7강: 알고리즘 해킹 에이전트</strong><br/>
            - 유튜브 추천 시스템 최신 논문 분석<br/>
            - AI가 논문을 학습하여 바이럴 영상 생성<br/>
            - 알고리즘 친화적 콘텐츠 자동 최적화<br/>
            <br/>
            <strong style={{ color: '#0369a1' }}>2025년 11월 21일 오후 10시 공개 예정</strong>
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: '700',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
          }}
        >
          <ArrowLeft size={20} />
          강의 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Day7Page;

