require('../config/passport');

const express = require('express');
const Rating = require('../models/Rating');
const router = express.Router();

const isAuth = require('../middlewares/isAuthenticated.middleware');

// add new rating
router.post('/', [isAuth], (req, res) => {
  const { id } = req.user;
  const newRating = new Rating({
    rating: parseInt(req.body.rating),
    user: id,
  });

  newRating
    .save()
    .then((storedRating) => {
      res.status(200).send(newRating);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

//esta ruta es solo una prueba para saber como funciona el populate, se podrá borrar
//quizá no, así se busca el rating de un usuario, solo que en ruta autenticada mejor
router.get('/', [isAuth], (req, res) => {
  const { id } = req.user;

  Rating.findOne({ user: id })
    .populate('user')
    .then((rating) => {
      return res.json(rating);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
