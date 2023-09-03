const mongoose = require("mongoose");

const User = require("./User");

const Schema = {
  characters: Array, // array of characterId
  comics: Array, // array of comicId
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};
const Favorite = mongoose.model("Favorite", Schema);

module.exports = Favorite;
