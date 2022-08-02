import { PrismaClient } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { PrismaRequest } from '../utils/types';

/**
 * Middleware to pass the prisma client to any requests.
 */
export function WithPrisma(
    req: PrismaRequest,
    res: Response,
    next: NextFunction
) {
    const prisma = new PrismaClient();
    req.prisma = prisma;
    next();
}
