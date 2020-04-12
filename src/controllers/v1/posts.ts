"use strict";

import { Response, Request } from "express";
import { Post } from "@models/Post";
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

const upload = multer({
  storage
}).single('file')

export const getPosts = async (req: Request, res: Response) => {
  const result = await Post.find();
  return res.status(200).json(result);
};

export const createPost = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        error: "fail to uplord image"
      })
    }

    const post = new Post({
      userId: (req.user as any).id,
      src: res.req.file.filename
    })

    await post.save();

    return res.status(201).json({
      post: post.response()
    })
  })
};
