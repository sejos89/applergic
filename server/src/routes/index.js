const express = require('express');

const userRouter = require('./user.routes');
const ratingRouter = require('./rating.routes');
const foodRouter = require('./food.routes');
const allergenRouter = require('./allergen.routes');
const restaurantRouter = require('./restaurant.routes');

const router = express.Router();


router.get('/', (_req, res) => res.sendStatus(200));
// Nota del profesor: este _req es una forma de indicar que no se usar el req, no es javascript, es metodología personal
router.use('/user', userRouter);
router.use('/rating', ratingRouter);
router.use('/food', foodRouter);
router.use('/allergens', allergenRouter);
router.use('/restaurants', restaurantRouter);

module.exports = router;
