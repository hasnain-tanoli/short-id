const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/user");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);

router.get("/auth/check", checkAuth, (req, res) => {
  return res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;
