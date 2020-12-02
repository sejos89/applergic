require('dotenv').config();
const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');

const Food = require('../models/Food');

//Si se quieren alimentos borrar los de este array y añadir nuevos. Ojo con el formato

/*seedRealFood = [
  {
    name: 'Oreo bañadas',
    brand: 'Oreo',
    ingredients: [
      'Azúcar',
      'harina de TRIGO',
      'grasa de palma',
      'grasa de shea',
      'cacao magro en polvo 4,5%',
      'aceite de nabina',
      'LECHE desnatada en polvo',
      'almidón de TRIGO',
      'lactosa',
      'jarabe de glucosa-fructosa',
      'emulgentes (lecitina de SOJA, E492, lecitina de girasol, E476)',
      'gasificantes (carbonatos de potasio, carbonatos de amonio, carbonatos de sodio)',
      'sal',
      'aromas',
    ],
    allergens: [
      '5fb593f6e54abd281e376371',
      '5fb593f6e54abd281e376375',
      '5fb593f6e54abd281e376367',
      '5fb593f6e54abd281e37635a',
    ],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605657783/applergic/foods/oreobanadas_sforlr.jpg',
  },
  {
    name: 'Crema de cacahuete',
    brand: 'Prozis',
    ingredients: ['Cacahuetes 100%'],
    allergens: ['5fb593f6e54abd281e37635c', '5fb593f6e54abd281e376352'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605658015/applergic/foods/cremacacahuete_zl4hr0.jpg',
  },
  {
    name: 'Mostaza Dijón',
    brand: 'Maille',
    ingredients: [
      'Agua',
      'semillas de mostaza',
      'vinagre de alcohol',
      'sal',
      'acidulante: ácido cítrico',
      'conservador: metabisulfito de potasio',
    ],
    allergens: ['5fb593f6e54abd281e376360'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605658399/applergic/foods/mostazadijon_u0rqqc.jpg',
  },
  {
    name: 'Risketos sabor original',
    brand: 'Risi',
    ingredients: [
      'Sémola de maíz',
      'aceite de girasol alto oleico (26,5%)',
      'aceite de girasol (9%)',
      'aroma de queso (suero de leche, maltodextrina, aroma, potenciador del sabor (E-621), colorante (extracto de pimentón))',
      'sal',
      ' emulgente (E-471)',
    ],
    allergens: ['5fb593f6e54abd281e376375'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605658525/applergic/foods/risketos_ivnlbl.jpg',
  },
  {
    name: 'Chimay bleue',
    brand: 'Chimay',
    ingredients: ['Agua', 'malta de cebada', 'trigo', 'azúcar', 'lúpulo', 'levadura'],
    allergens: ['5fb593f6e54abd281e376371'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605659113/applergic/foods/chimay-bleue_t4nwsp.jpg',
  },
  {
    name: 'Mascarpone',
    brand: 'Galbani',
    ingredients: [
      'Nata pasteurizada (leche)',
      'leche pasteurizada de vaca',
      'corrector de acidez (ácido cítrico)',
    ],
    allergens: ['5fb593f6e54abd281e376375'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605659629/applergic/foods/mascarpone_oyqyyy.jpg',
  },
  {
    name: 'Alpro Natural Coco',
    brand: 'Central Lechera Asturiana',
    ingredients: [
      'base de soja (agua, habas de soja descascarilladas (10,4%))',
      'leche de coco (4,3%) (crema de coco, agua)',
      'azúcar',
      'citrato tricálcico',
      'correctores de acidez (citratos de sodio, ácido cítrico)',
      'estabilizante (pectinas)',
      ' aroma natural',
      'sal marina',
      'vitaminas (B12, D)',
      'antioxidantes (extracto rico en tocoferoles, ésteres ácidos grasos de ácido ascórbico)',
      'fermentos (S. thermophilus, L. bulgaricus)',
    ],
    allergens: ['5fb593f6e54abd281e37635c', '5fb593f6e54abd281e376367'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605659900/applergic/foods/alprococo_ghqhc7.jpg',
  },
  {
    name: 'Concentrado de proteína de suero de leche sabor chocolate',
    brand: 'Prozis',
    ingredients: [
      'Concentrado de proteína de suero de leche ( contiene emulgente ( lecitina de girasol ) )',
      'matriz de aminoácidos ( monohidrato de creatina glicina taurina bcaa 2:1:1 ( l-leucina l-isoleucina l-valina ), l-glutamina )',
      'cacao magro en polvo complejo multienzimático digezyme® ( alfa-amilasa proteasa neutra celulasa lactasa lipasa )',
      'aromas creamer ( leche )',
      'espesantes ( goma guar goma xantana )',
      'edulcorantes ( acesulfamo k sucralosa )',
    ],
    allergens: [
      '5fb593f6e54abd281e376367',
      '5fb593f6e54abd281e376372',
      '5fb593f6e54abd281e376371',
      '5fb593f6e54abd281e376354',
    ],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605660243/applergic/foods/proteinawhey_wmvpbu.jpg',
  },
  {
    name: 'Mayonesa',
    brand: 'Hellmans',
    ingredients: [
      'Mayonesa: aceite de soja (64%)',
      'agua',
      'yema de huevo',
      'vinagre de vino blanco',
      'azúcar',
      'sal',
      'almidón modificado de maíz',
      'zumo de limón concentrado',
      'antioxidante (e385)',
      'aroma',
      'extracto natural de pimentón',
      'colorante (carotenos)',
    ],
    allergens: ['5fb593f6e54abd281e376367', '5fb593f6e54abd281e37635d', '5fb593f6e54abd281e376372'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605660449/applergic/foods/mayonesa_db0zhb.jpg',
  },
  {
    name: 'Espelta hinchada ecológica',
    brand: 'El Granero',
    ingredients: ['Espelta hinchada'],
    allergens: ['5fb593f6e54abd281e37635c', '5fb593f6e54abd281e376366', '5fb593f6e54abd281e376367'],
    picture:
      'https://res.cloudinary.com/applergic/image/upload/v1605660604/applergic/foods/espelta_bq0fgs.jpg',
  },
];*/

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log(`Connected to DB: ${DB_URL}`);

    // await Food.deleteMany({});

    const foodInstances = seedRealFood.map((food) => {
      return new Food(food);
    });

    await Food.insertMany(foodInstances);
    console.log('All foods inserted in DB');
  })
  .catch((err) => {
    console.log(`Error connecting to DB: ${err.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
