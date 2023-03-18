import { Conversation, LocalStKeys } from "@/typings";


export const renameConversation = (
    conversation: Conversation,
    name: string,
    conversations: Conversation[],
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void
) => {
    const updatedConversation = {
        ...conversation,
        name
    };

    const updatedConversations = conversations.map((c) => {
        if (c?.id === updatedConversation.id) {
            return updatedConversation;
        }

        return c;
    });

    setConversations(updatedConversations);
    localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));

    setSelectedConversation(updatedConversation);
    localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversation));
};