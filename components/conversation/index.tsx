import { ConversationMsg, LLM } from "@/typings";
import { FC, useEffect, useRef } from "react";
import { ConversationInput } from "./ConversationInput";
import { ConversationLoader } from "./ConversationLoader";
import { Msg } from "./Msg";
import { SelectLLM } from "./SelectLLM";

interface Props {
    model: LLM;
    messages: ConversationMsg[];
    loading: boolean;
    darkMode: boolean;
    onSend: (message: ConversationMsg) => void;
    onSelect: (model: LLM) => void;
}

export const ConversationPage: FC<Props> = ({ model, messages, loading, darkMode, onSend, onSelect }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="h-full w-full flex flex-col dark:bg-[#343541]">
            <div className="flex-1 overflow-auto">
                {messages.length === 0 ? (
                    <>
                        <div className="flex justify-center pt-8 overflow-auto">
                            <SelectLLM
                                model={model}
                                onSelect={onSelect}
                            />
                        </div>

                        <div className="flex-1 text-4xl text-center text-neutral-300 pt-[280px]">ChainGPT</div>
                    </>
                ) : (
                    <>
                        <div className="text-center py-3 dark:bg-[#444654] dark:text-neutral-300 text-neutral-500 text-sm border border-b-neutral-300 dark:border-none">Model: {model}</div>

                        {messages.map((message, index) => (
                            <Msg
                                key={index}
                                msg={message}
                                darkMode={darkMode}
                            />
                        ))}
                        {loading && <ConversationLoader model={model} />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="h-[80px] sm:h-[140px] w-[340px] sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[800px] mx-auto">
                <ConversationInput onSend={onSend} />
            </div>
        </div>
    );
};