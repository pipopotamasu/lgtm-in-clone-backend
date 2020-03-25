import mongoose from "mongoose";

module.exports = async () => {
  mongoose.Promise = global.Promise;

  mongoose.connection
    .once("open", () => { console.log("connected mongodb"); })
    .on("error", (error) => {
      console.warn("Warning", error);
    });
};
