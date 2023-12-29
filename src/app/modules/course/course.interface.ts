/* eslint-disable @typescript-eslint/ban-types */
import { Model, Types } from 'mongoose';

export type TTags = { name: string; isDeleted: boolean };
export type TDetails = {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
};

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: Array<TTags>;
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: TDetails;
  createdBy?: Types.ObjectId;
};

export type TCourseMethod = {
  isExists(id: string): Promise<boolean>;
};

export type TCourseModel = Model<TCourse, Record<string, never>, TCourseMethod>;
