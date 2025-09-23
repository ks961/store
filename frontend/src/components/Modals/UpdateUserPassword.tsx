'use client';
import { SignupInput, SignupSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input/Input";
import { useUpdateUser } from "@/features/users/useUpdateUser";
import { useUserContext } from "@/contexts/UserContext/UserContext";

export type UpdateUserPasswordProps = {
    onSuccess: () => void
}

type UpdatePasswordInput = Pick<SignupInput, "password" | "confirmPassword">;

export default function UpdateUserPassword({
    onSuccess
}: UpdateUserPasswordProps) {
    const { user } = useUserContext();
    const updateUserProfileMutation = useUpdateUser();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UpdatePasswordInput>({
        resolver: zodResolver(SignupSchema.pick({ password: true, confirmPassword: true })),
        mode: "onChange"
    });

    function onSubmit(data: UpdatePasswordInput) {
        updateUserProfileMutation.mutate({ user: {
            password: data.password
        }, userId: user!.userId }, {
            onSuccess,
        });
    }

    return (
        <div className="w-full flex flex-col items-center mt-8 gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
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
                <Button as="button" variant="primary" type="submit" disabled={updateUserProfileMutation.isPending}>
                    { updateUserProfileMutation.isPending ? "Wait..." :  "Update Password" }
                </Button>
            </form>
        </div>
    );
}