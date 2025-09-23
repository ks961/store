// 'use client';
import { createContext, useContext } from "react"

export type Theme = "system" | "light" | "dark";

export type ThemeContext = {
    theme: Theme,
    toggle: () => void
} 

export const ThemeContext = createContext<ThemeContext | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);

    if(!context) {
        throw new Error("'useTheme' should be used inside 'ThemeContextProvider'.");
    }

    return context;
}