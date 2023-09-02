const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
		.then((dbTransaction) => {
			res.json(dbTransaction);
		})
		.catch((err) => {
			next(err);
		});
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      err.status = 404;
      next(err);
    });
});

module.exports = router;