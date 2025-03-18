import { create } from "zustand";

type fieldState = {
  inputLabel: string;
  inputType: string;
};

interface StoreState {
  inputLabel: string;
  inputType: string;
  fields: fieldState[];
  setInputLabel: (inputLabel: string) => void;
  setInputType: (inputType: string) => void;
  setFields: (field: fieldState) => void;
  resetForm: () => void;
}

export const useStore = create<StoreState>((set) => ({
  inputLabel: "",
  inputType: "",
  fields: [],
  setInputLabel: (inputLabel: string) => set(() => ({ inputLabel })),
  setInputType: (inputType: string) => set(() => ({ inputType })),
  setFields: (field: fieldState) =>
    set((state) => ({ fields: [...state.fields, field] })),
  resetForm: () => set(() => ({ inputLabel: "", inputType: "", fields: [] })),
}));
