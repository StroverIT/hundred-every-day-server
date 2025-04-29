import mongoose, { Schema } from "mongoose";
import { ITraining } from "../types";

const TrainingSchema: Schema = new Schema(
  {
    duration: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: () => new Date(Date.now()),
    },
    types: [
      {
        type: Schema.Types.ObjectId,
        ref: "TrainingType",
        default: [],
      },
    ],
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
