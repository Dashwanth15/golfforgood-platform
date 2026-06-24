import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
  return val;
}

export const envConfig = {
  PORT:                   process.env.PORT ?? '5000',
  NODE_ENV:               process.env.NODE_ENV ?? 'development',
  JWT_SECRET:             required('JWT_SECRET'),
  JWT_EXPIRES_IN:         process.env.JWT_EXPIRES_IN ?? '7d',
  SUPABASE_URL:           required('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: required('SUPABASE_SERVICE_ROLE_KEY'),
  SUPABASE_ANON_KEY:      process.env.SUPABASE_ANON_KEY ?? '',
  FRONTEND_URL:           process.env.FRONTEND_URL ?? 'http://localhost:5173',
  RESEND_API_KEY:         required('RESEND_API_KEY'),
  EMAIL_FROM:             process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
  STRIPE_SECRET_KEY:      process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_ENABLED:         process.env.STRIPE_ENABLED ?? 'false',
  STRIPE_WEBHOOK_SECRET:  process.env.STRIPE_WEBHOOK_SECRET ?? '',
};
