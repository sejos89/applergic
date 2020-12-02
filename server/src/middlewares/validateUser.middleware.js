const deleteFile = require('../utils/delete-file');

const validateUser = (req, res, next) => {
  const { body, file } = req;

  const { email, password, form1 } = body;
  const { name } = JSON.parse(form1);

  if (!name || !email || !password) {
    // En caso de error borramos la imagen subida por el usuario en /public/uploads
    deleteFile(file.path);

    res.status(422).send('El nombre, email y contraseña son requeridos');
    return;
  }

  next();
};

module.exports = validateUser;
