import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        session({ session, token }) {
            if (session.user) session.user.id = token.id as string;
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const { email, password } = credentials;

                const user = await prisma.user.findUnique({
                    where: { email },
                });
                if (!user) return null;

                // now verify password
                const { salt, password: hashed } = user;
                const newHash = crypto
                    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
                    .toString('hex');

                console.log(user);
                if (hashed === newHash) return user;

                return null;
            },
        }),
    ],
};

export default NextAuth(authOptions);
