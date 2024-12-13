import csrf from "csurf";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
      interface Request {
        csrfToken(): string;
      }
    }
  }

const csrfConfig = csrf({
    cookie: {
        httpOnly: false, // Allow JavaScript access to the CSRF token
        secure: true,
        sameSite: 'strict'
    }
})

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const clientType = req.headers['x-client-type'] // Get client type from headers

  if (clientType === 'mobile') {
      console.log('Skipping CSRF protection for mobile client.'); // Debug
      return next() // Skip CSRF protection for mobile clients
  }

  console.log('Applying CSRF protection for web client.') // Debug
  csrfConfig(req, res, next) // Apply CSRF protection for web clients
};

export const csrfToken = (req: Request, res: Response) => {
    res.json({csrfToken: req.csrfToken()})
}