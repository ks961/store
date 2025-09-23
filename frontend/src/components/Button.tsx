import { cn } from "@/libs/utils";
import Link from "next/link";
import React, { ReactNode } from "react";

type ButtonVariants = 
    "primary" | 
    "secondary" | 
    "outline-primary" |
    "outline-secondary" |
    "outline-accent";

type AllowedTags = "button" | typeof Link;

export type ButtonProps<C extends AllowedTags> = {
    as: C,
    variant: ButtonVariants,
    children?: ReactNode | ReactNode[]
} & React.ComponentPropsWithoutRef<C>;

const baseStyles = "cursor-pointer"; 

const variantsStyleMap: Record<ButtonVariants, string> = {
    "primary": "bg-primary text-primary-foreground px-4 py-1.5 rounded-md",
    "secondary": "bg-secondary text-text px-4 py-1.5 rounded-md",
    "outline-primary": "bg-background border-primary border-2 px-4 py-1.5 rounded-md",
    "outline-secondary": "bg-background border-secondary border-2 px-4 py-1.5 rounded-md",
    "outline-accent": "bg-background border-accent border-2 px-4 py-1.5 rounded-md"
}

const Button = React.forwardRef(<C extends AllowedTags>({
    as,
    variant,
    className,
    children,
    ...props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: ButtonProps<C>, ref: React.Ref<any>) => {

    return React.createElement(
        as,
        {
            ref,
            className: cn(baseStyles, variantsStyleMap[variant], className),
            ...props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        children
    );
});

Button.displayName = "Button";

export default Button;