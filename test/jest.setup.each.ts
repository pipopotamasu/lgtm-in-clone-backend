import mongoose from "mongoose";

beforeEach((done) => {
  Object.keys(mongoose.connection.collections).forEach((collection) => {
    mongoose.connection.collections[collection].deleteMany(() => done());
  });
});
