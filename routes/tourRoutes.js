const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
} = require("../controllers/tourController");

const router = express.Router();

// setting up param middleware, deleted this middleware in tourController.js
// router.param("id", checkID);

//localhost:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
// implementing a middleware to modify the query parameters to follow the above URL
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
