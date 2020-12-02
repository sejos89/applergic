const faker = require('faker');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');

// const db = require('../config/db');

const Rating = require('../models/Rating');

seedRating = [];
for (let i = 0; i < 50; i++) {
  const fakeRating = {
    rating: faker.random.number({ min: 1, max: 5 }),
    user: '0123456789ab',
  };

  seedRating.push(fakeRating);
}

console.log(seedRating);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);

    await Rating.deleteMany({});

    const ratingInstances = seedRating.map((rating) => {
      return new Rating(rating);
    });

    await Rating.insertMany(ratingInstances);
    console.log('All ratings inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
