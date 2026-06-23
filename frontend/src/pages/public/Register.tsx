import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Trophy, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../features/auth/authApi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import AuthHero from '../../components/auth/AuthHero';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type Form = z.infer<typeof schema>;

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.register({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success('Account created! Welcome to GolfForGood 🎉');
        navigate('/subscribe');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Could not initiate Google Login');
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">
      {/* Left — Brand & Hero */}
      <AuthHero />

      {/* Right — Form */}
      <div className="flex items-center justify-center p-8 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-ink">Golf<span className="text-brand">ForGood</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink mb-2">Create your account</h1>
            <p className="text-ink-muted text-sm">Already have an account? <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link></p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-border rounded-xl bg-white hover:bg-surface text-ink font-semibold transition-all hover:shadow-card active:scale-[0.98] cursor-pointer mb-6"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 6.5l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <span className="relative px-3 bg-surface text-xs text-ink-muted uppercase tracking-wider font-semibold">or email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input {...register('full_name')} placeholder="James Robertson" className={`input ${errors.full_name ? 'input-error' : ''}`} />
              {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`} />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className={`input pr-10 ${errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-xs text-center text-ink-muted">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-brand hover:underline">Terms</a> and{' '}
              <a href="#" className="text-brand hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
