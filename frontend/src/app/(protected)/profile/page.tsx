'use client';
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import UpdateUserPassword from "@/components/Modals/UpdateUserPassword";
import { useGetMyProfile } from "@/features/auth/useGetMyProfile";
import { useState } from "react";


export default function ProfilePage() {

    const { data, isLoading } = useGetMyProfile();

    const [ isModalOpen, setIsModalOpen ] = useState(false);

    if(isLoading) return <div>Loading...</div>;

    function closeModal() {
        setIsModalOpen(false);
    }

    function onSuccess() {
        closeModal();
    }

    return (
        <>
            <div className="w-96 h-max mx-auto mt-10 p-6 rounded-lg shadow-md bg-background text-text border border-primary">
                <h1 className="text-2xl font-bold mb-6 text-primary">Profile</h1>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-secondary">Name</p>
                        <p className="text-base">{data?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-secondary">Email</p>
                        <p className="text-base">{data?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-secondary">Address</p>
                        <p className="text-base">{data?.address}</p>
                    </div>
                    <div>
                        <Button as="button" variant="primary" onClick={() => setIsModalOpen(true)}>
                            Update Password
                        </Button>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <UpdateUserPassword 
                    onSuccess={onSuccess}        
                />
            </Modal>
        </>
    );
}