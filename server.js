import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import './config/config-passport.js';
import indexRouter from './routes/index.js';
import createDirnameAndFileName from './lib/dirname.js';

const { __dirname } = createDirnameAndFileName(import.meta.url);

dotenv.config();

mongoose.Promise = global.Promise;
const connection = mongoose
  .connect(process.env.DATA_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch(console.log());

const server = express();
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(logger('dev'));
server.use(cors());

server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));
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

server.use(flash());

server.use(passport.initialize());
server.use(passport.session());

server.use('/', indexRouter);

server.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || '3000';

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
