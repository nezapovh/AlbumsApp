const Album = require("../models/album");
const APIError = require("../errors/apiError");

const getAllAlbums = async (req, res) => {
  const albums = await Album.find();
  res.status(200).json({ success: true, data: albums });
};

const getAlbums = async (req, res) => {
  const { sortBy, minYear, maxYear, fields, artistSearch, titleSearch } =
    req.query;

  const query = {};
  if (minYear || maxYear) {
    query.year = {};
    if (minYear) query.year.$gte = parseInt(minYear);
    if (maxYear) query.year.$lte = parseInt(maxYear);
  }

  let selectedFields = "";
  if (fields) {
    selectedFields = fields.split(",").join(" ");
  }

  if (artistSearch) {
    query.artist = { $regex: artistSearch, $options: "i" };
  }

  if (titleSearch) {
    query.title = { $regex: titleSearch, $options: "i" };
  }

  const albums = await Album.find(query).select(selectedFields).sort(sortBy);
  res.status(200).json({ success: true, data: albums });
};

// Get single album by ID
const getAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    throw new APIError("Album not found", 404);
  }
  res.status(200).json(album);
};

// Create a new album
const createAlbum = async (req, res) => {
  if (!req.body.artist || !req.body.title) {
    return res
      .status(400)
      .json({ success: false, msg: "Artist and title are required." });
  }
  console.log(req.user);
  const newAlbum = new Album({
    artist: req.body.artist,
    title: req.body.title,
    year: req.body.year,
    genre: req.body.genre,
    tracks: req.body.tracks,
    owner: req.user._id,
  });

  await newAlbum.save();
  res.status(201).json({ success: true, newAlbum });
};

// Update an album by ID
const updateAlbum = async (req, res) => {
  const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedAlbum) throw new APIError("Album not found", 404);

  res.status(200).json({ success: true, updatedAlbum });
};

// Delete an album by ID
const deleteAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) throw new APIError("Album not found", 404);

  if (
    req.user.role == "user" &&
    album.owner.toString() !== req.user._id.toString()
  ) {
    throw new APIError("You are not authorized to delete this album", 403);
  }

  const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
  if (!deletedAlbum) throw new APIError("Album not found", 404);

  res.status(200).json({ success: true, deletedAlbum });
};

module.exports = {
  getAllAlbums,
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
