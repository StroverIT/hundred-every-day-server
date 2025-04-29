import { Request } from "express";
import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  _id: string | ObjectId;
}

export interface ITraining extends Document {
  duration: number;
  date: Date;
  types: ITrainingType[] | ObjectId[];
  user: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
  _id: string | ObjectId;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ITrainingType extends Document {
  name: string;
  type: "cardio" | "strength" | "flexibility" | "other";
  repetitions: number;
  _id: string | ObjectId;
}
