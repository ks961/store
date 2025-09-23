'use client';
import StoresAdminView from "@/components/views/admin/StoresAdminView";
import { useUserContext } from "@/contexts/UserContext/UserContext";


export default function StoresPage() {

    const { user } = useUserContext();

    switch(user?.roleName) {
        case "SYSTEM_ADMINISTRATOR":
            return <StoresAdminView />

        default:
            return null;
    }
}