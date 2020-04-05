"use strict";

import { Response, Request } from "express";
import { Post } from "@models/Post";

export const getPosts = async (req: Request, res: Response) => {
  const result = await Post.find();
  return res.status(200).json(result);
};
