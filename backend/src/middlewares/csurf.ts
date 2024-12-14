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
        secure: process.env.ENVIRONMENT as string === 'production',
        sameSite: 'none' // don't forget to set this to strict
    }
})

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const clientType = req.headers['x-client-type'] // Get client type from headers

  if (clientType === 'mobile') {
      console.log('Skipping CSRF protection for mobile client.'); // Debug
      return next() // Skip CSRF protection for mobile clients
  } else if (clientType === 'web') {
    console.log('Applying CSRF protection for web client.') // Debug
    csrfConfig(req, res, next) // Apply CSRF protection for web clients
  } else {
    res.status(401).json({message: 'Unauthorized.'})
    return
  }
}

export const csrfToken = (req: Request, res: Response) => {
  res.json({csrfToken: req.csrfToken()})
}