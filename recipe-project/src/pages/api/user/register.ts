import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { prisma } from '../../../server/db/client';
import { User } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { name, email, password } = req.body;

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');

    // Create a User in our DB
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hash,
            salt,
        },
    });

    if (!user) res.status(400).json('Something went wrong.');

    // generate an Account for Next auth
    await prisma.account.create({
        data: {
            type: 'Credentials',
            provider: 'Credentials',
            providerAccountId: user.id,
            userId: user.id,
        },
    });

    res.status(200).json(user);
}
