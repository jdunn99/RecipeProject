import { Prisma } from '@prisma/client';

/**
 * Checks to see if there is a Prisma unique constraint error on any operation
 * The message returned will be used for the error response and the field can be
 * manually handled
 */
export function handleUniqueConstraintError(e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') return e.message;
    }
}
