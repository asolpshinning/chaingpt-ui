import { ConversationPage } from "@/components/conversation/";
import { SideNavbar } from "@/components/sidenavbar";
import { Conversation, ConversationMsg, LLM } from "@/typings";
import { IconArrowBarRight } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<LLM>(LLM.GPT_3_5);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [convActive, setConvActive] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const handleSend = async (message: ConversationMsg) => {
    if (selectedConversation) {
      let updatedConversation: Conversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, message]
      };

      setSelectedConversation(updatedConversation);
      setLoading(true);
      setConvActive(true);

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


      const updatedMessages: ConversationMsg[] = updatedConversation.messages
      updatedMessages.push({
        role: "assistant",
        msg: await data
      });

      updatedConversation = {
        ...updatedConversation,
        messages: updatedMessages
      };

      setSelectedConversation(updatedConversation);
      localStorage.setItem("selectedConversation", JSON.stringify(updatedConversation));
      setConvActive(false);
    }
  };

  const handleDarkMode = () => {
    let newMode: boolean = true
    if (darkMode) {
      newMode = false
      setDarkMode(!darkMode)
    }
    else setDarkMode(true)
    localStorage.setItem("darkMode", String(newMode));
  };

  const handleRenameConversation = (conversation: Conversation, name: string) => {
    const updatedConversation = {
      ...conversation,
      name
    };

    const updatedConversations = conversations.map((c) => {
      if (c.id === updatedConversation.id) {
        return updatedConversation;
      }

      return c;
    });

    setConversations(updatedConversations);
    localStorage.setItem("conversationHistory", JSON.stringify(updatedConversations));

    setSelectedConversation(updatedConversation);
    localStorage.setItem("selectedConversation", JSON.stringify(updatedConversation));
  };

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: "New conversation",
      messages: []
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem("conversationHistory", JSON.stringify(updatedConversations));

    setSelectedConversation(newConversation);
    localStorage.setItem("selectedConversation", JSON.stringify(newConversation));

    setModel(LLM.GPT_3_5);
    setLoading(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    localStorage.setItem("selectedConversation", JSON.stringify(conversation));
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    localStorage.setItem("conversationHistory", JSON.stringify(updatedConversations));

    if (updatedConversations.length > 0) {
      setSelectedConversation(updatedConversations[0]);
      localStorage.setItem("selectedConversation", JSON.stringify(updatedConversations[0]));
    } else {
      setSelectedConversation({
        id: 1,
        name: "",
        messages: []
      });
      localStorage.removeItem("selectedConversation");
    }
  };

  useEffect(() => {
    const colorMode = localStorage.getItem("darkMode");
    console.log("colorMode: ", colorMode)
    if (colorMode == "true") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }

    const conversationHistory = localStorage.getItem("conversationHistory");

    if (conversationHistory) {
      setConversations(JSON.parse(conversationHistory));
    }

    const selectedConversation = localStorage.getItem("selectedConversation");
    if (selectedConversation) {
      setSelectedConversation(JSON.parse(selectedConversation));
    } else {
      setSelectedConversation({
        id: 1,
        name: "",
        messages: []
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>ChainGPT UI</title>
        <meta
          name="description"
          content="An advanced chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      {selectedConversation && (
        <div className={`flex h-screen text-white ${darkMode ? 'dark' : 'light'}`}>
          {showSidebar ? (
            <SideNavbar
              loading={convActive}
              conversations={conversations}
              darkMode={darkMode}
              selectedConversation={selectedConversation}
              onToggledarkMode={handleDarkMode}
              onNewConversation={handleNewConversation}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              onRenameConversation={handleRenameConversation}
            />
          ) : (
            <IconArrowBarRight
              className="absolute top-1 left-4 text-black dark:text-white cursor-pointer hover:text-gray-400 dark:hover:text-gray-300"
              size={32}
              onClick={() => setShowSidebar(!showSidebar)}
            />
          )}

          <ConversationPage
            model={model}
            messages={selectedConversation.messages}
            loading={loading}
            darkMode={darkMode}
            onSend={handleSend}
            onSelect={setModel}
          />
        </div>
      )}
    </>
  );
}