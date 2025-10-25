const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
//importing the signup controller
const { signup } = require("../controllers/authController");

const router = express.Router();

//setting up route for signup
router.post("/signup", signup);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
