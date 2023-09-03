const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Favorite = require("../models/Favorite");
const isAuthenticated = require("../middleware/isAuthenticated");
const { default: mongoose } = require("mongoose");

// GET favorites
router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const existingFavorite = await Favorite.findOne({ owner: req.user._id });
    if (!existingFavorite) {
      return res
        .status(200)
        .json({ userFavorites: { characters: [], comics: [] } });
    }

    return res.status(200).json({ userFavorites: existingFavorite });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// POST favorites
router.post("/favorites", isAuthenticated, async (req, res) => {
  try {
    const { type, id } = req.body;
    let newFavorite = "";
    if (!type || !id) {
      throw { status: 400, message: "Missing parameters" };
    }

    // check if user favorites exist in database based on user authentication credentials
    const hasUserBeenSaved = await Favorite.findOne({ owner: req.user._id });

    if (hasUserBeenSaved) {
      if (type.includes("character")) {
        newFavorite = await Favorite.findOneAndUpdate(
          hasUserBeenSaved._id,
          {
            characters: [...hasUserBeenSaved.characters, id],
            owner: req.user,
          },
          { new: true }
        );
      } else if (type.includes("comic")) {
        newFavorite = await Favorite.findOneAndUpdate(
          hasUserBeenSaved._id,
          {
            comics: [...hasUserBeenSaved.comics, id],
            owner: req.user,
          },
          { new: true }
        );
      } else {
        throw { status: 400, message: "Invalid favorite type" };
      }
    }
    // else new user favorite
    else {
      if (type.includes("character")) {
        newFavorite = new Favorite({
          characters: [id],
          owner: req.user,
        });
        await newFavorite.save();
      } else if (type.includes("comic")) {
        newFavorite = new Favorite({
          comics: [id],
          owner: req.user,
        });

        await newFavorite.save();
      } else {
        throw { status: 400, message: "Invalid favorite type" };
      }
    }

    res.status(201).json({
      userFavorites: {
        characters: newFavorite.characters,
        comics: newFavorite.comics,
      },
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// delete favorite item
router.delete("/favorites", isAuthenticated, async (req, res) => {
  try {
    if (!req.query.type || !req.query.id)
      throw { status: 400, message: "Missing parameters" };

    // find favorite collection of user
    let responseObj = "";
    const existingFavorite = await Favorite.findOne({ owner: req.user._id });

    if (!existingFavorite) {
      throw { status: 400, message: "Invalid request" };
    }
    const favoriteId = existingFavorite._id;

    if (req.query.type.includes("character")) {
      let index = existingFavorite.characters.findIndex(
        (id) => id === req.query.id
      );
      if (index !== -1) {
        existingFavorite.characters.splice(index, 1);
      } else {
        return res.status(200).json({ message: "Favorite not found !" });
      }
      responseObj = await Favorite.findByIdAndUpdate(
        favoriteId,
        {
          characters: existingFavorite.characters,
        },
        { new: true }
      );
    } else if (req.query.type.includes("comic")) {
      let index = existingFavorite.comics.findIndex(
        (id) => id === req.query.id
      );
      if (index !== -1) {
        existingFavorite.comics.splice(index, 1);
      } else {
        return res.status(200).json({ message: "Favorite not found !" });
      }
      responseObj = await Favorite.findByIdAndUpdate(
        favoriteId,
        {
          comics: existingFavorite.comics,
        },
        { new: true }
      );
    } else {
      throw { status: 400, message: "Invalid request" };
    }

    res.status(200).json({
      userFavorites: {
        characters: responseObj.characters,
        comics: responseObj.comics,
      },
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
