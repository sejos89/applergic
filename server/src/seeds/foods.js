const faker = require('faker');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');

const Food = require('../models/Food');

seedFood = [];
for (let i = 0; i < 10; i++) {
  const fakeFood = {
    name: faker.random.word(),
    ingredients: faker.random.words(),
    allergens: '0123456789ab',
    qrCode: faker.random.uuid(),
  };

  seedFood.push(fakeFood);
}

console.log(seedFood);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);

    await Food.deleteMany({});

    const foodInstances = seedFood.map((food) => {
      return new Food(food);
    });

    await Food.insertMany(foodInstances);
    console.log('All foods inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
