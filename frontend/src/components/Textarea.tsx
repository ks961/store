import { cn } from "@/libs/utils";
import React, { ComponentPropsWithoutRef } from "react";
import Label from "./Label";

export type TextareaProps = {
    label: string;
    id: string,
    error?: string,
    ref?: React.Ref<HTMLTextAreaElement>;
} & ComponentPropsWithoutRef<"textarea">;

export default function Textarea({
    label, 
    id, 
    error,
    ref,
    ...props
}: TextareaProps) {

    const { className } = props;

    const merged = cn(
        "border border-text resize-none outline-none px-1 py-1 rounded-md",
        className,
    );

    return (
        <div className="flex flex-col gap-1 w-full h-full">
            <Label id={id}>
                {label}
            </Label>
            <textarea
                id={id}
                ref={ref}
                className={merged}
                {...props}
            />
            { error ? 
                    <span className="text-red-600 text-sm">
                        {error}
                    </span> : 
                null 
            }
        </div>
    );
}