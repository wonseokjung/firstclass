import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';

interface SessionBookingCalendarProps {
  mentorId: string;
  selectedPackage: string;
  onBookingConfirm: (bookingData: BookingData) => void;
  onClose: () => void;
}

interface BookingData {
  mentorId: string;
  packageType: string;
  selectedDate: string;
  selectedTime: string;
  studentEmail: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const SessionBookingCalendar: React.FC<SessionBookingCalendarProps> = ({
  mentorId,
  selectedPackage,
  onBookingConfirm,
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [userEmail, setUserEmail] = useState<string>('');

  // 멘토 가능 시간 (실제로는 Azure에서 가져올 예정)
  const mentorAvailability = {
    '평일': ['19:00', '20:00', '21:00'], // 평일 저녁
    '토요일': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], // 토요일 오전/오후
    '일요일': ['09:00', '10:00', '11:00'] // 일요일 오전
  };

  useEffect(() => {
    // 사용자 정보 가져오기
    const storedUserInfo = sessionStorage.getItem('clathon_user_session');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserEmail(parsedUserInfo.email);
    }
  }, []);

  // 주간 날짜 생성
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    
    // 월요일부터 시작하도록 조정
    const dayOfWeek = start.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);

  // 요일별 가능한 시간 슬롯 가져오기
  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
    let availableTimes: string[] = [];

    if (dayName === '월요일' || dayName === '화요일' || dayName === '수요일' || 
        dayName === '목요일' || dayName === '금요일') {
      availableTimes = mentorAvailability['평일'];
    } else if (dayName === '토요일') {
      availableTimes = mentorAvailability['토요일'];
    } else if (dayName === '일요일') {
      availableTimes = mentorAvailability['일요일'];
    }

    return availableTimes.map(time => ({
      time,
      available: true // 실제로는 예약된 시간 체크 필요
    }));
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime(''); // 날짜 변경시 시간 초기화
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // 예약 확정 핸들러
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !userEmail) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }

    const bookingData: BookingData = {
      mentorId,
      packageType: selectedPackage,
      selectedDate,
      selectedTime,
      studentEmail: userEmail
    };

    onBookingConfirm(bookingData);
  };

  // 주 이동
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: '700',
            margin: 0
          }}>
            <Calendar size={24} style={{ marginRight: '12px', display: 'inline' }} />
            멘토링 세션 예약
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* 선택된 패키지 정보 */}
        <div style={{
          background: 'rgba(207, 43, 74, 0.1)',
          border: '1px solid rgba(207, 43, 74, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#cf2b4a', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
            선택된 패키지: {selectedPackage === 'basic' ? '5회권' : '10회권'}
          </p>
        </div>

        {/* 주간 네비게이션 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={goToPreviousWeek}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            이전 주
          </button>
          
          <h3 style={{
            color: 'white',
            fontSize: '1.2rem',
            margin: 0
          }}>
            {weekDates[0].toLocaleDateString('ko-KR', { month: 'long' })} 
            {weekDates[0].getDate()}일 ~ {weekDates[6].getDate()}일
          </h3>
          
          <button
            onClick={goToNextWeek}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            다음 주
          </button>
        </div>

        {/* 캘린더 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
          marginBottom: '30px'
        }}>
          {weekDates.map((date, index) => {
            const isSelected = selectedDate === date.toISOString().split('T')[0];
            const isPast = date < new Date();
            const timeSlots = getAvailableTimeSlots(date);
            const hasAvailableSlots = timeSlots.length > 0;

            return (
              <div
                key={index}
                onClick={() => !isPast && hasAvailableSlots && handleDateSelect(date)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)'
                    : hasAvailableSlots && !isPast
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected 
                    ? '2px solid #cf2b4a'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: hasAvailableSlots && !isPast ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: isPast ? 0.5 : 1
                }}
              >
                <div style={{
                  color: isSelected ? 'white' : '#cccccc',
                  fontSize: '0.9rem',
                  marginBottom: '4px'
                }}>
                  {date.toLocaleDateString('ko-KR', { weekday: 'short' })}
                </div>
                <div style={{
                  color: isSelected ? 'white' : 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {date.getDate()}
                </div>
                <div style={{
                  color: isSelected ? 'rgba(255,255,255,0.8)' : '#888',
                  fontSize: '0.8rem',
                  marginTop: '4px'
                }}>
                  {hasAvailableSlots ? `${timeSlots.length}개 시간` : '불가능'}
                </div>
              </div>
            );
          })}
        </div>

        {/* 시간 선택 */}
        {selectedDate && (
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{
              color: 'white',
              fontSize: '1.2rem',
              marginBottom: '16px'
            }}>
              <Clock size={20} style={{ marginRight: '8px', display: 'inline' }} />
              시간 선택
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '12px'
            }}>
              {getAvailableTimeSlots(new Date(selectedDate)).map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  style={{
                    background: selectedTime === slot.time
                      ? 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)'
                      : slot.available
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedTime === slot.time
                      ? '2px solid #cf2b4a'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: selectedTime === slot.time ? 'white' : slot.available ? 'white' : '#666',
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 선택 요약 및 확정 버튼 */}
        {selectedDate && selectedTime && (
          <div style={{
            background: 'rgba(207, 43, 74, 0.1)',
            border: '1px solid rgba(207, 43, 74, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#cf2b4a', fontSize: '1.1rem', marginBottom: '12px' }}>
              예약 정보 확인
            </h4>
            <div style={{ color: '#cccccc', lineHeight: '1.6' }}>
              <div>📅 날짜: {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}</div>
              <div>🕐 시간: {selectedTime}</div>
              <div>👨‍🏫 멘토: 정원석 (JAY)</div>
              <div>📦 패키지: {selectedPackage === 'basic' ? '5회권' : '10회권'}</div>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
          
          <button
            onClick={handleConfirmBooking}
            disabled={!selectedDate || !selectedTime}
            style={{
              background: selectedDate && selectedTime
                ? 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
              opacity: selectedDate && selectedTime ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle size={20} />
            예약 확정 및 결제
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionBookingCalendar;
