// models/User.ts
import  { Schema, Document, models, model } from 'mongoose';

interface IProfileExperience {
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  worksummary?: string;
}

interface IProfileEducation {
  degree?: string;
  universityName?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface IProfileProject {
  title: string;
  description?: string;
}

interface IProfileData {
  linkedInUrl?: string;
  githubUsername?: string;
  importedAt?: Date;
  experience: IProfileExperience[];
  education: IProfileEducation[];
  projects: IProfileProject[];
}

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  profileData?: IProfileData;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  imageUrl: { type: String },
  profileData: {
    linkedInUrl: { type: String },
    githubUsername: { type: String },
    importedAt: { type: Date },
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
    projects: [
      {
        title: String,
        description: String,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || model<IUser>('User', UserSchema);
