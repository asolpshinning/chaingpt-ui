import { Conversation, LLM, LocalStKeys } from "@/typings";

export const startNewConversation = (
    conversations: Conversation[],
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void,
    setModel: (model: LLM) => void,
    setLoading: (loading: boolean) => void
) => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
        id: lastConversation ? lastConversation.id + 1 : 1,
        name: "New conversation",
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