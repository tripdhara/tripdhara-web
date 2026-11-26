import { jest } from '@jest/globals';

const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'msg-123' });

jest.unstable_mockModule('nodemailer', () => ({
    default: {
        createTransport: jest.fn().mockReturnValue({
            sendMail: mockSendMail
        })
    }
}));

jest.unstable_mockModule('@/core/Helpers/TemplateHelper.js', () => ({
    renderTemplate: jest.fn().mockReturnValue('<html>OTP: 123456</html>')
}));

jest.unstable_mockModule('@/core/Lib/appConfig.js', () => ({
    getAppConfig: jest.fn().mockResolvedValue({
        smtp: {
            host: 'smtp.gmail.com',
            port: 587,
            user: 'test@gmail.com',
            pass: 'pass',
            from_name: 'Pahadigo',
            from_email: 'noreply@pahadigo.com'
        }
    })
}));

const { default: AuthNotificationService } = await import('@/core/Services/Notifications/domains/AuthNotificationService.js');
const { renderTemplate } = await import('@/core/Helpers/TemplateHelper.js');

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Email Functions', () => {
        it('should send OTP email successfully', async () => {
            const result = await AuthNotificationService.sendSecureCodeEmail('test@test.com', '123456');
            expect(result).toBe(true);
            expect(renderTemplate).toHaveBeenCalledWith('Emails/otp.html', { OTP: '123456' });
            expect(mockSendMail).toHaveBeenCalled();
        });
    });
});
