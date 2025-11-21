import { Schema } from 'mongoose';

export const submissionSchema = new Schema({
  email: { type: String, required: true, index: true },
  name: { type: String, index: true },
  phone: { type: String, index: true },
  answer1: { type: String, index: true },
  answer2: { type: String, index: true },
  answer3: { type: String, index: true },
  answer4: { type: String, index: true },
  answer5: { type: String, index: true },
  answer6: { type: String, index: true },
  submittedAt: { type: Date, default: Date.now },
});
