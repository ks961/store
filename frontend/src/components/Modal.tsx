import React from "react";
import { cn } from "@/libs/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import CloseIcon from "./Icons/CloseIcon";
import Button from "./Button";

export type ModalProps = {
    isOpen: boolean,
    className?: string,
    closeModal: () => void,
    children: ReactNode | ReactNode[],
} & ComponentPropsWithoutRef<"div">;

const defaultClasses = "z-10 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-max h-max";
function Modal({ className, isOpen, closeModal, children, ...attribs }: ModalProps) {

    className = cn(defaultClasses, className);

    className = `${className} ${isOpen ? "" : ""}`;

    return(
        <>
            <div className={`${className} ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} {...attribs}>
                <div className={`bg-background relative p-8 shadow-md rounded-md w-full h-full ${isOpen ? "a-scale-up" : ""}`}>
                    <Button onClick={closeModal} as="button" variant="outline-accent" className="bg-transparent absolute top-1 right-1 outline-none w-[58px] border-0">
                        <CloseIcon />
                    </Button>
                    {children}
                </div>
            </div>
            <div 
                className={`absolute top-0 left-0 bg-purple-800/20 w-full h-full cursor-pointer transition-opacity ease-in-out duration-200 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
                data-tag="modal" 
                onClick={closeModal}
            >
            </div>
        </>
    );
}

export default React.memo(Modal);