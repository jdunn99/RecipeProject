import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { prisma } from '../../../server/db/client';
import { authOptions } from '../auth/[...nextauth]';

/**
 * Deletes a Collection by ID.
 * Guarded where the creatorID must be the requesting User ID
 * TODO: Error Handling
 */
async function deleteCollectionById(collectionId: string, userId?: string) {
    if (!userId)
        return { error: 'You must be signed in to perform this action.' };

    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
    });

    if (!collection)
        return { error: `Collection with ID ${collectionId} not found ` };

    if (collection.creatorId !== userId)
        return {
            error: `You do not have permission to delete this collection `,
        };

    await prisma.collection.delete({ where: { id: collectionId } });

    return { success: true, creatorId: userId, collectionId };
}

async function getCollectionById(collectionId: string) {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { collection } = req.query;
    if (typeof collection === undefined)
        res.status(400).json('Something went wrong.');

    const session = await unstable_getServerSession(req, res, authOptions);

    let result;

    if (req.method === 'DELETE')
        result = await deleteCollectionById(
            collection!.toString(),
            session?.user?.id
        );

    res.status(200).json(result);
}
