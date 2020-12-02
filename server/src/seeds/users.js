const faker = require('faker');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');

// const db = require('../config/db');

const User = require('../models/User');

seedUser = [];
for (let i = 0; i < 10; i++) {
  const fakeUser = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.random.number(),
    image: faker.image.imageUrl(),
    allergens: '0123456789ab',
    favorites: '0123456789ac',
    diary: [
      {
        food: '0123456789ad',
        date: faker.date.past(),
      },
    ],

    emergencyContact: {
      name: faker.name.firstName(),
      phone: faker.random.number(),
      email: faker.internet.email(),
      insurance: {
        company: faker.random.word(),
        policy: faker.random.number(),
      },
    },
  };

  seedUser.push(fakeUser);
}

console.log(seedUser);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);

    await User.deleteMany({});

    const userInstances = seedUser.map((user) => {
      return new User(user);
    });

    await User.insertMany(userInstances);
    console.log('All users inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
