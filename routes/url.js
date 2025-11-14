const express = require("express");
const router = express.Router();
const {
  generateShortURL,
  getAllURLs,
  getURLAnalytics,
} = require("../controllers/url");

router.post("/shorten", generateShortURL);
router.get("/urls", getAllURLs);
router.get("/analytics/:shortId", getURLAnalytics);

module.exports = router;
