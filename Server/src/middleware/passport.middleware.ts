import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to protect any routes that need to be authenticated
 */
export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(req.isAuthenticated(), req.isUnauthenticated(), req.user);
    if (req.isAuthenticated()) return next();

    res.status(401).json('Not authenticated');
}
