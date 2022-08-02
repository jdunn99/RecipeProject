import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import prisma from './prisma.config';
import bcrypt from 'bcrypt';
import { User } from '../utils/user.types';
import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';

module.exports = function (passport: PassportStatic) {
    passport.use(new Strategy({ usernameField: 'email' }, userService.login));

    passport.serializeUser((user, done) => {
        done(null, (user as User).id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id.toString()),
            },
        });

        return done(null, user);
    });
};
