/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import StarRating from "@/components/StarRating";
import { useGetStores } from "@/features/stores/useGetStores";
import { useRateStore } from "@/features/stores/useRateStore";
import { useStoreRatingUpdate } from "@/features/stores/useStoreRatingUpdate";
import { useState } from "react";



export default function UsersDashboardView() {

    const [search, setSearch] = useState("");
    const { data, isLoading, refetch } =  useGetStores();
    const storeRatingMutation = useRateStore();
    const storeRatingUpdateMutation = useStoreRatingUpdate();

    const [ ratingModalOpen, setRatingModalOpen ] = useState(false);

    const [ currentRating, setCurrentRating ] = useState<{rating: number, storeId: string, ratingId?: string } | null>(null);

    function handleSetCurrentRating(rating: number) {
        setCurrentRating({
            rating,
            storeId: currentRating!.storeId
        });
        if(currentRating?.ratingId) {
            storeRatingUpdateMutation.mutate({
                rating,
                storeId: currentRating!.storeId,
                ratingId: currentRating!.ratingId,
            }, {
                onSuccess: () => {
                    refetch();
                },
                onError: (error) => {
                    throw error;
                }
            });
            closeModal();
            return;
        }

        storeRatingMutation.mutate({rating, storeId: currentRating!.storeId}, {
            onSuccess: () => {
                refetch();
            },
            onError: (error) => {
                throw error;
            }
        });
        closeModal();
    }


    if(isLoading) return <>Loading...</>

    const stores = data?.data.data || [];

    const filteredUsers = stores.filter((store: any) => {
        const keyword = search.toLowerCase();
        return (
            store.name.toLowerCase().includes(keyword) ||
            store.email.toLowerCase().includes(keyword) ||
            store.ownerName.toLowerCase().includes(keyword) ||
            store.address.toLowerCase().includes(keyword)
        );
    });

    function handleRating(
        currentRating: number,
        storeId: string,
        ratingId?: string
    ) {
        setCurrentRating({
            rating: currentRating,
            storeId,
            ratingId
        });
        setRatingModalOpen(true);
    }

    function closeModal() {
        setRatingModalOpen(false);
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
                                <th className="px-4 py-2 text-left text-sm font-semibold">Total Ratings</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Overall Rating</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            { filteredUsers.map((store: any, index: number) => (
                                <tr
                                    key={store.id}
                                    className="hover:bg-accent hover:text-primary-foreground transition-colors"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{store.name}</td>
                                    <td className="px-4 py-2">{store.email}</td>
                                    <td className="px-4 py-2 truncate" title={store.address}>{store?.address?.slice(0, 10)}</td>
                                    <td className="px-4 py-2">{store.ownerName}</td>
                                    <td className="px-4 py-2">{store.ratings.length}</td>
                                    <td className="px-4 py-2">{store.overallRating ?? 0}</td>
                                    <td className="px-4 py-2">
                                        <Button as="button" variant="primary" onClick={() => handleRating(
                                            store?.ratings[index]?.rating ?? 0,
                                            store.id,
                                            store?.ratings[index]?.id
                                        )}>
                                            Rate
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
            <Modal isOpen={ratingModalOpen} closeModal={closeModal}>
                <StarRating 
                    currentRating={currentRating?.rating ?? 0}
                    setCurrentRating={handleSetCurrentRating}
                />
            </Modal>
        </>
    );
}