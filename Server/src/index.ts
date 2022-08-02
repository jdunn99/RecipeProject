import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route';
import passport from 'passport';
import cors from 'cors';

const app = express();

// middleware
app.use(express.json());
app.use(
    session({
        secret: 'secret',
        saveUninitialized: false,
        resave: false,
    })
);
app.use(cors({ credentials: 'include' }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // idk

// routes
app.use('/user', userRouter);

// init
app.listen(4000, () => console.log('Server started'));
