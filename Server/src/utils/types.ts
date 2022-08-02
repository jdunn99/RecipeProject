import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export type Client = PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
>;

export type PrismaRequest = Request & {
    prisma: Client;
};

export interface ControllerParams {
    req: PrismaRequest;
    res: Response;
}

export interface Error {
    field: string;
    message: string;
}

export interface ServiceResponse<T> {
    errors?: Error[];
    response?: T;
}
