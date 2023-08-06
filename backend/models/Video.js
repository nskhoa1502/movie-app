const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "videoList.json");

let videos = null;

module.exports = class Video {
  // Dùng để fetch danh sách các videos
  static fetchAll(cb) {
    if (videos) {
      // Return cached movie data if available
      cb(videos);
    } else {
      // Otherwise read from file and store in the variable
      fs.readFile(p, "utf8", (err, fileContent) => {
        if (err) {
          cb(null);
        } else {
          videos = JSON.parse(fileContent);
          cb(videos);
        }
      });
    }
  }
};
