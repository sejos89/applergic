const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const mongoose = require('mongoose');

const User = require('../models/User');

const router = express.Router();

const validateUser = require('../middlewares/validateUser.middleware');
const uploadImages = require('../middlewares/images.middleware');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middlewares/images.middleware');
const isAuth = require('../middlewares/isAuthenticated.middleware');
const passport = require('passport');
// const { isValidObjectId, Mongoose } = require('mongoose');
require('../config/passport');

//¿vamos a hacer el login con google o eliminamos esto?
// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );

// router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
//   res.status(200).redirect(process.env.CLIENT_URL || 'http://localhost:3000');
//   res.status(200).json({ data: req.user }); //esta línea borrar en producción
// });

// get all the properties of the user
router.get('/', [isAuth], (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .populate('allergens')
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// check if the email exists in the database before registering a new user
router.get('/checkUsername/:email', (req, res) => {
  const { email } = req.params;
  User.findOne({ email })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json(error.message));
});

// add a new user
router.post(
  '/register',
  [
    uploadImages.upload.single('image'),
    validateUser,
    uploadToCloudinary,
    passport.authenticate('register'),
  ],
  (req, res) => {
    res.status(200).json({ data: req.user });
  }
);

// login an existing user
router.post('/login', passport.authenticate('login'), (req, res) => {
  return res.status(200).json({ data: req.user });
});

// logout a logged user
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ data: 'OK' });
});

// delete an existing user
router.delete('/', isAuth, deleteFromCloudinary, (req, res) => {
  const { id } = req.user;

  User.findByIdAndRemove(id)
    .then((removedUser) => {
      res.status(200).json(removedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// edit an existing user
router.put(
  '/edit',
  [isAuth, deleteFromCloudinary, uploadImages.upload.single('image'), uploadToCloudinary],
  (req, res) => {
    const { id } = req.user;
    const body = JSON.parse(req.body.form);
    const image = req.file_url || null;

    const changes = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      image,
      allergens: body.allergens,
      emergencyContact: {
        name: body.emergency_name,
        phone: body.emergency_phone,
        email: body.emergency_email,
        insurance: {
          company: body.company,
          policy: body.policy,
        },
      },
    };
    // Si body.password es 0, '', false, undefined o null, no entra aquí
    if (body.password) {
      changes.password = bcrypt.hashSync(body.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    }

    const validChanges = {};

    Object.keys(changes).forEach((changeKey) => {
      if (changes[changeKey]) {
        validChanges[changeKey] = changes[changeKey];
      }
    });

    User.findByIdAndUpdate(id, validChanges, { new: true })
      .populate('allergens')
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  }
);

// get all diary items
router.get('/diary/:date', [isAuth], (req, res) => {
  const { id } = req.user;

  const { date } = req.params;

  const dateFrom = moment(new Date(date)).startOf('day').format();
  const dateTo = moment(new Date(date)).endOf('day').format();

  User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    { $unwind: '$diary' },
    {
      $match: {
        'diary.date': {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        },
      },
    },
    {
      $lookup: {
        from: 'foods',
        localField: 'diary.food',
        foreignField: '_id',
        as: 'diary.food',
      },
    },
    { $unwind: '$diary.food' },
    {
      $group: {
        _id: '$_id',
        emergencyContact: { $first: '$emergencyContact' },
        name: { $first: '$name' },
        phone: { $first: '$phone' },
        image: { $first: '$image' },
        allergens: { $first: '$allergens' },
        favorites: { $first: '$favorites' },
        isRated: { $first: '$isRated' },
        email: { $first: '$email' },
        password: { $first: '$password' },
        diary: { $addToSet: '$diary' },
        createdAt: { $first: '$createdAt' },
        updatedAt: { $first: '$updatedAt' },
        __v: { $first: '$__v' },
      },
    },
  ])
    .then((user) => res.status(200).json(user[0]))
    .catch((err) => res.status(500).json(err.message));
});

// add a diary item
router.put('/diary', [isAuth], (req, res) => {
  const { id } = req.user;
  const id_diary = req.body.id;

  const changes = { diary: { food: id_diary, date: Date.now() } };

  User.findByIdAndUpdate(id, { $push: changes }, { new: true })
    .populate('allergens')
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// delete item from user diary
router.put('/diary/delete', [isAuth], (req, res) => {
  const { id } = req.user;
  const itemDiaryID = req.body.id;

  const changes = { diary: { _id: itemDiaryID } };

  User.findByIdAndUpdate(id, { $pull: changes }, { new: true })
    .populate('allergens')
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// edit diary notes of a logged user
router.put('/diary/notes', [isAuth], (req, res) => {
  const { id } = req.user;
  const diary_id = req.body.diary_id;
  const note_value = req.body.note_value;

  const changes = { $set: { 'diary.$[item].notes': note_value } };

  User.findByIdAndUpdate(id, changes, { arrayFilters: [{ 'item._id': diary_id }], new: true })
    .populate('allergens')
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// get all favorite items
router.get('/favorites', [isAuth], (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .populate({ path: 'favorites', populate: { path: 'allergens' } })
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err.message));
});

// add a favorite item
router.put('/favorites', [isAuth], (req, res) => {
  const { id } = req.user;
  const { favorite } = req.body;

  const change = { favorites: favorite };

  User.findByIdAndUpdate(id, { $push: change }, { new: true })
    .populate('allergens')
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// delete item from user diary
router.put('/favorites/delete', [isAuth], (req, res) => {
  const { id } = req.user;
  const { favorite } = req.body;

  User.findByIdAndUpdate(id, { $pull: { favorites: favorite } }, { new: true })
    .populate('allergens')
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

// add property isRated to the user
router.put('/addRating', [isAuth], (req, res) => {
  const { id } = req.user;
  const isRated = req.body.isRated;

  const changes = { isRated: isRated };

  User.findByIdAndUpdate(id, changes, { new: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
