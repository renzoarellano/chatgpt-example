import { create } from "zustand";

interface UseQueryProps {
    query: "QUERY" | "PROJECT REFINEMENT",
    setQuery: (query : 'QUERY' | 'PROJECT REFINEMENT') => void
};

const initialApiState = "QUERY"
export const useQuery = create<UseQueryProps>((set) => ({
    query: initialApiState,
    setQuery: async (query:"QUERY" | "PROJECT REFINEMENT") => set({ query })
}));