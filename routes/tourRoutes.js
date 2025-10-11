const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");

const router = express.Router();

// setting up param middleware, deleted this middleware in tourController.js
// router.param("id", checkID);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
