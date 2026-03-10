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
      default: "#000000",
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
        title: {
          type: String,
          required: true,
        },
        description: String,
      },
    ],

    sectionVisibility: {
      education: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
