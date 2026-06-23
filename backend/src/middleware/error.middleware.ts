import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { envConfig } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational errors (our custom AppErrors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error:   err.code,
    });
    return;
  }

  // Supabase duplicate key errors
  if ((err as any).code === '23505') {
    res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error:   'CONFLICT',
    });
    return;
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: envConfig.NODE_ENV === 'development' ? err.message : 'Internal server error',
    error:   'INTERNAL_ERROR',
    ...(envConfig.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
