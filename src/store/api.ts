import { create } from "zustand";

interface UseAPIProps {
    api: string | undefined,
    setAPI: (key: string) => void
};

const initialApiState = import.meta.env.VITE_API_LINK || "";
console.log("initialApiState",initialApiState)
export const useAPI = create<UseAPIProps>((set) => ({
    api: initialApiState,
    setAPI: async (key) => set({ api: key })
}));

const initialApiState2 = import.meta.env.VITE_API_LINK2 || "";
console.log("initialApiState2",initialApiState2)
export const useAPI2 = create<UseAPIProps>((set) => ({
    api: initialApiState2,
    setAPI: async (key) => set({ api: key})
}));