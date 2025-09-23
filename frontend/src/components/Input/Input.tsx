import { cn } from "@/libs/utils";
import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import { ComponentPropsWithoutRef } from "react";
import PasswordInput from "./PasswordInput";

export type InputProps = {
    label: string,
    id: string,
    type: ComponentPropsWithoutRef<"input">["type"],
    ref?: React.Ref<HTMLInputElement>,
    error?: string,
} & ComponentPropsWithoutRef<"input">;

export default function Input({
    label,
    id,
    type,
    error,
    ref,
    ...props
}: InputProps) {
    
    const { className } = props;

    const merged = cn(
        "border-1 outline-none px-1 py-1 rounded-md",
        className
    );

    switch(type) {
        case "text":
            return (
                <TextInput 
                    id={id}
                    ref={ref}
                    label={label}
                    error={error}
                    className={merged}
                    {...props}
                />
            );
        case "password":
            return (
                <PasswordInput 
                    id={id}
                    ref={ref}
                    label={label}
                    error={error}
                    className={merged}
                    {...props}
                />
            );
        case "radio":
            return (
                <RadioInput 
                    id={id}
                    ref={ref}
                    label={label}
                    className={merged}
                    {...props}
                />
            );
        default:
            throw new Error(
                "Input type not supported."
            );
    }
}