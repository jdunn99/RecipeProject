import { Collection } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { prisma } from '../../../server/db/client';
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]';

async function getCollection(): Promise<Collection[]> {
    return await prisma.collection.findMany();
}

/**
 * Creates an empty Collection given a name
 * @param creatorId the ID of the User creating the Collection - determined from our Next auth Session
 * @param name The name of the Collection
 */
async function createCollection(
    creatorId: string,
    name: string
): Promise<Collection> {
    // TODO: Error handling
    return await prisma.collection.create({
        data: {
            creator: {
                connect: {
                    id: creatorId,
                },
            },
            name,
        },
    });
}

/**
 * Handler function for the API route.
 * Specifically handles POST vs GET requests
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Protected route.
    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session || !session.user)
        res.send({ error: 'You must be signed in to perform this action' });

    let result;

    if (req.method !== 'POST') result = await getCollection();
    else result = await createCollection(session!.user!.id, req.body.name);

    res.status(200).json(result);
}
