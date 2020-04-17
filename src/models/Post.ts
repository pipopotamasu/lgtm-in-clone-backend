import mongoose from "mongoose";
import { PostBookmarkDocument } from "./PostBookmark";
import { UserDocument } from "./User";

export type PostDocument = mongoose.Document & {
  src: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  bookmarks: PostBookmarkDocument[];
  response: (currentUser?: UserDocument) => PostResponse;
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
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostBookmark" }],
}, { timestamps: true });

postSchema.methods.response = function (this: PostDocument, currentUser?: UserDocument) {
  return {
    id: this.id,
    userId: this.userId,
    src: this.src,
    bookmarked: currentUser ? this.bookmarks.some(b => b.userId == currentUser.id) : false,
    upvoted: false,
    reported: false
  };
};

export const Post = mongoose.model<PostDocument>("Post", postSchema);
