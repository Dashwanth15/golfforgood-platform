import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, Globe, Save, Loader2, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileApi } from '../../features/profile/profileApi';
import { useAuthStore } from '../../store/authStore';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name is too long'),
  avatar_url: z
    .string()
    .url('Enter a valid URL')
    .or(z.literal(''))
    .nullable()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .or(z.literal(''))
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name ?? '',
      avatar_url: user?.avatar_url ?? '',
      password: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const data: any = {
        full_name: values.full_name,
        avatar_url: values.avatar_url || null,
      };

      if (values.password) {
        data.password = values.password;
      }

      const res = await profileApi.updateProfile(data);
      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
        reset({
          full_name: res.data.full_name,
          avatar_url: res.data.avatar_url ?? '',
          password: '',
        });
        setShowPasswordSection(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Profile Settings</h1>
        <p className="text-ink-muted text-sm mt-1">Manage your account information and preferences</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center border-2 border-brand/20 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-brand" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-ink text-lg">{user?.full_name}</h2>
            <p className="text-sm text-ink-muted">{user?.email}</p>
            <span className="badge badge-brand mt-1 capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                {...register('full_name')}
                placeholder="James Smith"
                className={`input ${errors.full_name ? 'input-error' : ''}`}
              />
              {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="label">Avatar URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  {...register('avatar_url')}
                  placeholder="https://example.com/avatar.jpg"
                  className={`input !pl-9 ${errors.avatar_url ? 'input-error' : ''}`}
                />
              </div>
              {errors.avatar_url && <p className="form-error">{errors.avatar_url.message}</p>}
            </div>
          </div>

          {/* Change Password toggle button */}
          <div>
            {!showPasswordSection ? (
              <button
                type="button"
                onClick={() => setShowPasswordSection(true)}
                className="flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
              >
                <Key className="w-4 h-4" /> Change Password
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-surface border border-border space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> New Password Setup
                  </span>
                  <button
                    type="button"
                    onClick={() => { setShowPasswordSection(false); reset({ password: '' }); }}
                    className="text-xs text-ink-muted hover:text-ink hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Min 6 characters"
                    className={`input bg-white ${errors.password ? 'input-error' : ''}`}
                  />
                  {errors.password && <p className="form-error">{errors.password.message}</p>}
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
