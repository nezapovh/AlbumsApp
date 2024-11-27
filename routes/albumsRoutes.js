const albumsRouter = require("express").Router();
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getAllAlbums,
  getAlbums,
  getAlbum,
  createAlbum,
  deleteAlbum,
  updateAlbum,
} = require("../controllers/albumsController");

albumsRouter
  .route("/")
  .get(isAuthenticated, authorizeRoles(["admin", "user"]), getAlbums)
  .post(isAuthenticated, authorizeRoles(["admin", "user"]), createAlbum);

albumsRouter.route("/getAllAlbums").get(getAllAlbums);

albumsRouter
  .route("/:id")
  .get(isAuthenticated, authorizeRoles(["admin", "user"]), getAlbum)
  .put(isAuthenticated, authorizeRoles(["admin"]), updateAlbum)
  .delete(isAuthenticated, authorizeRoles(["admin", "user"]), deleteAlbum);

module.exports = albumsRouter;
