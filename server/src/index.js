//importa librerías y archivos necesarios
require('dotenv').config(); //configurar dotenv para usar variables de entorno
require('./config/db'); //conexión a mongo
require('./config/passport');

const path = require('path');
const express = require('express');
const appRouter = require('./routes');
const passport = require('passport');
// const cors = require('cors'); //aceptar peticiones CORS

const cookieSession = require('cookie-session');

const server = express();
// server.use(cors({ origin: true, credentials: true }));

const buildPath = path.join(__dirname, '../..', 'build');

server.use(express.static(buildPath));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(
  cookieSession({
    maxAge: 1 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || 'express-auth-cookie'],
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use('/api', appRouter);

server.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//preguntar a Cristian qué es esto
// server.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening in http://localhost:${PORT}`);
});
