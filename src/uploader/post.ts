import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image')
  },
  filename: (req, file, cb) => {
    const [ filename, extention ] = file.originalname.split('.');
    const imageName = `${filename}_${Date.now()}.${extention}`
    cb(null, imageName)
  }
})

export const upload = multer({
  storage
}).single('file')
