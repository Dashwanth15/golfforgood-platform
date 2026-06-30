import bcrypt from 'bcryptjs';
import { supabase } from '../../config/database';
import { signToken } from '../../shared/utils/jwt';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../shared/errors/AppError';

export class AuthService {
  async register(full_name: string, email: string, password: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    // Check existing
    const { data: existing } = await supabase
      .from('users').select('id').eq('email', sanitizedEmail).single();
    if (existing) throw new ConflictError('Email already registered');

    const password_hash = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ full_name, email: sanitizedEmail, password_hash, role: 'subscriber' })
      .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
      .single();

    if (error || !user) {
      console.error('Supabase user creation error:', error);
      throw new Error(`Failed to create user: ${error?.message || 'Unknown error'}`);
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async login(email: string, password: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    const { data: user } = await supabase
      .from('users')
      .select('id, full_name, email, password_hash, role, avatar_url, is_suspended, created_at')
      .eq('email', sanitizedEmail)
      .is('deleted_at', null)
      .single();

    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.is_suspended) throw new UnauthorizedError('Account suspended');

    if (user.password_hash === 'oauth_google') {
      throw new UnauthorizedError('Please log in with Google');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const { password_hash: _, ...safeUser } = user;
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user: safeUser, token };
  }

  async loginWithGoogle(accessToken: string) {
    // Decode the Supabase JWT locally to avoid a network round-trip to Supabase Auth API.
    // Supabase JWTs are signed with the SUPABASE_JWT_SECRET (different from service role key).
    // We use jsonwebtoken to verify locally — much faster and no network timeout risk.
    let email: string;
    let full_name: string;
    let avatar_url: string | null;

    try {
      const jwt = await import('jsonwebtoken');
      // Supabase JWT secret is NOT the service role key.
      // It's found in Supabase Dashboard → Settings → API → JWT Secret.
      // We store it as SUPABASE_JWT_SECRET in .env.
      const jwtSecret = process.env.SUPABASE_JWT_SECRET;

      if (jwtSecret) {
        // Fast path: verify and decode locally
        const decoded = jwt.default.verify(accessToken, jwtSecret) as any;
        email = (decoded.email as string)?.toLowerCase().trim();
        full_name = decoded.user_metadata?.full_name || decoded.user_metadata?.name || 'Google User';
        avatar_url = decoded.user_metadata?.avatar_url || decoded.user_metadata?.picture || null;
      } else {
        // Fallback: network call to Supabase (slower, may timeout)
        console.warn('SUPABASE_JWT_SECRET not set — falling back to supabase.auth.getUser() network call');
        const { data: { user: sbUser }, error: authError } = await supabase.auth.getUser(accessToken);
        if (authError || !sbUser) {
          console.error('Supabase Google OAuth validation error:', authError);
          throw new UnauthorizedError('Invalid Google session token');
        }
        email = sbUser.email?.toLowerCase().trim() ?? '';
        full_name = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || 'Google User';
        avatar_url = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || null;
      }
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Invalid or expired Google session token');
      }
      throw err;
    }

    if (!email) {
      throw new UnauthorizedError('Email not associated with this Google account');
    }

    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
      .eq('email', email)
      .is('deleted_at', null);

    if (selectError) {
      throw new Error(`Database error: ${selectError.message}`);
    }

    const user = users && users.length > 0 ? users[0] : null;
    let finalUser = user;

    if (!user) {
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({
          full_name,
          email,
          avatar_url,
          password_hash: 'oauth_google',
          role: 'subscriber'
        })
        .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
        .single();

      if (createErr || !newUser) {
        console.error('Error creating user row for Google Auth:', createErr);
        throw new Error(`Failed to create Google user: ${createErr?.message || 'Unknown error'}`);
      }

      finalUser = newUser;
    } else {
      if (user.is_suspended) {
        throw new UnauthorizedError('Account suspended');
      }

      if (!user.avatar_url && avatar_url) {
        const { data: updatedUser } = await supabase
          .from('users')
          .update({ avatar_url, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
          .single();
        if (updatedUser) {
          finalUser = updatedUser;
        }
      }
    }

    const token = signToken({ userId: finalUser.id, email: finalUser.email, role: finalUser.role });
    return { user: finalUser, token };
  }

  async getMe(userId: string) {
    const { data } = await supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url, is_suspended, created_at')
      .eq('id', userId)
      .single();
    if (!data) throw new NotFoundError('User');
    return data;
  }

  async getAllUsers(page = 1, limit = 15, search?: string) {
    const from = (page - 1) * limit;
    let query = supabase
      .from('users')
      .select('id, full_name, email, role, is_suspended, created_at', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, count } = await query;
    return { users: data ?? [], total: count ?? 0 };
  }

  async suspendUser(id: string, is_suspended: boolean) {
    const { data } = await supabase
      .from('users')
      .update({ is_suspended, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, full_name, email, role, is_suspended')
      .single();
    if (!data) throw new NotFoundError('User');
    return data;
  }

  async updateUser(id: string, updates: { full_name?: string; email?: string; role?: string }) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, full_name, email, role, is_suspended, created_at')
      .single();

    if (error) {
      if (error.code === '23505') throw new ConflictError('Email already in use');
      throw new Error(`Failed to update user: ${error.message}`);
    }
    if (!data) throw new NotFoundError('User');
    return data;
  }
}

export const authService = new AuthService();
