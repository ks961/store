import { cn } from "@/libs/utils";

export type CloseIconProps = {
    className?: string
};

export default function CloseIcon({
    className
}: CloseIconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("size-full", className)}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    );
}