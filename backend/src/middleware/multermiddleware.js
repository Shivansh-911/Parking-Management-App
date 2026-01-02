import multer from "multer";


/*    Storing the files in the disk storage  */
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage,
}); 
*/

/*    Storing the files in the memory storage  */

const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
}); 

export const upload = multer({ 
  storage:storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});