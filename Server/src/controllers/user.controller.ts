import userService from '../services/user.service';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { RegisterParams } from '../utils/user.types';

async function get(req: Request, res: Response) {
    const result = await userService.get();
    res.status(200).json(result);
}

/**
 * User object is stored in req.user so no need to have a db service handle anything
 */
function getUser(req: Request, res: Response, next: NextFunction) {
    console.log(req.session);
    res.status(200).json(req.user);
}

async function register(req: Request, res: Response) {
    console.log(req.body);
    const user = await userService.register(req.body as RegisterParams);
    if (user.errors) res.status(400).json(user.errors);

    res.status(200).json(user.response);
}

/**
 * User service already handles passport authentiction and the responses
 * so no need to call the service in this function, just call the passport authenticate
 */
function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (error, user) => {
        console.log(req.user, req.isAuthenticated());
        if (error) res.status(400).json([error]);
        res.status(200).json(user);
    })(req, res, next);
}

function logout(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ success: true });
    });
}

export default {
    get,
    getUser,
    register,
    login,
    logout,
};
