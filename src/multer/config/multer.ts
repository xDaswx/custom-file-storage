import multer from 'multer';

const upload = multer({
    dest: "public/media",
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter(req, file, callback) {
        const allowed = ['image/png','image/jpeg','video/mp4','image/gif']
        if (allowed.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido'))
            callback(null, false);
        }
    },
  });
  

export default upload