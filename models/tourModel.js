const mongoose = require('mongoose');
//writing a schema type options
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    //specifying the error we want displayed when field is missing
    required: [true, 'A tour must have a name'],
    // we cant have tour documents with the same name
    unique: true,
  },
  rating: {
    type: Number,
    //setting default value for rating
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//making a model out of the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
