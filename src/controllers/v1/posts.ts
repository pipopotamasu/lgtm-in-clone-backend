import { Response, Request } from "express";
import { Post } from "@models/Post";
import { upload } from "@src/uploader/post";

export const getPosts = async (_req: Request, res: Response) => {
  const result = await Post.find();
  return res.status(200).json(result);
};

export const createPost = async (req: Request, res: Response) => {
  upload(req, res, async (err: Error | undefined) => {
    if (err) {
      return res.status(500).json({
        errors: [err.message]
      });
    }

    const post = await Post.create({
      userId: (req.user as any).id,
      src: (res as any).req.file.filename
    });

    return res.status(201).json({
      post: post.response()
    });
  });
};
