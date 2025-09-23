import { z } from 'zod';
import { USER_ROLES } from 'src/db/schema';
import type { SuccessResponse } from '@types';
import type { User } from '@domains/entities/user';
import type { Store } from '@domains/entities/store';
import type { StoreRating } from '@domains/entities/store-rating';
import type { UserLoginClaims } from '@services/authentication';

export const CreateUserSchema = z.object({
  name: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string"
    })
    .min(3, { error: "Name cannot be less than 3 characters" })
    .max(60, { error: "Name cannot exceed 60 characters" }),

  email: z
    .email({ error: "Email must be a valid email address" }),

  address: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Address is required"
          : "Address must be a string"
    })
    .min(1, { error: "Address cannot be empty" })
    .max(400, { error: "Address cannot exceed 400 characters" }),

  role: z
    .enum(USER_ROLES, {
      error: (issue) =>
        issue.input === undefined
          ? "Role is required"
          : `Role must be one of System Administrator, Normal User, Store Owner`
    }),

  password: z
    .string({ error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string"
    })
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(16, { error: "Password cannot exceed 16 characters" })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
});

export type CreateUserRequestDto = z.infer<typeof CreateUserSchema>;
export type CreateUserResponseDto = SuccessResponse<undefined>;
export type CreateUserByAdminResponseDto = SuccessResponse<User>;

/* ===================================================================================== */

export const LoginUserSchema = CreateUserSchema.pick({
  email: true, 
  password: true,
  role: true
});

export type LoginUserRequestDto = z.infer<typeof LoginUserSchema>;
export type LoginUserReponseDto = SuccessResponse<UserLoginClaims>;

/* ===================================================================================== */

export type LogoutUserReponseDto = SuccessResponse<undefined>;

/* ===================================================================================== */

export type AuthUserProfileResponseDto = SuccessResponse<User>;

/* ===================================================================================== */

export const FilterUsersSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  address: z.string().optional(),
  roleName: z.string().optional(),
  id: z.uuid().optional(),
});

export type FilterUserRequestDto = z.infer<typeof FilterUsersSchema>;
export type FilterUserResponseDto = SuccessResponse<User[]>;

/* ===================================================================================== */

export type AdminDashboardResponseDto = {
  totalUsers: number,
  totalStores: number,
  totalRatings: number
}

export type StoreOwnerDashboardResponseDto = {
  stores: Array<Store>,
  averageRating: number
};

export type NormalUserDashboardResponseDto = {
  totalRatings: number,
  recentlyRated: StoreRating[],
}