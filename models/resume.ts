// models/resume.ts
import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
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
      fullName: String,
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
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        startYear: String,
        endYear: String,
      },
    ],
    experience: [
      {
        jobTitle: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
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
        title: {
          type: String,
          required: true,
        },
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
