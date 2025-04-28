import { Request } from "express";
import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: string | ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface ITraining extends Document {
  title: string;
  description: string;
  duration: number;
  date: Date;
  type: "cardio" | "strength" | "flexibility" | "other";
  user: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
  _id: string | ObjectId;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
