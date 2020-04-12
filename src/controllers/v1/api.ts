import { Response, Request } from "express";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (_req: Request, res: Response) => {
  return res.json("api root");
};
