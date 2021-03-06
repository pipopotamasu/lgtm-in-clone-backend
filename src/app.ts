import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";
import passport from "passport";
import cors from "cors";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import { config, frontendOrigin } from "./config/app";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as apiController from "./controllers/v1/api";
import * as postsController from "./controllers/v1/posts";
import * as usersController from "./controllers/v1/users";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch((err: any) => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || config.backend.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: frontendOrigin(),
  credentials: true
}));
app.use(express.static("public"));

app.get("/api/v1", apiController.getApi);
app.get("/api/v1/posts", postsController.getPosts);
app.get("/api/v1/posts/random", postsController.getPostRandom);
app.get("/api/v1/posts/:id", postsController.getPost);
app.post("/api/v1/posts/:id/bookmark", passportConfig.isAuthenticated, postsController.createBookmark);
app.delete("/api/v1/posts/:id/bookmark", passportConfig.isAuthenticated, postsController.deleteBookmark);
app.post("/api/v1/posts", passportConfig.isAuthenticated, postsController.createPost);
app.post("/api/v1/signup", usersController.signup);
app.get("/api/v1/current_user", passportConfig.isAuthenticated, usersController.currentUser);
// TODO: set your mail credentials
// app.post("/api/v1/signup_with_mail_activation", usersController.signupWithMailActivation);
// app.get("/api/v1/account/activation", usersController.activateAccount);
app.post("/api/v1/login", usersController.login);
app.get("/api/v1/logout", passportConfig.isAuthenticated, usersController.logout);
app.delete("/api/v1/account/delete", passportConfig.isAuthenticated, usersController.deleteAccount);

export default app;
