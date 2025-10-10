const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({
  path: './config.env',
});

//getting the connection string and replacing the password in it
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//pass in the database connection string
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

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

//making an instance of the Tour model
const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 497,
});

// saving it to the Tours collection
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error!', err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
