const counts = require("../data/counts-data");

// app.use("/counts/:countId", (req, res, next) => {
//     const { countId } = req.params;
//     const foundCount = counts[countId];

//     if (foundCount === undefined) {
//       next({ status: 404, message: `Count id not found: ${countId}` });
//     } else {
//       res.json({ data: foundCount }); // Return a JSON object, not a number.
//     }
//   });

function list(req, res) {
  res.json({ data: counts });
}

module.exports = {
  list,
};
