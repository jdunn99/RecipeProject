import { Client, ServiceResponse } from '../utils/types';
import {
    AuthenticationResponse,
    LoginParams,
    RegisterParams,
} from '../utils/user.types';
import bcrypt from 'bcrypt';
import { handleUniqueConstraintError } from '../utils/prisma.errors';

const SALT = 10; // TODO: env the salt

/**
 * Get all the Users registed in the database
 */
async function get(prisma: Client) {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            lastLoggedIn: true,
        },
    });
}

/**
 * Registers a User to the client
 */
async function register(
    prisma: Client,
    { email, firstName, lastName, password }: RegisterParams
): Promise<ServiceResponse<AuthenticationResponse>> {
    try {
        const hashedPassword = bcrypt.hashSync(password, SALT);
        const user = await prisma.user.create({
            data: {
                hashedPassword,
                email,
                firstName,
                lastName,
                lastLoggedIn: new Date(Date.now()),
            },
        });

        return {
            response: {
                firstName,
                lastName,
                email,
                id: user.id,
            },
        };
    } catch (e) {
        const message = handleUniqueConstraintError(e);
        if (message)
            return {
                errors: [
                    {
                        field: 'email', // only unique field is email
                        message,
                    },
                ],
            };
    }
}

/**
 * Logs in a User
 * TODO: Session for authentication
 */
async function login(prisma: Client, { email, password }: LoginParams) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user)
        return {
            errors: [
                {
                    field: 'email',
                    message: `User with email ${email} not found.`,
                },
            ],
        };

    const { hashedPassword } = user;
    // if the password is incorrect
    if (!bcrypt.compareSync(password, hashedPassword))
        return {
            errors: [{ field: 'password', message: 'Incorrect password' }],
        };

    return null;
}

export default {
    get,
    login,
    register,
};
