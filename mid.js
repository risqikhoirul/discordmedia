const multer = require("multer");
require("dotenv").config();
const DiscordDatabase = require("discord-cloud-database");
const discordDatabase = new DiscordDatabase(process.env.TOKEN, { users: process.env.CHANNEL });
exports.multerMiddleware = (req, res, next) => {
  const multerStorage = multer.memoryStorage();
  return multer({
    storage: multerStorage,
  }).single("photo");
};
exports.uploadImageMiddleware = async (req, res, next) => {
  try {
    const file = req.file;
    const image = await discordDatabase.uploadFile(file.buffer, file.originalname, { name: "users" });
    req.image = image;
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteMiddleware = async (id, req, res, next) => {
  const image = await discordDatabase.deleteMessageById(id, { name: "users" });
  return image;
};
exports.getMiddleware = async (id, req, res, next) => {
  const get = await discordDatabase.findOne(id, { name: "users" });
  return get;
};
