import mongoose from "mongoose";
import { PostBookmarkDocument } from "./PostBookmark";

export type PostDocument = mongoose.Document & {
  src: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  bookmarks: PostBookmarkDocument[],
  response: () => PostResponse;
};

type PostResponse = {
  id: string;
  userId: string;
  src: string;
  bookmarked: boolean;
  upvoted: boolean;
  reported: boolean;
}

const postSchema = new mongoose.Schema({
  src: String,
  userId: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostBookmark' }],
}, { timestamps: true });

postSchema.methods.response = function (this: PostDocument) {
  return {
    id: this.id,
    userId: this.userId,
    src: this.src,
    bookmarked: false,
    upvoted: false,
    reported: false
  };
};

export const Post = mongoose.model<PostDocument>("Post", postSchema);
