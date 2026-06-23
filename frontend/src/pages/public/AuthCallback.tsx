import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { authApi } from '../../features/auth/authApi';
import { useAuthStore } from '../../store/authStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const processOAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          throw new Error('No Google authentication session found. Please try again.');
        }

        const res = await authApi.loginWithGoogle(session.access_token);
        if (res.success && res.data) {
          setAuth(res.data.user, res.data.token);
          
          // Sign out of Supabase to prevent duplicate local session management
          await supabase.auth.signOut();
          
          toast.success(`Welcome back, ${res.data.user.full_name.split(' ')[0]}!`);
          navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          throw new Error('Verification failed. Could not log in with Google.');
        }
      } catch (err: any) {
        console.error('OAuth processing error:', err);
        toast.error(err.message || 'Google Authentication failed.');
        navigate('/login');
      }
    };

    processOAuth();
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center pt-16">
      <div className="text-center p-8 bg-white border border-border rounded-3xl shadow-elevated max-w-sm w-full mx-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto mb-4" />
        <h2 className="text-xl font-bold text-ink mb-2">Verifying Google Account</h2>
        <p className="text-ink-muted text-sm leading-relaxed">
          Just a moment, champion. Connecting your account...
        </p>
      </div>
    </div>
  );
}
