import { Schema, models, model, type InferSchemaType } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    name: { type: String, default: "Monsterous Radio" },
    tagline: { type: String, default: "" },
    heroHeadline: { type: String, default: "" },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "/brand/logo.png" },
    mascotUrl: { type: String, default: "/brand/monster.png" },
    contact: {
      phone: String,
      phoneHref: String,
      email: String,
      emailAlt: String,
      hoursLabel: String,
      locationLabel: String,
    },
    social: {
      facebook: String,
      website: String,
    },
    mediaKitUrl: { type: String, default: "/documents/monsterous-radio-media-kit.pdf" },
    mediaKitAvailable: { type: Boolean, default: false },
    showAdvertisingPrices: { type: Boolean, default: false },
    genres: { type: [String], default: [] },
    stats: {
      type: [
        {
          value: String,
          label: String,
          numeric: { type: Number, default: null },
          suffix: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema> & { _id: string };

export const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
