const fs = require('fs');

/**
 * Dado el string del path de un archivo en nuestro server, lo borramos.
 * @param {string} path
 */
const deleteFile = (path) => fs.unlinkSync(path);

module.exports = deleteFile;
