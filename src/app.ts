import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";
import passport from "passport";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

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
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
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

app.get("/api/v1", apiController.getApi);
app.get("/api/v1/posts", postsController.getPosts);
app.post("/api/v1/signup", usersController.signup);
app.post("/api/v1/login", usersController.login);
app.get("/api/v1/logout", usersController.logout);
app.get("/api/v1/require_auth_path", passportConfig.isAuthenticated, apiController.getApi);

export default app;
