import { Response, Request } from "express";
import { Post } from "@models/Post";
import { UserDocument } from "@models/User";
import { PostBookmark } from "@models/PostBookmark";
import { upload } from "@src/uploader/post";
import { calcPagination } from "@util/pagination";

const PAGE_LIMIT = 20;

export const getPosts = async (req: Request, res: Response) => {
  const user = req.user as UserDocument | undefined;
  const posts = await Post.find()
    .populate({
      path: "bookmarks",
      match: { userId: user ? user.id : null }
    })
    .skip(calcPagination(req.query.page, PAGE_LIMIT))
    .sort({ createdAt: "desc" })
    .limit(PAGE_LIMIT);
  return res.status(200).json({ posts: posts.map( p => p.response(user)) });
};

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const user = req.user as UserDocument | undefined;

  try {
    const post = await Post.findById(postId).populate({
      path: "bookmarks",
      match: { userId: user ? user.id : null }
    });

    if (!post) {
      return res.status(404).json({ errors: ["Not found."] });
    }

    return res.status(200).json({ post: post.response(user) });
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

export const createBookmark = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json();
    }
    await PostBookmark.create({ userId: user.id, postId });

    return res.status(201).json();
  } catch (e) {
    // duplication error
    return res.status(201).json();
  }
};

export const deleteBookmark = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json();
    }

    await PostBookmark.findOneAndDelete({ userId: user.id, postId });

    return res.status(200).json();
  } catch (e) {
    return res.status(500).json({ errors: [e.message] });
  }
};

