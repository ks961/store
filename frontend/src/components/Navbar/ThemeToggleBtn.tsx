'use client';
import { cn } from "@/libs/utils";
import Sun from "../Icons/Sun";
import Moon from "../Icons/Moon";
import { useTheme } from "@/contexts/ThemeContext/ThemeContext";

export type ThemeToggleBtnProps = {
    className?: string
}

export default function ThemeToggleBtn({
    className
}: ThemeToggleBtnProps) {
    const { theme, toggle } = useTheme();

    const classes = cn(
        "cursor-pointer border-primary border-2 p-1 rounded-md",
        className
    );

    return (
        <button onClick={toggle} className={classes} title={theme}>
            {
                theme === "dark" ?
                    <Moon /> : <Sun />
            }
        </button>
    );
}