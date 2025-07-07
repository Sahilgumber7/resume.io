import mongoose, { Schema, model, models, Document } from 'mongoose';

interface IResume extends Document {
  userClerkId: string;
  title: string;
  content: any; // stores ResumeData
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userClerkId: { type: String, required: true },
    title: { type: String, default: 'Untitled Resume' },
    content: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  { timestamps: true }
);

export default models.Resume || model<IResume>('Resume', ResumeSchema);
