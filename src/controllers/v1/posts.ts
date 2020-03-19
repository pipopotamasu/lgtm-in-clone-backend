"use strict";

import { Response, Request } from "express";
import { Post } from "@models/Post";

export const getPosts = (req: Request, res: Response) => {
    Post.find((err, result) => {
        console.log(11111, result)
        res.json(result);
    });
};
