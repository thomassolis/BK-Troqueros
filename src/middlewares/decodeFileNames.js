// middlewares/decodeFileNames.js
export const decodeFileNames = (req, res, next) => {
  if (req.files) {
    for (const key in req.files) {
      const files = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];
      files.forEach(file => {
        try {
          file.name = Buffer.from(file.name, 'latin1').toString('utf8');
        } catch (err) {
          console.error('Error al corregir nombre de archivo:', err);
        }
      });
    }
  }
  next();
};
