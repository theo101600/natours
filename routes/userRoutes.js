const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
//importing the signup and login controller
const { signup, login } = require("../controllers/authController");

const router = express.Router();

//setting up route for signup
router.post("/signup", signup);
//setting up route for login
router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
