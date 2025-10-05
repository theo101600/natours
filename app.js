const fs = require('fs');
const express = require('express');
const app = express();

//adding a simple middleware
app.use(express.json());

//reading the contents of the tours-simple.json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//serving the data read, using the Jsent JSON formating standard
//use versioning for api endpoints
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//adding a route handler for getting one tour
app.get('/api/v1/tours/:id', (req, res) => {
  //req.params gives the parameters from the url
  console.log(req.params);

  //searching for the specific tour with matching ID
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour,
    },
  });
});

//adding a post request handler
app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  //figuring out the ID of the new object, getting the id of the last one in the array then adding 1
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

//starting the server
//.listen(<port>, <callback function>)
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
