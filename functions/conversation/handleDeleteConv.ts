import { Conversation, LocalStKeys } from "@/typings";
import { useEffectFunc } from "./handleUseEffect";

export const deleteConversation = (
    conversation: Conversation,
    conversations: Conversation[],
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void,
    setDarkMode: (darkMode: boolean) => void,
) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    if (updatedConversations.length > 0) {
        setSelectedConversation(updatedConversations[conversation.id - 1]);
        localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversations[0]));
        localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));
    } else {
        setSelectedConversation(undefined);
        localStorage.removeItem(LocalStKeys.CONV_HISTORY);
        localStorage.removeItem(LocalStKeys.SELECTED_CONV);
        //useEffect the page since no more conversations
        useEffectFunc(setDarkMode, setConversations, conversations, setSelectedConversation)
    }

};