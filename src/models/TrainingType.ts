import mongoose, { Schema } from "mongoose";
import { ITrainingType } from "../types";

const TrainingTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a training type name"],
    },
    type: {
      type: String,
      enum: ["cardio", "strength", "flexibility", "other"],
      default: "other",
    },
    repetitions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TrainingType = mongoose.model<ITrainingType>(
  "TrainingType",
  TrainingTypeSchema
);

export default TrainingType;
