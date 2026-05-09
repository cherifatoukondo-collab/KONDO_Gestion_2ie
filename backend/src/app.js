const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "API backend operationnelle" });
});

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
