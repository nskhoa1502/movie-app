const fs = require("fs");

const path = require("path");
const rootDir = require("../utils/path");

// Path của userToken.json
const p = path.join(rootDir, "data", "userToken.json");

const verifyToken = (req, res, next) => {
  fs.readFile(p, "utf8", (err, fileContent) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    const userTokens = JSON.parse(fileContent);

    // Token nhận được từ frontend (thông qua params token)
    const receivedToken = req.query.token;

    // Tìm kiếm token hợp lệ trong userToken.json
    const validToken = userTokens.find((user) => user.token === receivedToken);

    // Nếu frontend không trả về token hoặc không có token hợp lệ => 404
    if (!receivedToken || !validToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Đính kèm userId vào trong req để các middleware khác có thể truy cập vào userId
    req.userId = validToken.userId;

    next(); // Pass xuống middleware kế tiếp
  });
};

module.exports = verifyToken;
