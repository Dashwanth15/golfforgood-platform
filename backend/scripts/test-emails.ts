import { EmailService } from '../src/services/email.service';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runTests() {
  const TEST_EMAIL = process.argv[2];
  
  if (!TEST_EMAIL) {
    console.error('Please provide a test email address: npx ts-node test-emails.ts your@email.com');
    process.exit(1);
  }

  const user = { email: TEST_EMAIL, name: 'Test User' };

  console.log(`Starting email tests to: ${TEST_EMAIL}`);

  console.log('1. Testing Subscription Activated...');
  await EmailService.sendSubscriptionActivated(
    user,
    'Premium Annual',
    '2026-06-23',
    '2027-06-23',
    '2027-06-23'
  );

  console.log('2. Testing Draw Results Published...');
  await EmailService.sendDrawResultsPublished(
    [TEST_EMAIL],
    'June 2026',
    [7, 14, 21, 28, 35]
  );

  console.log('3. Testing Winner Alert...');
  await EmailService.sendWinnerAlert(
    user,
    '£500.00',
    'Four Match'
  );

  console.log('4. Testing Claim Approved...');
  await EmailService.sendClaimApproved(
    user,
    '£500.00',
    'pending_transfer'
  );

  console.log('5. Testing Claim Rejected...');
  await EmailService.sendClaimRejected(
    user,
    'The ID provided was blurred and unreadable. Please upload a clear photo.'
  );

  console.log('✅ All test emails dispatched. Please check your inbox (and spam folder).');
}

runTests().catch(console.error);
