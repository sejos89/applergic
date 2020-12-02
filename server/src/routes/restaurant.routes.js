const express = require('express');
const Restaurant = require('../models/Restaurants');

const router = express.Router();

router.get('/:lngUp/:latUp/:lngDown/:latDown', (req, res) => {
  const {lngUp, latUp, lngDown, latDown} = req.params;

  Restaurant.find({
    $and: [
      { 'coordinates.0': { $gte: latUp, $lte: latDown } },
      { 'coordinates.1': { $gte: lngUp, $lte: lngDown } },
    ],
  })
    .populate('allergens')
    .then((restaurant) => res.status(200).send(restaurant))
    .catch((err) => res.status(500).json(err.message));
});

module.exports = router;
