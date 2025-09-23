'use client';
import { AdminSidebarItems } from "@/models/AdminSidebarItems";
import SidebarItem from "./SidebarItem";
import { useUserContext } from "@/contexts/UserContext/UserContext";


export default function Sidebar() {
    const { user } = useUserContext();
    
    return (
        <aside className="flex flex-col gap-2 w-48 bg-secondary h-full pt-5  px-2">
            {
                (user?.roleName === "SYSTEM_ADMINISTRATOR") ?
                    AdminSidebarItems.map(item => (
                        <SidebarItem 
                            href={item.href}
                            title={item.title}
                            key={item.href}
                        />
                    )) : null
            }
        </aside>
    );
}