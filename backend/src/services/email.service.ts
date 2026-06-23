import { Resend } from 'resend';
import { envConfig } from '../config/env';

const resend = new Resend(envConfig.RESEND_API_KEY);

const FROM_EMAIL = envConfig.EMAIL_FROM;

// Brand Colors
const brandColor = '#10B981';

const baseHtml = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; color: #1f2937; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .header { background: ${brandColor}; padding: 30px 20px; text-align: center; }
  .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; }
  .content { padding: 30px; line-height: 1.6; }
  .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  .btn { display: inline-block; background: ${brandColor}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
  .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GolfForGood</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>GolfForGood Ltd. • 123 Golf Lane, London, UK</p>
      <p>This is an automated message, please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export class EmailService {
  /**
   * Internal wrapper to safely send emails without breaking operations
   */
  private static async sendEmailSafely(options: { to: string; subject: string; html: string; text?: string }) {
    try {
      const result = await resend.emails.send({
        from: `GolfForGood <${FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log(`Email sent successfully to ${options.to}. ID: ${result.data?.id}`);
      return result;
    } catch (error) {
      console.error(`Failed to send email to ${options.to}:`, error);
      // We do not throw the error here to ensure business flow continues
    }
  }

  // 1. Subscription Activated
  static async sendSubscriptionActivated(user: { email: string; name: string }, planName: string, startDate: string, endDate: string, renewalDate: string) {
    const html = baseHtml(`
      <h2>Welcome to GolfForGood!</h2>
      <p>Hi ${user.name},</p>
      <p>Your subscription to <strong>${planName}</strong> has been successfully activated. You are now officially contributing to incredible charities and entered into our monthly draws!</p>
      <div class="highlight-box">
        <p><strong>Plan Details:</strong></p>
        <ul>
          <li><strong>Start Date:</strong> ${startDate}</li>
          <li><strong>End Date:</strong> ${endDate}</li>
          <li><strong>Next Renewal:</strong> ${renewalDate}</li>
        </ul>
      </div>
      <p>Head over to your dashboard to add your first scores and select your charity.</p>
      <a href="${envConfig.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard</a>
    `);
    
    await this.sendEmailSafely({
      to: user.email,
      subject: 'GolfForGood Subscription Activated',
      html,
    });
  }

  // 2. Draw Results Published
  static async sendDrawResultsPublished(subscribers: string[], drawMonth: string, winningNumbers: number[]) {
    if (subscribers.length === 0) return;

    const numbersStr = winningNumbers.join(', ');
    const html = baseHtml(`
      <h2>The Draw Results Are Live!</h2>
      <p>The winning numbers for <strong>${drawMonth}</strong> have just been drawn!</p>
      <div class="highlight-box" style="text-align: center; font-size: 20px; font-weight: bold; color: ${brandColor};">
        ${numbersStr}
      </div>
      <p>Log in to your dashboard to see if your scores matched the winning numbers and if you have a prize waiting to be claimed.</p>
      <a href="${envConfig.FRONTEND_URL}/dashboard/draws" class="btn">Check Results</a>
    `);

    const promises = subscribers.map(email => this.sendEmailSafely({
      to: email,
      subject: 'GolfForGood Draw Results Are Live',
      html,
    }));
    await Promise.allSettled(promises);
  }

  // 3. Winner Alert
  static async sendWinnerAlert(user: { email: string; name: string }, prizeAmount: string, matchLevel: string) {
    const html = baseHtml(`
      <h2>Congratulations! You Won a GolfForGood Prize 🎉</h2>
      <p>Hi ${user.name},</p>
      <p>Amazing news! Your golf scores matched the draw numbers (${matchLevel}), and you've won a prize!</p>
      <div class="highlight-box" style="text-align: center; font-size: 24px; font-weight: bold; color: #D97706;">
        ${prizeAmount}
      </div>
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Log in to your dashboard.</li>
        <li>Go to "My Winnings".</li>
        <li>Upload proof of identity to claim your prize.</li>
      </ol>
      <a href="${envConfig.FRONTEND_URL}/dashboard/winnings" class="btn">Claim My Prize</a>
    `);

    await this.sendEmailSafely({
      to: user.email,
      subject: 'Congratulations! You Won a GolfForGood Prize',
      html,
    });
  }

  // 4. Claim Approved
  static async sendClaimApproved(user: { email: string; name: string }, prizeAmount: string, paymentStatus: string) {
    const html = baseHtml(`
      <h2>Your GolfForGood Claim Has Been Approved</h2>
      <p>Hi ${user.name},</p>
      <p>Good news! Your identity proof has been verified, and your claim for <strong>${prizeAmount}</strong> has been officially approved.</p>
      <div class="highlight-box">
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
        <p>We will be processing the transfer shortly. If you haven't received it within 3-5 business days, please let us know.</p>
      </div>
      <p>Keep playing and doing good!</p>
    `);

    await this.sendEmailSafely({
      to: user.email,
      subject: 'Your GolfForGood Claim Has Been Approved',
      html,
    });
  }

  // 5. Claim Rejected
  static async sendClaimRejected(user: { email: string; name: string }, reason: string) {
    const html = baseHtml(`
      <h2>GolfForGood Claim Review Update</h2>
      <p>Hi ${user.name},</p>
      <p>We encountered an issue while verifying your prize claim.</p>
      <div class="highlight-box" style="background: #FEF2F2; border-color: #FECACA; color: #991B1B;">
        <p><strong>Rejection Reason:</strong></p>
        <p>${reason}</p>
      </div>
      <p><strong>How to Resubmit:</strong></p>
      <p>Please log in to your dashboard, navigate to your winnings, and upload a new, clear proof of identity that addresses the reason above.</p>
      <a href="${envConfig.FRONTEND_URL}/dashboard/winnings" class="btn">Resubmit Proof</a>
    `);

    await this.sendEmailSafely({
      to: user.email,
      subject: 'GolfForGood Claim Review Update',
      html,
    });
  }
}
