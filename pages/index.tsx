import { ConversationPage } from "@/components/conversation/";
import { SideNavbar } from "@/components/sidenavbar";
import { deleteConversation } from "@/functions/conversation/handleDeleteConv";
import { startNewConversation } from "@/functions/conversation/handleNewConv";
import { renameConversation } from "@/functions/conversation/handleRename";
import { SendConversation } from "@/functions/conversation/handleSend";
import { useEffectFunc } from "@/functions/conversation/handleUseEffect";
import { Conversation, ConversationMsg, LLM, LocalStKeys } from "@/typings";
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

  // When you send a prompt to the model during a conversation
  const handleSend = async (message: ConversationMsg) => {
    SendConversation(
      message,
      model,
      selectedConversation,
      setSelectedConversation,
      setLoading,
      setConvActive,
    )
  };

  const handleDarkMode = () => {
    let newMode: boolean = true
    if (darkMode) {
      newMode = false
      setDarkMode(!darkMode)
    }
    else setDarkMode(true)
    localStorage.setItem(LocalStKeys.DARK_MODE, String(newMode));
  };

  // handle rename conversation
  const handleRenameConversation = (conversation: Conversation, name: string) => {
    renameConversation(
      conversation,
      name,
      conversations,
      setConversations,
      setSelectedConversation,
    )
  };
  /* const handleRenameConversation = (conversation: Conversation, name: string) => {
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
    localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));

    setSelectedConversation(updatedConversation);
    localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversation));
  }; */

  //When you start a new conversation
  const handleNewConversation = () => {
    startNewConversation(
      conversations,
      setConversations,
      setSelectedConversation,
      setModel,
      setLoading,
    )
  }
  /* const handleNewConversation = () => {
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
  }; */

  // When you select a conversation from the sidebar
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(conversation));
  };

  // When you delete a conversation from the sidebar
  const handleDeleteConversation = (conversation: Conversation) => {
    deleteConversation(
      conversation,
      conversations,
      setConversations,
      setSelectedConversation,
    )
  }
  /* const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter((c) => c.id !== conversation.id);
    setConversations(updatedConversations);
    localStorage.setItem(LocalStKeys.CONV_HISTORY, JSON.stringify(updatedConversations));

    if (updatedConversations.length > 0) {
      setSelectedConversation(updatedConversations[0]);
      localStorage.setItem(LocalStKeys.SELECTED_CONV, JSON.stringify(updatedConversations[0]));
    } else {
      setSelectedConversation({
        id: 1,
        name: "",
        messages: []
      });
      localStorage.removeItem(LocalStKeys.SELECTED_CONV);
    }
  }; */

  // When the page loads
  useEffect(() => {
    useEffectFunc(
      setDarkMode,
      setConversations,
      setSelectedConversation,
    )
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