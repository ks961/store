'use client';

import { ModalContext } from "./index";
import { ReactNode, useCallback, useEffect, useState } from "react";
import CloseIcon from "../Icons/CloseIcon";
import Button from "../Button";
import Modal from "../Modal";

export type ModalViewProps = {
    children: ReactNode | ReactNode[];
};

export function ModalView({ children }: ModalViewProps) {
    const [element, setElement] = useState<ReactNode | null>(null);

    const closeModal = useCallback(() => {
        setElement(null);
    }, []);

    const updateElement = useCallback((newElement: ReactNode) => {
        setElement(newElement);
    }, []);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "Esc") {
                closeModal();
            }
        },
        [closeModal]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <ModalContext.Provider value={{ updateElement, closeModal }}>
            {children}
            <Modal isOpen={element !== null} closeModal={closeModal}>
                <div className="w-full flex items-center justify-end">
                    <Button
                        as="button"
                        variant="primary"
                        className="w-9 hover:text-white transition-colors duration-200 ease-in-out"
                        onClick={closeModal}
                    >
                        <CloseIcon />
                    </Button>
                </div>
                {element}
            </Modal>
        </ModalContext.Provider>
    );
}
