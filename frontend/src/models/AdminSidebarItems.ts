
export type AdminSidebarItem = {
    href: string,
    title: string,
    apiEndpoint: string,
};

export const AdminSidebarItems: AdminSidebarItem[] = [
    {
        href: "/dashboard",
        title: "Dashboard",
        apiEndpoint: "/v1/users"
    },
    {
        href: "/users",
        title: "Users",
        apiEndpoint: "/v1/users"
    },
    {
        href: "/stores",
        title: "Stores",
        apiEndpoint: "/v1/stores"
    },
] as const;