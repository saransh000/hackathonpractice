import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Extend Request interface for rate limit info
declare global {
  namespace Express {
    interface Request {
      rateLimit?: {
        resetTime?: number;
      };
    }
  }
}

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: req.rateLimit?.resetTime ? Math.ceil(req.rateLimit.resetTime / 1000) : 900
    });
  }
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for development - Limit each IP to 50 requests per windowMs for auth
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    console.log(`🚨 Rate limit exceeded for auth endpoint: ${req.ip} - ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: req.rateLimit?.resetTime ? Math.ceil(req.rateLimit.resetTime / 1000) : 900
    });
  }
});

// Strict rate limiter for admin endpoints
export const adminLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit admin actions
  message: {
    success: false,
    error: 'Too many admin requests, please try again after 10 minutes.',
    retryAfter: '10 minutes'
  },
  handler: (req: Request, res: Response) => {
    console.log(`🚨 Admin rate limit exceeded: ${req.ip} - ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      error: 'Too many admin requests, please try again later.',
      retryAfter: req.rateLimit?.resetTime ? Math.ceil(req.rateLimit.resetTime / 1000) : 600
    });
  }
});

// More lenient rate limiter for data retrieval
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for read operations
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  },
  skip: (req: Request) => {
    // Skip rate limiting for GET requests to health endpoints
    return req.method === 'GET' && req.path === '/health';
  }
});