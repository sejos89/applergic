const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads'));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
      cb(new Error('Tipo de archivo inválido'));
    } else {
      cb(null, true);
    }
  },
});

const uploadToCloudinary = async (req, res, next) => {
  if (req.file) {
    const filePath = req.file.path;
    const image = await cloudinary.uploader.upload(filePath);

    fs.unlinkSync(filePath);

    req.file_url = image.secure_url;
    return next();
  } else {
    return next();
  }
};

const deleteFromCloudinary = async (req, res, next) => {
  if (req.user.image) {
    const { image } = req.user;
    const public_id = image.substr(image.lastIndexOf('/') + 1).split('.')[0];
    await cloudinary.uploader.destroy(public_id, (res, err) => console.log(res, err));
    return next();
  }
  return next();
};

module.exports = { upload: upload, deleteFromCloudinary, uploadToCloudinary };
