import { PrismaRequest } from '../utils/types';
import userService from '../services/user.service';
import { Response } from 'express';
import { RegisterParams } from '../utils/user.types';

async function get(req: PrismaRequest, res: Response) {
    const result = await userService.get(req.prisma);
    res.status(200).json(result);
}

async function login(req: PrismaRequest, res: Response) {
    const user = await userService.login(req.prisma, req.body);
    if (user.errors) res.status(400).json(user.errors);

    res.status(200).json({ success: true });
}

async function register(req: PrismaRequest, res: Response) {
    console.log(req.body);
    const user = await userService.register(
        req.prisma,
        req.body as RegisterParams
    );
    if (user.errors) res.status(400).json(user.errors);

    res.status(200).json(user.response);
}

export default {
    get,
    login,
    register,
};
