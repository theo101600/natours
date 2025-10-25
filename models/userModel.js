const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    trim: true,
    validate: {
      validator: (v) => validator.isAlpha(v, "en-US", { ignore: " " }),
      message: "Name must only contain letters and spaces",
    },
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true,
    minlength: [8, "Password must be longer than 8 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password"],
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
