'use client';
import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import InputError from "@/components/Input/InputError";
import Textarea from "@/components/Textarea";
import { SignupInput, SignupSchema, USER_ROLES } from "@/features/auth/schemas";
import { useSignup } from "@/features/auth/useSignup";
import { StringUtils } from "@d3vtool/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


export default function SignupPage() {

    const signupMutation = useSignup();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
        mode: "onChange"
    });

    function onSubmit(data: SignupInput) {
        signupMutation.mutate(data, {
            onSuccess: (response) => {
                const result = response.data;
                if(result.success) {
                    router.push("/login");
                }
            },
            onError: (err) => {
                throw err;
            }
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
                <Button as="button" variant="primary" type="submit" disabled={signupMutation.isPending}>
                    { signupMutation.isPending ? "Wait..." :  "Signup" }
                </Button>
            </form>
        </div>
    );
}