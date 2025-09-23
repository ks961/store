import { cn } from "@/libs/utils";
import { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

export type FloatingViewProps = {
    className?: string,
    ref?: Ref<HTMLDivElement>
    children: ReactNode | ReactNode[],
} & ComponentPropsWithoutRef<'div'>;

export default function FloatingView(
    { className, children, ref, ...props }: FloatingViewProps, 
) {

    className = cn(
        "w-max h-max fixed select-none", 
        className
    );

    return(
        <div ref={ref} className={className} {...props}>
            {children}
        </div>
    );
}