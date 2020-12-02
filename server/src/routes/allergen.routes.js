const express = require('express');

const Allergen = require('../models/Allergen');

const router = express.Router();

const isAuth = require('../middlewares/isAuthenticated.middleware');

//get all allergens
router.get('/', (req, res) => {
  Allergen.find()
    .then((allergens) => {
      return res.status(200).send(allergens);
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
});

module.exports = router;
