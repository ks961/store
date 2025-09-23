'use client';
import UsersAdminView from "@/components/views/admin/UsersAdminView";
import { useUserContext } from "@/contexts/UserContext/UserContext";


export default function UsersPage() {

    const { user } = useUserContext();

    switch(user?.roleName) {
        case "SYSTEM_ADMINISTRATOR":
            return <UsersAdminView />
        // case "SYSTEM_ADMINISTRATOR":
        //     return <UsersAdminView />

        default:
            return null;
    }
}