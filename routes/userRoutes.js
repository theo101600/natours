const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require("../controllers/userController");
//importing the signup and login controller
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// All the routes after this line will be protected
router.use(protect);

router.get("/me", getMe, getUser);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

// Only let an administrator accesss these routes
router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
