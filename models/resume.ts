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

    // Flattened basic info fields
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    jobTitle : {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    themeColor: {
      type: String,
    },

    summary: {
      type: String,
      default: "",
    },

    education: [
      {
        degree: String,
        universityName: String,
        major: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    experience: [
      {
        title: String,
        companyName: String,
        city: String,
        state: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        worksummary: String,
      },
    ],

    skills: [
      {
        name: String,
        rating: Number,
      },
    ],

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
