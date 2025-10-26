const express = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");

const router = express.Router();

// setting up param middleware, deleted this middleware in tourController.js
// router.param("id", checkID);

//localhost:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
// implementing a middleware to modify the query parameters to follow the above URL
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protect, getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
