import mongoose from "mongoose";

export type PostBookmarkDocument = mongoose.Document & {
  userId: string;
  postId: string;
};

const postBookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});

postBookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const PostBookmark = mongoose.model<PostBookmarkDocument>("PostBookmark", postBookmarkSchema);
