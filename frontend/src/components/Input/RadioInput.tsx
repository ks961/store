import Label from "../Label";
import { ComponentPropsWithoutRef } from "react";

export type InputProps = {
    label: string,
    id: string,
    ref?: React.Ref<HTMLInputElement>,
} & ComponentPropsWithoutRef<"input">;

export default function RadioInput({
    label,
    id,
    ref,
    ...props
}: InputProps) {

    if(!props.name) {
        throw new Error("Name attribite required in radio input component");
    }

    return (
        <Label id={id} className="text-lg leading-none flex items-center gap-1.5 cursor-pointer">
            <input
                id={id}
                ref={ref}
                type="radio"
                {...props}
            />
            <span className="-mt-0.5">
                {label}
            </span>
        </Label>
    );
}