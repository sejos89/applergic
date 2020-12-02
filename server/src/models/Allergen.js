const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const allergenSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
);

const Allergen = mongoose.model('Allergen', allergenSchema);
module.exports = Allergen;
