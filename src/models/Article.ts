import { Schema, models, model, type InferSchemaType } from "mongoose";

const ArticleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: "Station News" },
    date: { type: String, required: true },
    excerpt: { type: String, default: "" },
    readingTime: { type: String, default: "3 min read" },
    image: { type: String, default: "" },
    art: {
      from: String,
      to: String,
      word: String,
    },
    body: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ArticleDoc = InferSchemaType<typeof ArticleSchema> & { _id: string };

export const ArticleModel = models.Article || model("Article", ArticleSchema);
