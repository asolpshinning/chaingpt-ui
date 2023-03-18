import { Conversation, LocalStKeys } from "@/typings";

// use effect function
export const useEffectFunc = (
    setDarkMode: (darkMode: boolean) => void,
    setConversations: (conversations: Conversation[]) => void,
    setSelectedConversation: (conversation: Conversation | undefined) => void
) => {
    const colorMode = localStorage.getItem("darkMode");
    console.log("colorMode: ", colorMode)
    if (colorMode == "true") {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }

    const conversationHistory = localStorage.getItem(LocalStKeys.CONV_HISTORY);

    if (conversationHistory) {
        setConversations(JSON.parse(conversationHistory));
    } else {
        setConversations([]);
    }

    const selectedConversation = localStorage.getItem(LocalStKeys.SELECTED_CONV);
    if (selectedConversation) {
        setSelectedConversation(JSON.parse(selectedConversation));
    } else {
        setSelectedConversation({
            id: 0,
            name: "",
            messages: []
        });
    }
}