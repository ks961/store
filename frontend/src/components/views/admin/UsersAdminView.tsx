/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef, useState } from "react";
import { useGetUsers } from "@/features/users/useGetUsers";
import Button from "../../Button";
import Modal from "../../Modal";
import AddNewUser from "../../Modals/AddNewUser";
import { StringUtils } from "@d3vtool/utils";
import { useDeleteUser } from "@/features/users/useDeleteUser";
import { User } from "@/contexts/UserContext/UserContext";
import Bin from "../../Icons/Bin";
import Copy from "../../Icons/Copy";
import FloatingView from "../../FloatingView";

export default function UsersAdminView() {
    const [search, setSearch] = useState("");


    const { data, isLoading, refetch } = useGetUsers();

    const [ isModelOpen, setIsModelOpen ] = useState(false);

    const textCopyRef = useRef<HTMLDivElement>(null);

    const deleteUserMutation = useDeleteUser() 

    function closeModal() {
        setIsModelOpen(false);
    }

    function onSuccess() {
        refetch();
        closeModal();
    }

    if (isLoading) return <div>Loading...</div>;

    const users = data?.data.data || [];

    const filteredUsers = users.filter((user: any) => {
        const keyword = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.roleName.toLowerCase().includes(keyword) ||
            user.address.toLowerCase().includes(keyword)
        );
    });

    function handleUserDelete(userId: User["userId"]) {
        deleteUserMutation.mutate(userId, {
            onSuccess: (response) => {
                if(response.data.success) {
                    refetch();
                }
            }
        })
    }

    async function copyId(userId: string) {
        await navigator.clipboard.writeText(userId);
        textCopyRef.current?.classList.remove("hidden");
        textCopyRef.current?.classList.add("block");
        setTimeout(() => {
            textCopyRef.current?.classList.remove("block");
            textCopyRef.current?.classList.add("hidden");
        }, 1000)
    }

    return (
        <>
            <div className="grid w-full h-max p-10 gap-4">
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border border-primary rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <Button as="button" variant="primary" onClick={() => setIsModelOpen(true)}>
                        Add User
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
                                <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">User Id</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {filteredUsers.map((user: any, index: number) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-accent hover:text-primary-foreground transition-colors"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2 truncate" title={user.address}>{user?.address?.slice(0, 10)}</td>
                                    <td className="px-4 py-2">{StringUtils.toTitleCase(user.roleName)}</td>
                                    <td className="px-4 py-2">
                                        <Button as="button" variant="primary" className="w-12 text-xs" onClick={() => copyId(user.id)}>
                                            <Copy />
                                        </Button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button as="button" variant="primary" className="w-12" onClick={() => handleUserDelete(user.id)}>
                                            <Bin />
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModelOpen} closeModal={closeModal}>
                <AddNewUser 
                    onSuccess={onSuccess} />
            </Modal>
            <FloatingView ref={textCopyRef} className="hidden bottom-16 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground font-semibold text-lg px-3 py-1 rounded-md">
                    Copied
                </span>
            </FloatingView>
            {/* <Modal isOpen={true} closeModal={() => setTextCopyDone(false)} className="">

            </Modal> */}
        </>
    );
}