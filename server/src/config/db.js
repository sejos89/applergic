const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/applergic';

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    // console.log(`Connected to MongoDB: ${DB_URL}`);
    console.log(`Connected to MongoDB`)
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB. ${err.message}`);
  });
