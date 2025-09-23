import { cn } from "@/libs/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export type LabelProps = {
    id: string,
    children: ReactNode | ReactNode[]
} & ComponentPropsWithoutRef<"label">;

export default function Label({
    id,
    children,
    ...props
}: LabelProps) {

    const { className } = props;
    
    const merged = cn(
        "text-sm font-semibold",
        className
    );

    return (
        <label htmlFor={id} className={merged} {...props}>
            {children}
        </label>
    );
}