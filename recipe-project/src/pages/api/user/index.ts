import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const result = await prisma.user.findMany();
    res.status(400).json(result);
}
