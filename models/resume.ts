import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEducation {
  degree: string;
  institution: string;
  startYear?: string;
  endYear?: string;
}

export interface IExperience {
  jobTitle: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface IProject {
  title: string;
  description?: string;
}

export interface IBasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface IResume extends Document {
  userClerkId: string;
  title: string;
  basicInfo: IBasicInfo;
  summary: string;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  projects: IProject[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema<IResume>(
  {
    userClerkId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    basicInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
    },
    summary: {
      type: String,
      default: "",
    },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startYear: String,
        endYear: String,
      },
    ],
    experience: [
      {
        jobTitle: { type: String, required: true },
        company: { type: String, required: true },
        duration: String,
        description: String,
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    projects: [
      {
        title: { type: String, required: true },
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default models.Resume || model<IResume>("Resume", ResumeSchema);
