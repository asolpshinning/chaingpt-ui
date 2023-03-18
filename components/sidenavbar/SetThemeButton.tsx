import { IconMoon, IconSun } from "@tabler/icons-react";
import { FC } from "react";
import { SideNavbarButton } from "./DivForButton";

interface Props {
    darkMode: boolean;
    onToggledarkMode: (darkMode: boolean) => void;
}

export const SideNavbarSettings: FC<Props> = ({ darkMode, onToggledarkMode }) => {
    return (
        <div className="flex flex-col items-center border-t border-neutral-500 py-4">
            <SideNavbarButton
                text={!darkMode ? "Dark mode" : "Light mode"}
                icon={!darkMode ? <IconMoon /> : <IconSun />}
                onClick={() => onToggledarkMode(darkMode)}
            />
        </div>
    );
};