const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "movieList.json");

// Tạo cache cho movies
let movies = null;

module.exports = class Movie {
  static fetchAll(cb) {
    if (movies) {
      // Trả về data được cache nếu có
      cb(movies);
    } else {
      // Nếu không có cache thì sẽ đọc file movieList.json
      fs.readFile(p, "utf8", (err, fileContent) => {
        if (err) {
          cb(null);
        } else {
          movies = JSON.parse(fileContent);
          cb(movies);
        }
      });
    }
  }
};
