import { ReactNode } from "react";

export type DashboardLayoutProps = {
    children: ReactNode | ReactNode[]
}

export default function DashboardLayout({
    children
}: DashboardLayoutProps) {

    return (
        <>
            {children}
        </>
    );
}