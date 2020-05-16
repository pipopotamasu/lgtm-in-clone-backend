import { User, UserDocument, ACCOUNT_ACTIVATION_EXPIRES_HOUR } from "@models/User";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import passport from "passport";
import { createTransporter } from "@config/nodemailer";
import { MAIL_SENDER, ENVIRONMENT } from "@util/secrets";
import { v4 as uuidv4 } from "uuid";
import { frontendOrigin } from "@config/app";
import { addHours, isAfter } from "date-fns";
/**
 * POST /login
 * Sign in using email and password.
 */
export const login = async (req: Request, res: Response) => {
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
      return res.status(200).json(user.response());
    });
  })(req, res);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = async (req: Request, res: Response) => {
  req.logout();
  return res.status(200).json();
};

/**
 * POST /signup
 * Create a new local account.
 */
export const signup = async (req: Request, res: Response) => {
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

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ errors: [{ msg: "Already exists user" }] });
    }

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ errors: [err] });
      }
      return res.status(201).json({ user: user.response() });
    });
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};

/**
 * POST /signup_with_mail_activation
 * Create a new local account.
 */
export const signupWithMailActivation = async (req: Request, res: Response) => {
  await check("email", "Email is not valid").isEmail().normalizeEmail().run(req);
  await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
  await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    activated: true,
    accountActivationToken: uuidv4(),
    activationTokenPublishedAt: new Date()
  });

  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ errors: [{ msg: "Already exists user" }] });
    }

    await user.save();

    const message = {
      from: MAIL_SENDER,
      to: user.email,
      subject: "Activation mail for lgtm.in clone",
      text: `Click here within 1 hour: ${frontendOrigin(ENVIRONMENT)}/account_activation?token=${user.accountActivationToken}`
    };

    createTransporter().sendMail(message, (err) => {
      if (err) {
        return res.status(500).json({ errors: [err] });
      }

      return res.status(201).json({ msgs: ["check your email address to activate your account"] });
    });
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};

/**
 * GET /account/activation
 * Activate user account.
 */
export const activateAccount = async (req: Request, res: Response) => {
  // activation tokenの取得
  const activationToken = req.query.activation_token;
  try {
    const user = await User.findOne({ accountActivationToken: activationToken, activated: false });

    if (!user) {
      return res.status(404).json({ errors: ["Does not exist user."] });
    }

    if (isAfter(user.activationTokenPublishedAt, addHours(new Date(), ACCOUNT_ACTIVATION_EXPIRES_HOUR))) {
      return res.status(401).json({ errors: ["Activation expired."] });
    }

    await user.update({ activated: true });

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};

/**
 * DELETE /account/delete
 * Delete user account.
 */
export const deleteAccount = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  try {
    await User.deleteOne({ _id: user.id });
    req.logout();
    return res.status(200).json({ msgs: ["Your account was deleted"] });
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
};
