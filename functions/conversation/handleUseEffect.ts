import { Conversation, LocalStKeys } from "@/typings";

// use effect function
export const useEffectFunc = (
    setDarkMode: (darkMode: boolean) => void,
    setConversations: (conversations: Conversation[]) => void,
    conversations: Conversation[],
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
        const selectedConversation = localStorage.getItem(LocalStKeys.SELECTED_CONV);
        if (selectedConversation) {
            setSelectedConversation(JSON.parse(selectedConversation));
        } else {
            setSelectedConversation(conversations[0]);
        }
    } else {
        setSelectedConversation({
            id: 0,
            name: "untitled conversation 1",
            messages: []
        });
        setConversations([]);
    }


}