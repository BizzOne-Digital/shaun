import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";

export const UPLOAD_FOLDERS = ["pages", "products", "gallery", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const StoredUploadSchema = new Schema(
  {
    folder: {
      type: String,
      enum: UPLOAD_FOLDERS,
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof StoredUploadSchema> & {
  _id: Types.ObjectId;
};

export const StoredUpload =
  models.StoredUpload || model("StoredUpload", StoredUploadSchema);
