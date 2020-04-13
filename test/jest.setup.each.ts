import mongoose from "mongoose";

beforeEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    done();
  });

  mongoose.connection.collections.posts.drop(() => {
    done();
  });
});
