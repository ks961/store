/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import { useGetUsers } from "@/features/store-owner/useGetUsers";


export default function StoreOwnerDashboard() {

    const [search, setSearch] = useState("");
    const { data, isLoading } = useGetUsers();

    if(isLoading) return <>Loading...</>

    const storeInfo = data?.data.data;

    const filteredUsers = storeInfo.users.filter((user: any) => {
        const keyword = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(keyword)
        );
    });

    console.log(storeInfo)

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="mt-5">
                <div
                    className="flex flex-col h-max items-center justify-center p-6 rounded-lg shadow-md border border-primary bg-background text-text hover:bg-accent hover:text-primary-foreground transition-colors"
                >
                    <p className="text-lg font-bold text-secondary">
                        Store Average Rating
                    </p>
                    <p className="text-3xl font-bold mt-2">{storeInfo.avgRating}</p>
                </div>
            </div>
            <div>
            <div className="grid w-96 h-max p-10 gap-4">
                <div className="flex items-center justify-between w-full">
                    <input
                        type="text"
                        value={search}
                        placeholder="Search stores..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border border-primary rounded-md w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border border-primary divide-y divide-primary rounded-lg shadow-sm bg-background text-text">
                        <thead className="bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {filteredUsers.map((store: any, index: number) => (
                                <tr
                                    key={store.id}
                                    className="hover:bg-accent hover:text-primary-foreground transition-colors"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{store.name}</td>
                                    <td className="px-4 py-2">{store.rating}</td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
    );
}