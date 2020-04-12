import multer from "multer";

const WHITE_LIST = ["png", "jpeg", "jpg", "gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/image");
  },
  filename: (req, file, cb) => {
    const [ filename, extention ] = file.originalname.split(".");
    const imageName = `${filename}_${Date.now()}.${extention}`;
    cb(null, imageName);
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const [ _filename, extention ] = file.originalname.split(".");
    if (!WHITE_LIST.includes(extention)) {
      cb(new Error(`'${extention}' extension file can not be uploaded`));
    }
    cb(null, true);
  }
}).single("file");
