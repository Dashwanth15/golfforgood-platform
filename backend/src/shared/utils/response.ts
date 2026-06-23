import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200,
  pagination?: Record<string, any>
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination ? { pagination } : {}),
  });
};

export const sendCreated = (res: Response, data: any, message = 'Created successfully') => {
  sendSuccess(res, data, message, 201);
};

export const sendError = (res: Response, message: string, statusCode = 500, code = 'ERROR') => {
  res.status(statusCode).json({
    success: false,
    message,
    error: code,
  });
};
