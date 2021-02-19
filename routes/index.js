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

//скорее всего путь: '/login'
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

router.post('/registration', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash('message', 'Пользователь с таким Email уже существует');
      return res.redirect('/');
    }
    const newUser = new User({ username, email });
    newUser.setPassword(password);
    await newUser.save();

    req.flash('message', 'Вы успешно зарегистрировались');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log(req.session.passport);

  const { username, email } = req.user;
  res.render('profile', { username, email });
});

router.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/');
});

export default router;
