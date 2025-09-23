'use client';
import { SignupInput, SignupSchema, USER_ROLES } from "@/features/auth/schemas";
import { StringUtils } from "@d3vtool/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input/Input";
import InputError from "../Input/InputError";
import Textarea from "../Textarea";
import { useCreateUserByAdmin } from "@/features/admin/useCreateUserByAdmin";

export type AddNewUserProps = {
    onSuccess: () => void
}

export default function AddNewUser({
    onSuccess
}: AddNewUserProps) {
    const createUserByAdminMutation = useCreateUserByAdmin();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
        mode: "onChange"
    });

    function onSubmit(data: SignupInput) {
        createUserByAdminMutation.mutate(data, {
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
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                    />
                <Input
                    type="password"
                    id="confirmPassword"
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    />
                <Textarea
                    rows={5}
                    id="address"
                    label="Address"
                    error={errors.address?.message}
                    {...register("address")}
                    />
                    <fieldset className="flex flex-col gap-4">
                        <legend className="sr-only">Select Role</legend>
                        {USER_ROLES.map(role => (
                            <Input
                                key={role}
                                label={StringUtils.toTitleCase(role === "NORMAL_USER" ? "User" : role)}
                                value={role}
                                id={role}
                                type="radio"
                                {...register("role")}
                            />
                        ))}
                        <InputError error={errors.role?.message} />
                    </fieldset>
                <Button as="button" variant="primary" type="submit" disabled={createUserByAdminMutation.isPending}>
                    { createUserByAdminMutation.isPending ? "Wait..." :  "Create User" }
                </Button>
            </form>
        </div>
    );
}