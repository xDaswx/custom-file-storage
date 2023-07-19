import multer from 'multer';

function uniqueID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueID = '';
  
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueID += characters[randomIndex];
    }
  
    return uniqueID;
  }

const storage = multer.diskStorage({
    destination: 'public/media',
    filename: function (req, file, callback) {
      const uniqueFilename = uniqueID() + file.originalname
      callback(null, uniqueFilename);
    },
  });
  

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 30
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