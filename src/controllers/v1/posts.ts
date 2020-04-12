"use strict";

import { Response, Request } from "express";
import { Post } from "@models/Post";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image')
  },
  filename: (req, file, cb) => {
    const imageName = `${Math.random().toString(36).slice(-9)}_${Date.now()}.png`
    cb(null, imageName)
  }
})

const upload = multer({
  storage
}).single('file')

export const getPosts = async (req: Request, res: Response) => {
  const result = await Post.find();
  return res.status(200).json(result);
};

export const createPost = async (req: Request, res: Response) => {
  upload(req, res, (err) => {
    console.log()
    if (err) {
      return res.status(500).json({
        error: "fail to uplord image"
      })
    }

    return res.status(201).json({
      path: res.req.file.filename
    })
  })
};
