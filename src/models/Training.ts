import mongoose, { Schema } from "mongoose";
import { ITraining } from "../types";

const TrainingSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a training title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    duration: {
      type: Number,
      required: [true, "Please provide duration in minutes"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    type: {
      type: String,
      enum: ["cardio", "strength", "flexibility", "other"],
      default: "other",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Training = mongoose.model<ITraining>("Training", TrainingSchema);

export default Training;
