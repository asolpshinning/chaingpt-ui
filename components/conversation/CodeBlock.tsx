import { FC, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
    language: string;
    value: string;
    darkMode: boolean;
}

export const CodeBlock: FC<Props> = ({ language, value, darkMode }) => {
    const [buttonText, setButtonText] = useState("Copy");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value).then(() => {
            setButtonText("Copied!");

            setTimeout(() => {
                setButtonText("Copy");
            }, 2000);
        });
    };

    return (
        <div className="relative text-[16px]">
            <SyntaxHighlighter
                language={language}
                style={!darkMode ? oneLight : oneDark}
            >
                {value}
            </SyntaxHighlighter>

            <button
                className="absolute top-2 right-2 text-white bg-blue-600 py-1 px-2 rounded focus:outline-none hover:bg-blue-700 text-sm"
                onClick={copyToClipboard}
            >
                {buttonText}
            </button>
        </div>
    );
};