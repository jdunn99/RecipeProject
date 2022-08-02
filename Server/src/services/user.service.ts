import { ServiceResponse } from '../utils/types';
import { AuthenticationResponse, RegisterParams } from '../utils/user.types';
import bcrypt from 'bcrypt';
import { handleUniqueConstraintError } from '../utils/prisma.errors';
import prisma from '../config/prisma.config';

const SALT = 10; // TODO: env the salt

/**
 * Get all the Users registed in the database
 */
async function get() {
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
async function register({
    email,
    firstName,
    lastName,
    password,
}: RegisterParams): Promise<ServiceResponse<AuthenticationResponse>> {
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
 * Logs in a User. This function is used in the passport local strategy
 * Any time passport.authenticate is called, this function is also called
 */
async function login(email: string, password: string, done: any) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
        return done({
            field: 'email',
            message: `User with email ${email} not found`,
        });

    const { id, firstName, lastName } = user; // parse out the fields we want to return

    // check password
    if (bcrypt.compareSync(password, user.hashedPassword))
        return done(null, user);
    else
        return done({
            field: 'password',
            message: 'Invalid password',
        });
}

export default {
    get,
    login,
    register,
};
