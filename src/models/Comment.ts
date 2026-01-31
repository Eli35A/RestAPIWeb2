import mongoose, { Schema, InferSchemaType } from "mongoose";

const CommentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true },
  }
);

export type CommentDoc = InferSchemaType<typeof CommentSchema> & { _id: mongoose.Types.ObjectId };

export const CommentModel = mongoose.model("Comment", CommentSchema);
