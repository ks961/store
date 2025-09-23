'use client';
import ProtectedNavbar from "@/components/Navbar/ProtectedNavbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ReactNode } from "react";


export type ProtectedLayoutProps = {
    children: ReactNode | ReactNode[]
}


export default function ProtectedLayout({
    children
}: ProtectedLayoutProps) {

    return (
        <>
            <ProtectedNavbar />
            <div className="flex w-full h-full">
                <Sidebar />
                {children}
            </div>
        </>
    );
}