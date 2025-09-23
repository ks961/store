'use client';
import { ReactNode, useEffect } from "react";
import { usePersistentState } from "@d3vtool/hooks";
import { Theme, ThemeContext } from "./ThemeContext";

export type ThemeContextProviderProps = {
    children: ReactNode | ReactNode[],
}

export default function ThemeContextProvider({
    children
}: ThemeContextProviderProps) {
    const [ theme, setTheme ] = usePersistentState<Theme>("theme", "system");
    
    useEffect(() => {
        if (theme === "system") {
            const isDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
            document.documentElement.dataset["theme"] = isDark ? "dark" : "light";
        } else {
            document.documentElement.dataset["theme"] = theme;
        }
    }, [theme]);
 
    function toggle() {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }

    return (
        <ThemeContext value={{theme, toggle}}>
            {children}
        </ThemeContext>
    );
}