const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coordinates: [{ type: Number, required: true }],
  allergens: [{ type: mongoose.Types.ObjectId, ref: 'Allergen'}],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
