import { Conversation, LLM, LocalStKeys } from "@/typings";

export const startNewConversation = (
    conversations: Conversation[],
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void,
    setModel: (model: LLM) => void,
    setLoading: (loading: boolean) => void
) => {
    let lastConversation: Conversation = { id: 0, name: "", messages: [] }
    if (conversations.length > 0) lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
        id: conversations.length > 0 ? lastConversation.id + 1 : 0,
        name: "untitled conversation " + (conversations.length > 0 ? lastConversation.id + 1 : 1), // starts from 1 just for rendering and not real id
        messages: []
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));

    setSelectedConversation(newConversation);
    localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(newConversation));

    setModel(LLM.GPT_3_5);
    setLoading(false);
};