'use client';
import { StringUtils } from "@d3vtool/utils";
import { useUsersDashboard } from "@/features/users/useUsersDashboard";

export default function AdminDashboardView() {
    const { data, isLoading } = useUsersDashboard();

    if (isLoading) return <>Loading...</>;

    const stats = data?.data.data as Record<string, string> | undefined;

    if (!stats) {
        return <div className="p-6">No dashboard data available.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
            {Object.entries(stats).map(([key, value]) => (
                <div
                    key={key}
                    className="flex flex-col h-max items-center justify-center p-6 rounded-lg shadow-md border border-primary bg-background text-text hover:bg-accent hover:text-primary-foreground transition-colors"
                >
                    <p className="text-lg font-bold text-secondary">
                        {StringUtils.toTitleCase(key)}
                    </p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
            ))}
        </div>
    );
}