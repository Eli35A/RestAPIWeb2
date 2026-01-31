import mongoose, { Schema, InferSchemaType } from "mongoose";

const RefreshTokenSchema = new Schema(
  {
    tokenIdHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 32, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    refreshTokens: { type: [RefreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel = mongoose.model("User", UserSchema);
