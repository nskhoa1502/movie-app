const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const paginate = require("../utils/paging");
const Video = require("../models/Video");

exports.getMovieTrending = (req, res, next) => {
  // Lấy số page từ frontend nếu có
  const page = req.query.page || 1;

  // Dùng fetchAll method để fetch movies
  Movie.fetchAll((movies) => {
    // Sort movies theo popularity
    const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);

    // Dùng helper function paginate trong utils để phân trang
    const paginatedResult = paginate(sortedMovies, page);

    // Trả status về frontend
    res.status(200).json({
      results: paginatedResult.results,
      page: paginatedResult.page,
      total_pages: paginatedResult.total_pages,
    });
  });
};

// Lấy movie top-rated, logic tương tự như trending nhưng sort theo vote_average thay vì theo popularity
exports.getMovieTopRated = (req, res, next) => {
  const page = req.query.page || 1;
  Movie.fetchAll((movies) => {
    const sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
    const paginatedResult = paginate(sortedMovies, page);
    res.status(200).json({
      results: paginatedResult.results,
      page: paginatedResult.page,
      total_pages: paginatedResult.total_pages,
    });
  });
};

// Lấy film theo genre
exports.getMovieFromGenre = (req, res, next) => {
  // request từ frontend sẽ có tham số genre (bắt buộc)
  const genreId = parseInt(req.query.genre);
  // Nếu không có thì trả về status 400
  if (!genreId) {
    res.status(400).json({ message: "Not found genre param" });
    return;
  }

  // Dùng method findById từ model Genre để tìm kiếm genre theo genreId trả về từ frontend
  Genre.findById(genreId, (foundGenre) => {
    // Nếu không có trong genreList.json => trả về status 400
    if (!foundGenre) {
      res.status(400).json({ message: "Not found that genre id" });
      return;
    }

    // Nhận tham số page từ frontend (optional)
    const page = req.query.page || 1;

    // Fetch danh sách movies trong movieList.json
    Movie.fetchAll((movies) => {
      // Filter theo genre, movie.genre_ids sẽ có dạng array nên dùng includes => trả về true nếu trong array có foundGenre.id
      const movieList = movies.filter((movie) =>
        movie.genre_ids.includes(foundGenre.id)
      );

      // Trả response về frontend bao gồm dữ liệu film theo genre, page, total_page, genre_name
      const paginatedResult = paginate(movieList, page);
      res.status(200).json({
        results: paginatedResult.results,
        page: paginatedResult.page,
        total_pages: paginatedResult.total_pages,
        genre_name: foundGenre.name,
        message: "Lấy dữ liệu thành công",
      });
    });
  });
};

// Fetch video trailer

exports.getVideoTrailer = (req, res, next) => {
  // console.log("getVideoTrailer called");

  // Convert movieId từ frontend thành string
  const movieId = String(req.query.film_id) || null;
  // console.log(movieId);

  // Nếu không có movieId => trả về status 400
  if (!movieId) {
    return res.status(400).json({ message: "Not found film_id param" });
  }

  // Dùng model Video để fetch video từ videoList.json
  Video.fetchAll((videos) => {
    // Tìm kiếm phim bằng cách so sánh id của frontend trả về với id trong videoList.json
    const movie = videos.find((video) => video.id.toString() === movieId);

    // Nếu không có thì sẽ trả về status 404
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Nếu có thì sẽ tiếp tục filter
    // => Video phải là official, site là Youtube, có video type là Trailer hoặc Teaser
    const validVideos = movie.videos.filter(
      (video) =>
        video.official &&
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
    );

    // Sort tất cả video theo published_at
    const sortedVideos = validVideos.sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );

    // Tìm kiếm trailer trong danh sách video
    const trailer = sortedVideos.find((video) => video.type === "Trailer");

    // Tìm kiếm teaser trong danh sách video
    const teaser = sortedVideos.find((video) => video.type === "Teaser");

    // Nếu video có trailer thì sẽ hiển thị trailer đầu tiên (do đã sort trước đó), nếu không có thì sẽ hiển thị teaser
    const finalVideo = trailer || teaser;

    // Nếu không có trailer thì sẽ trả về status 404
    if (!finalVideo) {
      res
        .status(404)
        .json({ message: "No trailer or teaser found for this movie" });
    } else {
      // Nếu có thì trả về status 200 cùng với object là finalVideo (bao gồm các thông tin từ video trong đó có cả key url)
      res
        .status(200)
        .json({ video: finalVideo, message: "Lấy dữ liệu thành công" });
    }
  });
};

// Hàm search movies
exports.postSearchMovies = (req, res, next) => {
  // Nhận về query là kết quả search từ frontend (bắt buộc)
  // Ngoài ra có thể nhận thêm các params khác như genre, mediaType, language, year
  const query = req.query.query;

  // console.log(query);

  // Nếu không có query thì trả về status 400
  if (!query) {
    return res.status(400).json({ message: "Not found keyword param" });
  }

  // Sau đó sẽ fetch tất cả movie bằng Movie model
  Movie.fetchAll((movies) => {
    // Sau đó sẽ filterMovies theo query, tất cả được convert thành lowerCase. Xét xem movie title và movie overview có từ khóa hay không
    let filteredMovies = movies.filter(
      (movie) =>
        (movie.title &&
          movie.title.toLowerCase().includes(query.toLowerCase())) ||
        (movie.overview &&
          movie.overview.toLowerCase().includes(query.toLowerCase()))
    );

    if (filteredMovies.length > 0) {
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        movies: filteredMovies,
      });
    } else {
      res.status(404).json({
        message: "Không có movie nào trùng với từ khóa và tiêu chí tìm kiếm",
      });
    }
  });
};
