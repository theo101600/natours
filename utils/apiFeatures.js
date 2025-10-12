class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1 Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2 Advanced Filtering
    // converting the query object to string
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 3 Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      // adding multiple sort criteria: sort('price ratingsAverage')
      this.query = this.query.sort(sortBy);
    } else {
      //adding a default sort criteria
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 4 Field Limiting
    if (this.queryString.fields) {
      // getting fields string, formatting them separated with space
      const fields = this.queryString.fields.split(",").join(" ");
      // query = query.select("name duration difficulty price");
      this.query = this.query.select(fields);
    } else {
      // if no field is specified, remove the __v property (-)
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // 5 Pagination
    // page=2&limit=10, 1-10 -> page 1, 11-20 -> page 2...
    // query = query.skip(10).limit(10) we need to calculate the skip value based on the given page
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
