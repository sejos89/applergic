const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    rating: { type: Number },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
