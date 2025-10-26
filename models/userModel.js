const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password"],
    validate: {
      // This only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Password mismatch",
    },
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
