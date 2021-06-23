const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

function resultPropertyIsValid(req, res, next) {
  const { data: { result } = {} } = req.body;
  const validResult = ["heads", "tails", "edge"];
  if (validResult.includes(result)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
  });
}

function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
}

function flipExists(req, res, next) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    res.locals.flip = foundFlip;
    return next();
  }
  next({
    status: 404,
    message: `Flip id not found: ${flipId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.flip });
}

function create(req, res) {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1; // Increment the counts
  res.status(201).json({ data: newFlip });
}

function update(req, res) {
  const flip = res.locals.flip;

  const originalResult = flip.result;
  const { data: { result } = {} } = req.body;

  if (originalResult !== result) {
    flip.result = result;
    counts[originalResult]--;
    counts[result]++;
  }
  res.json({ data: flip });
}

function destroy(req, res) {
  const { flipId } = req.params;
  const index = flips.findIndex((flip) => flip.id === Number(flipId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedFlips = flips.splice(index, 1);
  deletedFlips.forEach(
    (deletedFlip) =>
      (counts[deletedFlip.result] = counts[deletedFlip.result] - 1)
  );

  res.sendStatus(204);
}

function list(req, res) {
  const { countId } = req.params;
  const byResult = countId ? (flip) => flip.result === countId : () => true;
  res.json({ data: flips.filter(byResult) });
}

module.exports = {
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
  read: [flipExists, read],
  update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
  list,
  delete: [flipExists, destroy],
};
