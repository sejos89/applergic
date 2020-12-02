require('dotenv').config();
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/applergic';
const mongoose = require('mongoose');

const Allergen = require('../models/Allergen');

//Para introducir alérgenos, eliminar los que hay en este array y meter nuevos.
/*allergens = [
  'Ácido benzoico',
  'Almendras',
  'Arroz',
  'Avellana',
  'Cacahuete',
  'Cacao',
  'Cereales',
  'Coco',
  'Crustáceos',
  'Fenilalanina',
  'Fibras',
  'Fresas',
  'Fructosa',
  'Frutas',
  'Frutos con cáscara',
  'Maíz',
  'Marisco',
  'Moluscos',
  'Mostaza',
  'Nueces',
  'Pescado',
  'Pistachos',
  'Plátano',
  'Rosáceas',
  'Sésamo',
  'Soja',
  'Sorbitol',
  'Altramuces',
  'Anacardo',
  'Apio',
  'Castaña',
  'Frutos rojos',
  'Gelatina',
  'Guisante',
  'Glucosa',
  'Gluten',
  'Huevo',
  'Kiwi',
  'Lactosa',
  'Leche',
  'Legumbres',
  'Lenteja',
  'Lino',
  'LTP',
  'Melocotón',
  'Piñones',
  'Sulfitos',
  'Tomate',
  'Trigo',
  'Uva',
  'Vitamina D',
  'Vitamina E',
  'Yuca',
];*/

seedAllergens = [];
for (let i = 0; i < allergens.length; i++) {
  const allergen = {
    name: allergens[i],
  };

  seedAllergens.push(allergen);
}

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);
    //descomentar esta línea si se quiere repoblar de nuevo la base de datos
    // await Allergen.deleteMany({});

    const allergenInstances = seedAllergens.map((allergen) => {
      return new Allergen(allergen);
    });

    await Allergen.insertMany(allergenInstances);
    console.log('All allergens inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
