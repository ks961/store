import { createContext, ReactNode, useContext } from "react"

// export type ReactElement = 

export type ModalContext = {
    closeModal: () => void,
    updateElement: (newElement: ReactNode | ReactNode[]) => void;
}

export const ModalContext = createContext<ModalContext | undefined>(undefined);


export function useModalContext() {
    const context = useContext(ModalContext);

    if(!context) {
        throw new Error("'useModalContext' should be used inside 'ModalProvider' component");
    }

    return context;
}