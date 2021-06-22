const express = require("express");
const app = express();

const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({ status: 404, message: `Count id not found: ${countId}` });
  } else {
    res.json({ data: foundCount }); // Return a JSON object, not a number.
  }
});

app.use("/counts", countsRouter);

app.use("/flips", flipsRouter);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
