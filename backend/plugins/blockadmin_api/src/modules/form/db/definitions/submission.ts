import { Schema } from 'mongoose';

export const submissionSchema = new Schema({
  userId: { type: String, required: true },

  form: { type: Number, required: true },

  answer1: { type: String },
  answer2: { type: String },
  answer3: { type: String },
  answer4: { type: String },
  answer5: { type: String },
  answer6: { type: String },

  submittedAt: { type: Date, default: Date.now },
});
