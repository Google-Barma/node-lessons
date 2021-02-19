import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import './config/config-passport.js';

dotenv.config();

mongoose.Promise = global.Promise;
const connection = mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const server = express();

server.use(logger('dev'));
server.use(cors());

server.use(
  session({
    secret: 'secret-word',
    key: 'session-key',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    seveUninitialized: false,
    resave: false,
  }),
);

server.use(passport.initialize());
server.use(passport.session());

server.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /users',
    data: 'Not found',
  });
});

server.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});
