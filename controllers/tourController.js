const Tour = require("../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  //localhost:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //Building the query
    // making a hard copy
    // 1 Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2 Advanced Filtering
    // converting the query object to string
    let queryStr = JSON.stringify(queryObj);
    //{ duration: { $gte: 5 }, difficulty: 'easy'} <- filter object in mongoshell
    //{ duration: { gte: '5' }, difficulty: 'easy' } <- console.log(req.query)

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 3 Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // adding multiple sort criteria: sort('price ratingsAverage')
      query = query.sort(sortBy);
    } else {
      //adding a default sort criteria
      query = query.sort("-createdAt");
    }

    // 4 Field Limiting
    if (req.query.fields) {
      // getting fields string, formatting them separated with space
      const fields = req.query.fields.split(",").join(" ");
      // query = query.select("name duration difficulty price");
      query = query.select(fields);
    } else {
      // if no field is specified, remove the __v property (-)
      query = query.select("-__v");
    }

    // 5 Pagination
    // page=2&limit=10, 1-10 -> page 1, 11-20 -> page 2...
    // query = query.skip(10).limit(10) we need to calculate the skip value based on the given page
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      // throwing new Error() automatically calls the .catch method
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    //Executing the query
    const tours = await query;

    //Sending the response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    //Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // This is the old method:
    // const newTour = new Tour({});
    // newTour.save()

    // New method:
    // using async/await
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findOneAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
