import { cn } from "@/libs/utils";
import { ComponentPropsWithoutRef } from "react";
import Label from "../Label";
import InputError from "./InputError";

export type InputProps = {
    label: string,
    id: string,
    ref?: React.Ref<HTMLInputElement>,
    error?: string,
} & ComponentPropsWithoutRef<"input">;

export default function PasswordInput({
    label,
    id,
    error,
    ref,
    ...props
}: InputProps) {
    
    const { className } = props;

    const merged = cn(
        "border-1 outline-none px-1 py-1 rounded-md",
        className
    );

    return (
        <div className="flex flex-col gap-1 w-full h-full">
            <Label id={id}>
                {label}
            </Label>
            <input
                id={id}
                ref={ref}
                className={merged}
                type="password"
                {...props}
            />
            <InputError 
                error={error}
            />
        </div>
    );
}