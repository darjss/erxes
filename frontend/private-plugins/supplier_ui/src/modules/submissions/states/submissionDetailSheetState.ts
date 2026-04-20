import { atom } from 'jotai';
import { ISubmission } from '../types';

export const submissionDetailSheetState = atom<ISubmission | null>(null);
