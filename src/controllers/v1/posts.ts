import { Response, Request } from "express";
import { Post } from "@models/Post";
import { upload } from "@src/uploader/post";
import { calcPagination } from "@util/pagination";

const PAGE_LIMIT = 20;

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().skip(calcPagination(req.query.page, PAGE_LIMIT)).sort({ createdAt: "desc" }).limit(PAGE_LIMIT);
  return res.status(200).json({ posts: posts.map( p => p.response()) });
};

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ errors: ["Not found."] });
    }
    return res.status(200).json({ post: post.response() });
  } catch (e) {
    // NOTE: need a way to specify 404 error
    return res.status(404).json({ errors: ["Not found."] });
  }
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
