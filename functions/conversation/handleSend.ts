import { Conversation, ConversationMsg, LLM, LocalStKeys } from "@/typings";

export const SendConversation = async (
    message: ConversationMsg,
    model: string,
    selectedConversation: Conversation | undefined,
    setSelectedConversation: (conversation: Conversation | undefined) => void,
    setLoading: (loading: boolean) => void,
    setConvActive: (active: boolean) => void

) => {
    if (selectedConversation) {
        // save user's message to updated conversation
        let updatedConversation: Conversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message]
        };

        setSelectedConversation(updatedConversation);
        setLoading(true);
        setConvActive(true);

        // send user's message to server
        const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL
        const PATH = model === LLM.GPT_3_5 ? '/chat' : '/chat'
        const POST_URL = BASE_URL + PATH

        let newPrompt = updatedConversation.messages.map((m) => m.msg).join(" ");

        const response = await fetch(POST_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: newPrompt
        });
        console.log(POST_URL)
        if (!response.ok) {
            setLoading(false);
            throw new Error(response.statusText);
        }

        const data = response.json();

        if (!data) {
            return;
        }

        setLoading(false);


        // push bot's message to current conversation
        let updatedMessages: ConversationMsg[] = updatedConversation.messages
        updatedMessages.push({
            role: "assistant",
            msg: await data
        });
        updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
        };
        setSelectedConversation(updatedConversation);
        console.log("updatedConversation id: ", updatedConversation.id)
        localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversation));

        // Update conversation history
        let currConversationHistory: Conversation[]
        let ch = localStorage.getItem(LocalStKeys.CONV_HISTORY);
        if (!ch) {
            currConversationHistory = [];
        } else {
            currConversationHistory = JSON.parse(ch);
        }
        currConversationHistory[updatedConversation.id] = updatedConversation;
        localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(currConversationHistory));
        setConvActive(false);
    } else {

    }
};