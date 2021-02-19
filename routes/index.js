import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  req.session.views = req.session.views === void 0 ? 0 : ++req.session.views;
  res.render("index", {
    title: "Simple express app",
    views: req.session.views,
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  res.render("response", { title: "Simple express app", email, password });
});

router.get("/setcookie", (req, res, next) => {
  res.cookie("my_cookie", "hello world!");
  res.signedCookies("my_signed_cookie", "hello world!", { signed: true });
  res.redirect("/");
});

router.get("/clearcookie", (req, res, next) => {
  console.log(req.cookies["my_cookie"]);
  console.log(req.signedCookies["my_signed_cookie"]);
  res.clearCookie("my_cookie");
  res.clearCookie("my_signed_cookie");
  res.redirect("/");
});

export default router;
