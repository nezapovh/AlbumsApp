// models/Album.js
const mongoose = require("mongoose");

// Predefined list of acceptable genres
const genres = [
  "Rock",
  "Pop",
  "Hip-Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
];

const albumSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  genre: {
    type: String,
    enum: genres,
    required: true,
  },
  tracks: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length > 0 && value.length <= 100;
      },
      message: "The album must have between 1 and 100 tracks.",
    },
  },
  updatedAt: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Pre-save hook to update the updatedAt field
albumSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Album", albumSchema);
