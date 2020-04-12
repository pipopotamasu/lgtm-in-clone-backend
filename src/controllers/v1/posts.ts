"use strict";

import { Response, Request } from "express";
import { Post } from "@models/Post";
import { upload } from "@src/uploader/post";

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
