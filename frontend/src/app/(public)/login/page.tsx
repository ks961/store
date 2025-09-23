'use client';
import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import InputError from "@/components/Input/InputError";
import { useUserContext } from "@/contexts/UserContext/UserContext";
import { LoginInput, LoginSchema, USER_ROLES } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/useLogin";
import { StringUtils } from "@d3vtool/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {

    const { setUser } = useUserContext();

    const loginMutation = useLogin();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(LoginSchema),
        mode: "onChange",
    });


    const isPending = loginMutation.isPending;

    function onSubmit(data: LoginInput) {
        loginMutation.mutate(data, {
            onSuccess: (response) => {
                
                if(response.data.success) {
                    setUser(response.data.data);
                    return router.push("/dashboard");
                }
            },
            onError: (err) => {
                throw err;
            }
        })
    }

    return (
        <div className="w-full flex flex-col items-center mt-20 gap-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-96">
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
                <Button as="button" variant="primary" type="submit" disabled={isPending}>
                    { isPending ? "Logging in..." : "Login" }
                </Button>
            </form>
        </div>
    );
}