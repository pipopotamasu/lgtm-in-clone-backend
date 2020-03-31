import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    activated: boolean;
    accountActivationToken: string;

    comparePassword: comparePasswordFunction;
    response: () => UserResponse;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

type UserResponse = {
  id: string;
  email: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, default: '' },
  passwordResetToken: String,
  passwordResetExpires: Date,
  activated: {
    type: Boolean,
    default: false
  },
  accountActivationToken: {
    type: String,
    default: ''
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

userSchema.methods.comparePassword = comparePassword;

userSchema.methods.response = function (this: UserDocument) {
  return {
    id: this.id,
    email: this.email
  };
};

export const User = mongoose.model<UserDocument>("User", userSchema);
