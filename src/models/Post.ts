import mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
  id: number;
  src: string;
  userId: number;
  upvoted: boolean;
  reported: boolean;
  bookmarked: boolean;
};

const postSchema = new mongoose.Schema({
  id: Number,
  src: String,
  userId: String, // TODO: fix as number
  upvoted: Boolean,
  reported: Boolean,
  bookmarked: Boolean
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", postSchema);
