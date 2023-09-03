const express = require("express");
const router = express.Router();

// API client
const apiClient = require("../api/client");

// GET : all characters
router.get("/characters", async (req, res) => {
  try {
    // console.log(req.query);
    const name = req.query.name || "";
    const limit = req.query.limit || 100;
    const skip = req.query.skip || 0;
    const response = await apiClient.get(
      `/characters?name=${name}&limit=${limit}&skip=${skip}`
    );
    // console.lo   g(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.express || "Internal server error" });
  }
});

// GET : comics related to a character
router.get("/character-comics/:characterId", async (req, res) => {
  try {
    const response = await apiClient.get(`/comics/${req.params.characterId}`);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// GET : all comics
router.get("/comics", async (req, res) => {
  try {
    const title = req.query.title || "";
    const limit = req.query.limit || 100;
    const skip = req.query.skip || 0;
    const response = await apiClient.get(
      `/comics?title=${title}&limit=${limit}&skip=${skip}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server erro" });
  }
});

// GET : details on a specific comic
router.get("/comic/:comicId", async (req, res) => {
  try {
    console.log(req.params.comicId);
    const response = await apiClient.get(`/comic/${req.params.comicId}`);
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server erro" });
  }
});

module.exports = router;
