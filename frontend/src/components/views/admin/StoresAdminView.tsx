/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from "react";
import Button from "../../Button";
import Modal from "../../Modal";
import Bin from "../../Icons/Bin";
import { useGetStores } from "@/features/stores/useGetStores";
import { useDeleteStore } from "@/features/stores/useDeleteStore";
import AddNewStore from "../../Modals/AddNewStore";

export default function StoresAdminView() {

    const [search, setSearch] = useState("");
    const { data, isLoading, refetch } = useGetStores();

    const [ isModelOpen, setIsModelOpen ] = useState(false);

    const deleteStoreMutation = useDeleteStore() 

    function closeModal() {
        setIsModelOpen(false);
    }

    function onSuccess() {
        refetch();
        closeModal();
    }

    if (isLoading) return <div>Loading...</div>;

    const stores = data?.data.data || [];

    const filteredUsers = stores.filter((store: any) => {
        const keyword = search.toLowerCase();
        return (
            store.name.toLowerCase().includes(keyword) ||
            store.email.toLowerCase().includes(keyword) ||
            store.roleName.toLowerCase().includes(keyword) ||
            store.address.toLowerCase().includes(keyword)
        );
    });

    function handleUserDelete(storeId: string) {
        deleteStoreMutation.mutate(storeId, {
            onSuccess: (response) => {
                if(response.data.success) {
                    refetch();
                }
            }
        })
    }

    return (
        <>
            <div className="grid w-full h-max p-10 gap-4">
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search stores..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border border-primary rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <Button as="button" variant="primary" onClick={() => setIsModelOpen(true)}>
                        Add Store
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-primary divide-y divide-primary rounded-lg shadow-sm bg-background text-text">
                        <thead className="bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Address</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Owner Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Delete</th>
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
                                    <td className="px-4 py-2">{store.email}</td>
                                    <td className="px-4 py-2 truncate" title={store.address}>{store?.address?.slice(0, 10)}</td>
                                    <td className="px-4 py-2">{store.ownerName}</td>
                                    <td className="px-4 py-2">
                                        <Button as="button" variant="primary" className="w-12" onClick={() => handleUserDelete(store.id)}>
                                            <Bin />
                                        </Button>
                                    </td>
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
            <Modal isOpen={isModelOpen} closeModal={closeModal}>
                <AddNewStore 
                    onSuccess={onSuccess} />
            </Modal>
        </>
    );
}