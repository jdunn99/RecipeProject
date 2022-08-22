import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';

/**
 * API Handler to fetch a User's profile given their ID
 * TODO: Error Handling
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user: pid } = req.query;
    if (!pid) res.status(400).json('Something went wrong.');

    const user = await prisma.user.findUnique({
        where: { id: pid?.toString() },
        select: {
            id: true,
            email: true,
            name: true,
            createdCollections: true,
        },
    });

    res.status(200).json(user);
}
