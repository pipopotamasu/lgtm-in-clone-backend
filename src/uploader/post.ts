import multer from "multer";

const WHITE_LIST = ["png", "jpeg", "jpg", "gif"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/image");
  },
  filename: (_req, file, cb) => {
    const [ filename, extention ] = file.originalname.split(".");
    const imageName = `${filename}_${Date.now()}.${extention}`;
    cb(null, imageName);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const extention = file.originalname.split(".")[1];
    if (!WHITE_LIST.includes(extention)) {
      cb(new Error(`'${extention}' extension file can not be uploaded`));
    }
    cb(null, true);
  }
}).single("file");
