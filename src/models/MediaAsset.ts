import { Schema, models, model, type InferSchemaType } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    alt: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type MediaAssetDoc = InferSchemaType<typeof MediaAssetSchema> & { _id: string };

export const MediaAsset = models.MediaAsset || model("MediaAsset", MediaAssetSchema);
