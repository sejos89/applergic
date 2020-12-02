const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    ingredients: [{ type: String, required: true }],
    allergens: [{ type: mongoose.Types.ObjectId, ref: 'Allergen'}],
    picture: { type: String },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;