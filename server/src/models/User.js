const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true }, //este es el mail de registro
    password: { type: String, required: true }, //este es el password de registro
    phone: { type: Number, default: '' },
    image: { type: String, default: '' },
    googleID: { type: String },
    allergens: [{ type: mongoose.Types.ObjectId, ref: 'Allergen', default: [] }],
    favorites: [{ type: mongoose.Types.ObjectId, ref: 'Food', default: [] }],
    diary: [
      {
        food: { type: mongoose.Types.ObjectId, ref: 'Food' },
        date: { type: Date, default: Date.now },
        notes: { type: String, default: '' },
      },
    ],
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: Number, default: '' },
      email: { type: String, default: '' },
      insurance: {
        company: { type: String, default: '' },
        policy: { type: String, default: '' },
      },
    },
    isRated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    //elimina el password y el googleID para no enviarlo al front.
    toJSON: {
      // En el proceso de conversión de BSON a JSON, el objeto para por ret y podemos editarlo antes de que sea un JSON.
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.googleId;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
