'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input/Input";
import Textarea from "../Textarea";
import { useCreateNewStore } from "@/features/stores/useCreateNewStore";
import { CreateStoreInput, CreateStoreSchema } from "@/features/stores/schemas";

export type AddNewStoreProps = {
    onSuccess: () => void
}

export default function AddNewStore({
    onSuccess
}: AddNewStoreProps) {
    const createStoreMutation = useCreateNewStore();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateStoreInput>({
        resolver: zodResolver(CreateStoreSchema),
        mode: "onChange"
    });

    function onSubmit(data: CreateStoreInput) {
        createStoreMutation.mutate(data, {
            onSuccess,
        })
    }

    return (
        <div className="w-full flex flex-col items-center mt-8 gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
                <Input
                    id="name"
                    label="Name"
                    type="text"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    id="email"
                    label="Email"
                    type="text"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Textarea
                    rows={5}
                    id="address"
                    label="Address"
                    error={errors.address?.message}
                    {...register("address")}
                />
                <Input
                    id="ownerId"
                    label="Owner Id"
                    type="text"
                    error={errors.ownerId?.message}
                    {...register("ownerId")}
                />
                <Button as="button" variant="primary" type="submit" disabled={createStoreMutation.isPending}>
                    { createStoreMutation.isPending ? "Wait..." :  "Create Store" }
                </Button>
            </form>
        </div>
    );
}