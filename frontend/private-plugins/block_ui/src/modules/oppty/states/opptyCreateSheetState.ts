import { atom } from 'jotai';
import { IOpptyInput } from '@/oppty/types/opptyTypes';

export const opptyCreateSheetState = atom(false);
export const opptyCreateDefaultValuesState = atom<
  Partial<IOpptyInput> | undefined
>(undefined);
