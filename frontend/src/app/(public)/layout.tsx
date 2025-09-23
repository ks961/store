import PublicNavbar from "@/components/Navbar/PublicNavbar";
import { ReactNode } from "react";

export type PublicRouteLayoutProps = {
    children: ReactNode | ReactNode[], 
}

export default function PublicRouteLayout({
    children
}: PublicRouteLayoutProps) {
    return (
        <>
            <PublicNavbar />
            <main className="h-full w-full">
                {children}
            </main>
        </>
    );
}