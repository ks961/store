import { cn } from "@/libs/utils";

export type ForwardProps = {
    className?: string
};


export default function Forward({
    className
}: ForwardProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("size-full", className)}><path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg>
    );
}