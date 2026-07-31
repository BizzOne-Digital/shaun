import { Schema, models, model, type InferSchemaType } from "mongoose";

const PageSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" },
    body: { type: String, default: "" },
    image: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    extra: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true },
);

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    path: { type: String, required: true },
    seoDescription: { type: String, default: "" },
    sections: { type: [PageSectionSchema], default: [] },
  },
  { timestamps: true },
);

export type PageSectionDoc = InferSchemaType<typeof PageSectionSchema>;
export type PageDoc = InferSchemaType<typeof PageSchema> & { _id: string };

export const Page = models.Page || model("Page", PageSchema);
