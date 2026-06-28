import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    (error as any).statusCode = 404;
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    (error as any).statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val: any) => val.message);
    error.message = messages.join(', ');
    (error as any).statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    (error as any).statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    (error as any).statusCode = 401;
  }

  res.status((error as any).statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};
