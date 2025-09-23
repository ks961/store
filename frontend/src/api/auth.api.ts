import { api } from "./client";
import { LoginInput, SignupInput } from "@/features/auth/schemas";


export function signup(
    signupPayload: SignupInput
) {
    return api.post('/v1/auth/signup', signupPayload);
}

export function login(
    loginPayload: LoginInput
) {
    return api.post('/v1/auth/login', loginPayload);
}

export function logout() {
    return api.post('/v1/auth/logout');
}

export async function validateToken(
    token?: string
) {
    if(!token) return false;
    const response = await api.post('/v1/auth/validate', { token });
    
    return response.status === 200 && (response.data.success as boolean);
}

export async function getMyProfile() {
    const response = await api.get('/v1/auth/me');
    
    return response.data.data;
}