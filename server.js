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

dotenv.config();
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DATA_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch(console.log());

const { __dirname } = createDirnameAndFileName(import.meta.url);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'secret-word',
    key: 'session-key',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    saveUninitialized: false,
    resave: false,
  }),
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
