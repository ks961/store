'use client';
import AdminDashboardView from "@/components/views/admin/AdminDashboardView";
import StoreOwnerDashboard from "@/components/views/store-owner/StoreOwnerDashboard";
import UsersDashboardView from "@/components/views/user/UsersDashboardView";
import { useUserContext } from "@/contexts/UserContext/UserContext";

export default function Dashboard() {
    const { user } = useUserContext();

    switch(user?.roleName) {
        case "SYSTEM_ADMINISTRATOR":
            return <AdminDashboardView />
        case "NORMAL_USER":
            return <UsersDashboardView />
        case "STORE_OWNER":
            return <StoreOwnerDashboard />
        default: 
            return null;
    }
}