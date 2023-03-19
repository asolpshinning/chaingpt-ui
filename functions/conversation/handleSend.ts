import { Conversation, ConversationMsg, LLM, LocalStKeys } from "@/typings";
import { useEffectFunc } from "./handleUseEffect";

export const SendConversation = async (
    message: ConversationMsg,
    model: string,
    selectedConversation: Conversation | undefined,
    setSelectedConversation: (conversation: Conversation | undefined) => void,
    setConversations: (conversations: Conversation[]) => void,
    setLoading: (loading: boolean) => void,
    setConvActive: (active: boolean) => void,
    setDarkMode: (darkMode: boolean) => void,
    conversations: Conversation[],
) => {

    const sendMsgToServer = async (updatedConversation: Conversation) => {
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
            return null;
        }

        setLoading(false);
        return data;
    }
    //
    const pushMsgToConversation = (conv: Conversation, data: any) => {
        // push bot's message to current conversation
        let updatedMessages: ConversationMsg[] = conv.messages
        updatedMessages.push({
            role: "assistant",
            msg: data
        });
        let updatedConv: Conversation = {
            ...conv,
            messages: updatedMessages
        };
        setSelectedConversation(updatedConv);
        console.log("updatedConversation id: ", updatedConv.id)
        localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConv));
        return updatedConv
    }
    //
    const updateConversationHistoryWithUpdatedConv = (conv: Conversation) => {
        let currConversationHistory: Conversation[]
        let ch = localStorage.getItem(LocalStKeys.CONV_HISTORY);
        if (!ch) {
            currConversationHistory = [];
        } else {
            currConversationHistory = JSON.parse(ch);
        }
        currConversationHistory[conv.id] = conv;
        localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(currConversationHistory));
    }

    // if selected conversation exists in the local storage, update it
    if (selectedConversation && conversations.length > 0) {
        // save user's message to updated conversation
        let updatedConversation: Conversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message]
        };

        setSelectedConversation(updatedConversation);
        setLoading(true);
        setConvActive(true);

        // send user's message to server
        const data = await sendMsgToServer(updatedConversation);

        // push bot's message to current conversation
        updatedConversation = pushMsgToConversation(updatedConversation, data)

        // Update conversation history
        updateConversationHistoryWithUpdatedConv(updatedConversation)

        setConvActive(false);


    } else {
        let newConversation: Conversation = {
            id: 0,
            name: "untitled conversation 1",
            messages: [message]
        };
        // set conversations on the sidebar to show the new conversation
        setConversations([newConversation]);
        setSelectedConversation(newConversation);
        setLoading(true);
        setConvActive(true);
        // send user's message to server
        const data = await sendMsgToServer(newConversation);
        // push bot's message to current conversation
        newConversation = pushMsgToConversation(newConversation, data)
        // Update conversation history
        updateConversationHistoryWithUpdatedConv(newConversation)
        // set conversations on the sidebar to show the new conversation
        setConversations([newConversation]);
        setSelectedConversation(newConversation);
        setConvActive(false);
        //useEffect the page since no more conversations
        setTimeout(() => {
            useEffectFunc(setDarkMode, setConversations, conversations, setSelectedConversation)
        }, 1000)
    }
};