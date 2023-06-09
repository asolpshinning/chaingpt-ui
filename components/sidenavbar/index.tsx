import { Conversation } from "@/typings";
import { IconArrowBarLeft, IconPlus } from "@tabler/icons-react";
import { FC } from "react";
import { Conversations } from "./ConversationTabs";
import { SideNavbarSettings } from "./SetThemeButton";

interface Props {
    loading: boolean;
    conversations: Conversation[];
    darkMode: boolean;
    selectedConversation: Conversation;
    onNewConversation: () => void;
    onToggledarkMode: (darkMode: boolean) => void;
    onSelectConversation: (conversation: Conversation) => void;
    setSelectedConversation: (conversation: Conversation) => void;
    onDeleteConversation: (conversation: Conversation) => void;
    onToggleSidebar: () => void;
    onRenameConversation: (conversation: Conversation, name: string) => void;
}

export const SideNavbar: FC<Props> = ({
    loading,
    conversations,
    darkMode,
    selectedConversation,
    onNewConversation,
    onToggledarkMode,
    onSelectConversation,
    setSelectedConversation,
    onDeleteConversation,
    onToggleSidebar,
    onRenameConversation
}) => {
    return (
        <div className="flex flex-col bg-[#202123] min-w-[260px] max-w-[260px]">
            <div className="flex items-center h-[60px] pl-2">
                <button
                    className="flex items-center w-[200px] h-[40px] rounded-lg bg-[#202123] border border-neutral-600 text-sm hover:bg-neutral-700"
                    onClick={onNewConversation}
                >
                    <IconPlus
                        className="ml-4 mr-3"
                        size={16}
                    />
                    New Conversation
                </button>

                <IconArrowBarLeft
                    className="ml-1 p-1 text-neutral-300 cursor-pointer hover:text-neutral-400"
                    size={38}
                    onClick={onToggleSidebar}
                />
            </div>

            <div className="flex flex-1 justify-center overflow-auto">
                <Conversations
                    loading={loading}
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={onSelectConversation}
                    setSelectedConversation={setSelectedConversation}
                    onDeleteConversation={onDeleteConversation}
                    onRenameConversation={onRenameConversation}
                />
            </div>

            <SideNavbarSettings
                darkMode={darkMode}
                onToggledarkMode={onToggledarkMode}
            />
        </div>
    );
};