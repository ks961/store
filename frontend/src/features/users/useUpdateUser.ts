import { CreateUserRequestDto, updateUserProfile } from "@/api/users.api";
import { useMutation } from "@tanstack/react-query";

type UpdateMutation = { user: Partial<CreateUserRequestDto>, userId: string }

export function useUpdateUser() {
    return useMutation({
        mutationFn: ({ user, userId }: UpdateMutation) => updateUserProfile(user, userId)
    });
}