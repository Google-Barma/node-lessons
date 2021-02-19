import express from 'express';
import passport from 'passport';
import User from '../schemas/user.js';

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('message', 'Авторизируйтесь');
  res.redirect('/');
};

router.get('/', (req, res, next) => {
  res.render('index', { message: req.flash('message') });
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('message', 'Укажите правильный логин и пароль!');
      return res.redirect('/');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/profile');
    });
  })(req, res, next);
});

router.get('/registration', (req, res, next) => {
  res.render('registration', { message: req.flash('message') });
});

router.