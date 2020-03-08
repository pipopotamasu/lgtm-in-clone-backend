"use strict";

import { Response, Request } from "express";


/**
 * GET /api
 * List of API examples.
 */
export const getPosts = (req: Request, res: Response) => {
    res.json('get posts');
};
