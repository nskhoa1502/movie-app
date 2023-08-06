const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "genreList.json");

module.exports = class Genre {
  // Dùng để fetch danh sách các Genre
  static fetchAll(cb) {
    fs.readFile(p, "utf8", (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        const genres = JSON.parse(fileContent);
        cb(genres);
      }
    });
  }

  // Dùng để fetch genre theo Id
  static findById(id, cb) {
    fs.readFile(p, "utf8", (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        const genres = JSON.parse(fileContent);
        const foundGenre = genres.find((genre) => genre.id === id);
        cb(foundGenre);
      }
    });
  }
};
