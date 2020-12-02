const express = require('express');

const Food = require('../models/Food');

const router = express.Router();

const isAuth = require('../middlewares/isAuthenticated.middleware');
const passport = require('passport');
require('../config/passport');

// get all foods (and populate them) Esta no sirve para nada, igual deberíamos cargárnosla.
router.get('/all', (req, res) => {
  Food.find()
    .populate('allergens')
    .then((food) => {
      return res.status(200).json(food);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});


// get a food by its id and populate it with the allergens
router.get('/:id', [isAuth], (req, res) => {
  const {id} = req.params;
  Food.findById(id)
    .populate('allergens')
    .then((food) => {
      res.status(200).send(food);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
