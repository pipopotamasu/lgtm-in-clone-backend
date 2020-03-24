"use strict";

import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../../models/User";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
  return res.json("api root");
};
