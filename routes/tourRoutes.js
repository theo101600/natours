const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
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
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// setting up param middleware, deleted this middleware in tourController.js
// router.param("id", checkID);

//localhost:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
// implementing a middleware to modify the query parameters to follow the above URL

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
