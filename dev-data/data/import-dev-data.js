const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`), "utf-8");

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data is successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// process.argv shows the arguments/commands inputted in the terminal
console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
