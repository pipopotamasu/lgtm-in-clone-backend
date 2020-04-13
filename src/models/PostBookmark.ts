import mongoose from "mongoose";

export type PostBookmarkDocument = mongoose.Document & {
  userId: string;
  postId: string;
};

const postBookmarkSchema = new mongoose.Schema({
  userId: String,
  postId: String
});


export const PostBookmark = mongoose.model<PostBookmarkDocument>("PostBookmark", postBookmarkSchema);
