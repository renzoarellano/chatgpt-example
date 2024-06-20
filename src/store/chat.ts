import { create } from "zustand";
import { v4 } from 'uuid';
import store from "store2";

export interface UseChatProps {
    chat: Chat[],
    isQuestion: boolean,
    selectedChat: Chat,
    setChat: (payload: Chat) => void,
    setQuestion: (question: boolean) => void,
    addChat: (callback?: (id: string) => void,query?:"QUERY" | "PROJECT REFINEMENT") => void,
    setQueryPerChat: (id:string, query:"QUERY" | "PROJECT REFINEMENT") => void;
    editChat: (id: string, payload: Partial<Chat>) => void,
    addMessage: (id: string, action: ChatContent) => void,
    setSelectedChat: (payload: { id: string }) => void,
    removeChat: (pyload: { id: string }) => void,
    clearAll: () => void,
};

type Chat = {
    id: string,
    query: "QUERY" | "PROJECT REFINEMENT",
    role: string,
    content: ChatContent[]
};

type ChatContent = {
    emitter: ChatContentEmmiter,
    message: string
};

type ChatContentEmmiter = "gpt" | "user" | "error";

const savedChats = JSON.parse(store.session("@chat"));
const getSafeSavedChats = () => {
    if (Array.isArray(savedChats) && savedChats.length > 0) {
        return savedChats;
    };

    return undefined;
};

const initialChatState: Chat[] = getSafeSavedChats() || [
    {
        id: '1',
        role: 'Sobre GenIA',
        query: 'QUERY',
        content: [
            {
                emitter: "user",
                message: "¿Para qué sirve esta web?"
            },
            {
                emitter: "gpt",
                message: "GenIA es una aplicación del BBVA que te ayudará a resolver las preguntas que desees."
            }
        ],
    }
];

export const useChat = create<UseChatProps>((set, get) => ({
    chat: initialChatState,
    selectedChat: initialChatState[0],
    isQuestion: false,
    setChat: async (payload) => set(({ chat }) => ({ chat: [...chat, payload] })),
    setQuestion: (question: boolean) => set({isQuestion: question}),
    addChat: async (callback, query = 'QUERY') => {
        const hasNewChat = get().chat.find(({ content }) => (content.length === 0));
        console.log('query', query)
        if (!hasNewChat) {
            const id = v4()
            get().setChat({
                role: "Nueva conversación",
                id: id,
                query,
                content: []
            });
            get().setSelectedChat({ id });
            if (callback) callback(id);
        } else {
            const { id } = hasNewChat;
            get().setSelectedChat({ id });
            if (callback) callback(id);
        };
    },
    editChat: async (id, payload) => set(({ chat }) => {
        const selectedChat = chat.findIndex((query) => (query.id === id));
        if (selectedChat > -1) {
            chat[selectedChat] = { ...chat[selectedChat], ...payload };
            return ({ chat, selectedChat: chat[selectedChat] })
        };
        return ({});

    }),
    addMessage: async (id, action) => set(({ chat }) => {
        const selectedChat = chat.findIndex((query) => (query.id === id)),
            props = chat[selectedChat];

        if (selectedChat > -1) {
            chat[selectedChat] = { ...props, content: [...props['content'], action] }
            return ({ chat, selectedChat: chat[selectedChat] });
        };

        return ({});
    }),
    setSelectedChat: async (payload) => set(({ chat }) => {
        const selectedChat = chat.find(({ id }) => id === payload.id);
        return ({ selectedChat: selectedChat })
    }),
    removeChat: async (payload) => set(({ chat }) => {
        const newChat = chat.filter(({ id }) => id !== payload.id);
        return ({ chat: newChat });
    }),
    clearAll: async () => set({ chat: [], selectedChat: undefined }),
    setQueryPerChat: async (id:string,query:"QUERY" | "PROJECT REFINEMENT") => set(({chat}) => {
        const selectedChat = chat.findIndex((query) => (query.id === id ));
        if (selectedChat > -1) {
            chat[selectedChat] = { ...chat[selectedChat], query: query };
            return ({ chat, selectedChat: chat[selectedChat] })
        };
        return ({});
    } ),
}));