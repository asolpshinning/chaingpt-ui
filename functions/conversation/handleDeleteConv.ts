import { Conversation, LocalStKeys } from "@/typings";

export const deleteConversation = (
    conversation: Conversation,
    conversations: Conversation[],
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void
) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));

    if (updatedConversations.length > 0) {
        setSelectedConversation(updatedConversations[conversation.id - 1]);
        localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversations[0]));
    } else {
        setSelectedConversation({
            id: 0,
            name: "",
            messages: []
        });
        localStorage.removeItem(LocalStKeys.SELECTED_CONV);
    }
};