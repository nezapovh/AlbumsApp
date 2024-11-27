const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Album = require("../models/album");

const api = supertest(app);

let sessionCookie;

beforeAll(async () => {
  // Log in to get the session cookie
  const loginResponse = await api
    .post("/api/auth/login")
    .send({ username: "test@tests.com", password: "12345" })
    .expect(200);

  sessionCookie = loginResponse.headers["set-cookie"];
});

describe("Album GET Routes tests", () => {
  let initialAlbumCount;

  beforeEach(async () => {
    initialAlbumCount = await Album.countDocuments();
  });

  test("Retrieves all albums", async () => {
    const response = await api
      .get("/api/albums")
      .set("Cookie", sessionCookie)
      .expect(200);

    expect(response.body.data).toHaveLength(initialAlbumCount);
  });
});

describe("Album POST routes tests", () => {
  let initialAlbumCount;

  beforeEach(async () => {
    initialAlbumCount = await Album.countDocuments();
  });

  test("Adds a new album", async () => {
    const newAlbum = {
      artist: "New Artist",
      title: "New Album",
      year: 2024,
      genre: "Rock",
      tracks: ["Track 1", "Track 2"],
    };

    const response = await api
      .post("/api/albums")
      .set("Cookie", sessionCookie)
      .send(newAlbum)
      .expect(201);

    const addedAlbum = response.body.newAlbum;
    expect(addedAlbum).toMatchObject(newAlbum);

    const updatedAlbumCount = await Album.countDocuments();
    expect(updatedAlbumCount).toBe(initialAlbumCount + 1);
  });
});

describe("Album DELETE routes tests", () => {
  let testAlbum;
  let initialAlbumCount;

  beforeEach(async () => {
    // Create a test album
    const response = await api
      .post("/api/albums")
      .set("Cookie", sessionCookie)
      .send({
        artist: "Test Artist",
        title: "Test Album",
        year: 2024,
        genre: "Pop",
        tracks: ["Test Track"],
      })
      .expect(201);

    testAlbum = response.body.newAlbum;
    initialAlbumCount = await Album.countDocuments();
  });

  afterEach(async () => {
    // Clean up after each test
    await Album.findByIdAndDelete(testAlbum._id);
  });

  test("Deletes an album successfully", async () => {
    await api
      .delete(`/api/albums/${testAlbum._id}`)
      .set("Cookie", sessionCookie)
      .expect(200);

    const updatedAlbumCount = await Album.countDocuments();
    expect(updatedAlbumCount).toBe(initialAlbumCount - 1);

    const deletedAlbum = await Album.findById(testAlbum._id);
    expect(deletedAlbum).toBeNull();
  });

  test("Handles deletion of a non-existent album gracefully", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await api
      .delete(`/api/albums/${fakeId}`)
      .set("Cookie", sessionCookie)
      .expect(404); // Expect 404 for non-existent album

    // Verify the error message
    expect(response.body).toMatchObject({
      msg: "Album not found",
    });

    // Ensure the album count remains unchanged
    const albumCount = await Album.countDocuments();
    expect(albumCount).toBe(initialAlbumCount);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
