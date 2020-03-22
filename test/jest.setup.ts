import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

mongoose.Promise = global.Promise;

mongoose.connect(process.env["MONGODB_URI_LOCAL"]);
mongoose.connection
  .once('open', () => { console.log('connected mongodb') })
  .on('error', (error) => {
    console.warn('Warning', error);
  });

beforeEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    // Ready to run the next test!
    done();
  });
});
