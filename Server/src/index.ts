import express from 'express';
import { WithPrisma } from './middleware/prisma.middleware';
import userRouter from './routes/user.route';

const main = async () => {
    const app = express();
    app.use(express.json());
    app.use(WithPrisma);

    app.use('/user', userRouter);

    app.listen(4000, () => console.log('Server started'));
};

main().catch((error): any => console.log(error));
