import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { full_name, email, password } = req.body;
      const result = await authService.register(full_name, email, password);
      sendCreated(res, result, 'Account created successfully');
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 'Login successful');
    } catch (err) { next(err); }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.userId);
      sendSuccess(res, user);
    } catch (err) { next(err); }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = req.query as any;
      const result = await authService.getAllUsers(
        parseInt(String(page)) || 1,
        parseInt(String(limit)) || 15,
        search ? String(search) : undefined
      );
      sendSuccess(res, result.users, 'Users retrieved', 200, {
        page: +page || 1, limit: +limit || 15, total: result.total,
        totalPages: Math.ceil(result.total / (+limit || 15)),
      });
    } catch (err) { next(err); }
  }

  async suspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const isSuspended = Boolean(req.body.is_suspended);
      const user = await authService.suspendUser(id, isSuspended);
      sendSuccess(res, user, isSuspended ? 'User suspended' : 'User reinstated');
    } catch (err) { next(err); }
  }

  async loginWithGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { access_token } = req.body;
      const result = await authService.loginWithGoogle(access_token);
      sendSuccess(res, result, 'Google login successful');
    } catch (err) { next(err); }
  }
}

export const authController = new AuthController();
