const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function generateShortURL(req, res) {
  try {
    const shortID = nanoid(8);
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.json({ id: shortID });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function fetchURL(req, res) {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all URLs with analytics
async function getAllURLs(req, res) {
  try {
    const urls = await URL.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    const urlsWithAnalytics = urls.map((url) => ({
      shortId: url.shortId,
      redirectURL: url.redirectURL,
      totalClicks: url.visitHistory.length,
      createdAt: url.createdAt,
      visitHistory: url.visitHistory,
    }));

    return res.json(urlsWithAnalytics);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get analytics for specific URL
async function getURLAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      shortId: url.shortId,
      redirectURL: url.redirectURL,
      totalClicks: url.visitHistory.length,
      createdAt: url.createdAt,
      visitHistory: url.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  generateShortURL,
  fetchURL,
  getAllURLs,
  getURLAnalytics,
};
