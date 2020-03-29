import { User, UserDocument } from "@models/User";
import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import passport from "passport";

/**
 * POST /login
 * Sign in using email and password.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().normalizeEmail().run(req);
  await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  passport.authenticate("local", async (err: Error, user: UserDocument) => {
    if (err) { return res.status(500).json({ errors: [err] }); }
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "invalid account" }] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ errors: [err] });
      }
      return res.status(200).json({ user: user.response() });
    });
  })(req, res);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
  req.logout();
  return res.status(200);
};

/**
 * POST /signup
 * Create a new local account.
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  await check("email", "Email is not valid").isEmail().normalizeEmail().run(req);
  await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
  await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return res.status(500).json({ errors: [err] }); }
    if (existingUser) {
      return res.status(409).json({ errors: [{ msg: "Already exists user" }] });
    }
    user.save((err) => {
      if (err) { return res.status(500).json({ errors: [err] }); }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ errors: [err] });
        }
        return res.status(201).json({ user: user.response() });
      });
    });
  });
};

/**
 * DELETE /account/delete
 * Delete user account.
 */
export const deleteAccount = (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  User.remove({ _id: user.id }, (err) => {
    if (err) { return res.status(500).json({ errors: [err] }); }
    req.logout();
    return res.status(200).json({ msg: "Your account was deleted" });
  });
};
