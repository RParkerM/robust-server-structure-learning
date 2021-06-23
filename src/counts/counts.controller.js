const counts = require("../data/counts-data");

function countExists(req, res, next) {
  const { countId } = req.params;
  const foundCount = counts[countId];
  if (foundCount === undefined) {
    next({ status: 404, message: `Count id not found: ${countId}` });
  } else {
    res.locals.count = foundCount;
    next();
  }
}

function read(req, res, next) {
  res.json({ data: res.locals.count }); // Return a JSON object, not a number.
}

function list(req, res) {
  res.json({ data: counts });
}

module.exports = {
  list,
  read: [countExists, read],
  countExists,
};
