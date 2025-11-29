import emailjs from '@emailjs/browser';

// EmailJS 설정
const EMAILJS_CONFIG = {
  serviceId: 'service_ca3frqd',
  templateId: 'template_vljx7m5',
  publicKey: 'McMYvMBYbK-cdZ8ba'
};

class EmailService {
  /**
   * 비밀번호 재설정 코드를 이메일로 발송
   * @param toEmail 받는 사람 이메일
   * @param code 6자리 인증 코드
   */
  async sendPasswordResetCode(toEmail: string, code: string): Promise<boolean> {
    try {
      console.log('📧 이메일 발송 시작:', toEmail);

      const templateParams = {
        to_email: toEmail,
        code: code,
        to_name: toEmail.split('@')[0] // 이메일 앞부분을 이름으로 사용
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      if (response.status === 200) {
        console.log('✅ 이메일 발송 성공:', response);
        return true;
      } else {
        console.error('❌ 이메일 발송 실패:', response);
        return false;
      }
    } catch (error: any) {
      console.error('❌ 이메일 발송 중 오류:', error);
      return false;
    }
  }

  /**
   * 비밀번호 변경 완료 알림 이메일 발송 (선택사항)
   * @param toEmail 받는 사람 이메일
   */
  async sendPasswordChangedNotification(toEmail: string): Promise<boolean> {
    try {
      console.log('📧 비밀번호 변경 알림 발송:', toEmail);
      
      // 나중에 별도 템플릿 만들면 사용
      // 지금은 생략 가능
      
      return true;
    } catch (error: any) {
      console.error('❌ 알림 이메일 발송 실패:', error);
      return false;
    }
  }
}

export default new EmailService();

