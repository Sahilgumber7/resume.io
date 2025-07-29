import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userClerkId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    basicInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    skills: [String],
    summary: String,
    projects: [
      {
        title: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
