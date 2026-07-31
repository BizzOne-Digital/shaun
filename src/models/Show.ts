import { Schema, models, model, type InferSchemaType } from "mongoose";

const ShowSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortName: String,
    genre: { type: String, required: true },
    genres: { type: [String], default: [] },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    scheduleSummary: { type: String, default: "" },
    image: { type: String, default: "" },
    art: {
      from: String,
      to: String,
      accent: String,
      word: String,
      sub: String,
    },
    host: String,
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ShowDoc = InferSchemaType<typeof ShowSchema> & { _id: string };

export const ShowModel = models.Show || model("Show", ShowSchema);
