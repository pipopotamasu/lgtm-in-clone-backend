import { User } from "@models/User";
import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
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
      return res.status(409).json({ errors: [{ msg: "already exists user" }] });
    }
    user.save((err) => {
      if (err) { return res.status(500).json({ errors: [err] }); }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ errors: [err] });
        }
        return res.status(201).json({ user });
      });
    });
  });
};
