const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend"));

const { multerMiddleware, uploadImageMiddleware, deleteMiddleware, getMiddleware } = require("./mid");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

app.get("/", (req, res, next) => {
  res.status(200).sendFile(__dirname + "/frontend/");
});

app.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    try {
      const id = req.params.id;
      const view = await getMiddleware(id);
      // console.log(view);
      res.status(200).json({
        status: "success",
        data: view.attachments[0].proxy_url,
      });
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/",
  multerMiddleware(),
  uploadImageMiddleware,
  catchAsync(async (req, res, next) => {
    try {
      // kode untuk mengakses Discord Cloud Database
      res.status(200).json({
        status: "success",
        data: {
          image: req.image,
        },
      });
    } catch (error) {
      next(error);
    }
  })
);
app.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    try {
      const id = req.params.id;
      await deleteMiddleware(id);
      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  })
);

app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({
    status: "failed",
    message: err.message,
    stack: err.stack,
    errObj: err,
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server run on ${PORT}`));
