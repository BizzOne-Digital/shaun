import { Schema, models, model, type InferSchemaType } from "mongoose";

const ScheduleBlockSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
    showSlug: { type: String, required: true },
    note: String,
    needsConfirmation: Boolean,
  },
  { _id: false },
);

const ScheduleSchema = new Schema(
  {
    key: { type: String, default: "weekly", unique: true },
    timezoneLabel: { type: String, default: "Philippine Time (GMT+8)" },
    week: {
      monday: { type: [ScheduleBlockSchema], default: [] },
      tuesday: { type: [ScheduleBlockSchema], default: [] },
      wednesday: { type: [ScheduleBlockSchema], default: [] },
      thursday: { type: [ScheduleBlockSchema], default: [] },
      friday: { type: [ScheduleBlockSchema], default: [] },
      saturday: { type: [ScheduleBlockSchema], default: [] },
      sunday: { type: [ScheduleBlockSchema], default: [] },
    },
  },
  { timestamps: true },
);

export type ScheduleDoc = InferSchemaType<typeof ScheduleSchema> & { _id: string };

export const ScheduleModel = models.Schedule || model("Schedule", ScheduleSchema);
