import { create } from "zustand";

interface UseAPIProps {
    api: string | undefined,
    apiEmail: string | undefined,
    setAPI: (key: string) => void
};

const initialApiState = import.meta.env.VITE_API_LINK || "";
const initialApiStateEmail = import.meta.env.VITE_API_LINK_EMAIL || "";
export const useAPI = create<UseAPIProps>((set) => ({
    api: initialApiState,
    apiEmail: initialApiStateEmail,
    setAPI: async (key) => set({ api: key })
}));



