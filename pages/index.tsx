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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: updatedConversation.messages
        })
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      const data = response.body;

      if (!data) {
        return;
      }

      setLoading(false);

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirst = true;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        text += chunkValue;

        if (isFirst) {
          isFirst = false;
          const updatedMessages: ConversationMsg[] = [...updatedConversation.messages, { role: "assistant", msg: chunkValue }];

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        } else {
          const updatedMessages: ConversationMsg[] = updatedConversation.messages.map((message, index) => {
            if (index === updatedConversation.messages.length - 1) {
              return {
                ...message,
                content: text
              };
            }

            return message;
          });

          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages
          };

          setSelectedConversation(updatedConversation);
        }
      }

      localStorage.setItem("selectedConversation", JSON.stringify(updatedConversation));

      const updatedConversations: Conversation[] = conversations.map((conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }

        return conversation;
      });

      if (updatedConversations.length === 0) {
        updatedConversations.push(updatedConversation);
      }

      setConversations(updatedConversations);

      localStorage.setItem("conversationHistory", JSON.stringify(updatedConversations));

      setConvActive(false);
    }
  };

  const handleDarkMode = () => {
    if (darkMode) setDarkMode(false)
    else setDarkMode(true)
    localStorage.setItem("darkMode", String(darkMode));
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