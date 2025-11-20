import { Schema } from 'mongoose';

export const submissionSchema = new Schema({
  userId: { type: String, required: true, index: true },

  form: { type: Number, required: true, index: true },

  answer1: { type: String, index: true },
  answer2: { type: String, index: true },
  answer3: { type: String, index: true },
  answer4: { type: String, index: true },

  submittedAt: { type: Date, default: Date.now },
});
