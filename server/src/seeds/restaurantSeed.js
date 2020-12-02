require('dotenv').config();
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/applergic';
const mongoose = require('mongoose');
const faker = require('faker');

const Restaurant = require('../models/Restaurants');

const getRandomPoint = (from, to, fixed) => {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
};

const restaurantsQuantity = 3000;
const getRandomAllergens = () => Math.floor(Math.random() * 5);

allergens = [
  '5fb593f6e54abd281e37634e',
  '5fb593f6e54abd281e37634f',
  '5fb593f6e54abd281e376350',
  '5fb593f6e54abd281e376351',
  '5fb593f6e54abd281e376352',
  '5fb593f6e54abd281e376353',
  '5fb593f6e54abd281e376354',
  '5fb593f6e54abd281e376355',
  '5fb593f6e54abd281e376356',
  '5fb593f6e54abd281e376357',
  '5fb593f6e54abd281e376358',
  '5fb593f6e54abd281e376359',
  '5fb593f6e54abd281e37635a',
  '5fb593f6e54abd281e37635b',
  '5fb593f6e54abd281e37635c',
  '5fb593f6e54abd281e37635d',
  '5fb593f6e54abd281e37635e',
  '5fb593f6e54abd281e37635f',
  '5fb593f6e54abd281e376360',
  '5fb593f6e54abd281e376361',
  '5fb593f6e54abd281e376362',
  '5fb593f6e54abd281e376363',
  '5fb593f6e54abd281e376364',
  '5fb593f6e54abd281e376365',
  '5fb593f6e54abd281e376366',
  '5fb593f6e54abd281e376367',
  '5fb593f6e54abd281e376368',
  '5fb593f6e54abd281e376369',
  '5fb593f6e54abd281e37636a',
  '5fb593f6e54abd281e37636b',
  '5fb593f6e54abd281e37636c',
  '5fb593f6e54abd281e37636d',
  '5fb593f6e54abd281e37636e',
  '5fb593f6e54abd281e37636f',
  '5fb593f6e54abd281e376370',
  '5fb593f6e54abd281e376371',
  '5fb593f6e54abd281e376372',
  '5fb593f6e54abd281e376373',
  '5fb593f6e54abd281e376374',
  '5fb593f6e54abd281e376375',
  '5fb593f6e54abd281e376376',
  '5fb593f6e54abd281e376377',
  '5fb593f6e54abd281e376378',
  '5fb593f6e54abd281e376379',
  '5fb593f6e54abd281e37637a',
  '5fb593f6e54abd281e37637b',
  '5fb593f6e54abd281e37637c',
  '5fb593f6e54abd281e37637d',
  '5fb593f6e54abd281e37637e',
  '5fb593f6e54abd281e37637f',
  '5fb593f6e54abd281e376380',
  '5fb593f6e54abd281e376381',
  '5fb593f6e54abd281e376382',
];

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

seedRestaurant = [];

for (let i = 0; i < restaurantsQuantity; i++) {
  const latitude = getRandomPoint(37.5, 43.5, 6);
  const longitude = getRandomPoint(-9.0, -1.5, 6);
  const random = getRandomAllergens();
  shuffle(allergens);
  const allergensEnd = [];
  for (let i = 0; i < random; i++) {
    allergensEnd.push(allergens[i]);
  }

  const fakeRestaurant = {
    name: faker.random.word(),
    coordinates: [latitude, longitude],
    allergens: allergensEnd,
  };
  seedRestaurant.push(fakeRestaurant);
}

console.log(seedRestaurant);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);

    await Restaurant.deleteMany({});

    const restaurantInstances = seedRestaurant.map((restaurant) => {
      return new Restaurant(restaurant);
    });

    await Restaurant.insertMany(restaurantInstances);
    console.log('All restaurants inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
