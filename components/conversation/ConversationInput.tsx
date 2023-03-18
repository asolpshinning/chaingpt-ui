import { ConversationMsg } from "@/typings";
import { IconSend } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface Props {
    onSend: (message: ConversationMsg) => void;
}

export const ConversationInput: FC<Props> = ({ onSend }) => {
    const [msg, setMsg] = useState<string>();
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 4000) {
            alert("Message limit is 4000 characters");
            return;
        }

        setMsg(value);
    };

    const handleSend = () => {
        if (!msg) {
            alert("Please enter a message");
            return;
        }
        onSend({ role: "user", msg });
        setMsg("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isTyping && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = "inherit";
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
        }
    }, [msg]);

    return (
        <div className="relative">
            <div className="absolute bottom-[-70px] sm:bottom-[-120px] w-full">
                <textarea
                    ref={textareaRef}
                    className="rounded-lg pl-4 pr-8 py-3 w-full focus:outline-none max-h-[280px] dark:bg-[#40414F] dark:border-opacity-50 dark:border-neutral-800 dark:text-neutral-100 border border-neutral-300 shadow text-neutral-900"
                    style={{
                        resize: "none",
                        bottom: `${textareaRef?.current?.scrollHeight}px`,
                        height: 'auto',
                        minHeight: '100px',
                        maxHeight: '500px',
                        overflow: 'auto',
                    }}
                    placeholder="Type a message..."
                    value={msg}
                    rows={1}
                    onCompositionStart={() => setIsTyping(true)}
                    onCompositionEnd={() => setIsTyping(false)}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="absolute right-2 bottom-[14px] text-neutral-400 p-2 hover:dark:bg-neutral-800 hover:bg-neutral-400 hover:text-white rounded-md"
                    onClick={handleSend}
                >
                    <IconSend size={18} />
                </button>
            </div>
        </div>
    );
};