import mongoose, { Schema, InferSchemaType } from "mongoose";

const PostSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true },
  }
);

export type PostDoc = InferSchemaType<typeof PostSchema> & { _id: mongoose.Types.ObjectId };

export const PostModel = mongoose.model("Post", PostSchema);
