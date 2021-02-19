const express = require('express')
const router = express.Router()
const { articles } = require('../model/data.json')
const fs = require('fs/promises')
const path = require('path')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Мои контакты' })
})

router.get('/blog', function (req, res, next) {
  res.render('blog', { title: 'Блог', articles })
})

router.post('/contact', async (req, res, next) => {
  try {
    console.log(req.body)
    await fs.writeFile(
      path.join(__dirname, '..', 'model', 'message.json'),
      JSON.stringify(req.body, null, 2),
    )
    res.redirect('/')
  } catch (e) {
    next(e)
  }
})

module.exports = router
