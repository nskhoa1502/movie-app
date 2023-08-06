const express = require("express");

const router = express.Router();

const movieController = require("../controllers/movie");

// GET ==> Lấy trending movies
router.get("/trending", movieController.getMovieTrending);

// GET ==> Lấy top_rated movies
router.get("/top_rated", movieController.getMovieTopRated);

// GET ==> Lấy movie theo genre
router.get("/discover", movieController.getMovieFromGenre);

// GET ==> Lấy video trailer
router.get("/video", movieController.getVideoTrailer); // use router.get instead of router.post

// POST => Search theo từ khóa
router.post("/search", movieController.postSearchMovies);

module.exports = router;
