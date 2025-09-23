import { sql, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const USER_ROLES = [
    "SYSTEM_ADMINISTRATOR", 
    "NORMAL_USER", 
    "STORE_OWNER"
] as const;

export type USER_ROLES = typeof USER_ROLES[number];

export const rolesTable = pgTable('roles', {
    roleId: uuid('role_id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    roleName: text('role_name').notNull().unique(),
});

export type RoleModel = InferSelectModel<typeof rolesTable>;
export type NewRole = Omit<RoleModel, "roleId">;

export const permissionsLookupTable = pgTable('permission_lookup', {
    permission: text('permission').primaryKey(),
});

export const rolePermissionsTable = pgTable('role_permissions', {
    permissionId: uuid('permission_id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    roleId: uuid('role_id')
        .notNull()
        .references(() => rolesTable.roleId),
    permission: text('permission')
        .notNull()
        .references(() => permissionsLookupTable.permission),
});


export type RolePermissionModel = InferSelectModel<typeof rolePermissionsTable>;
export type NewRolePermission = RolePermissionModel;


// export const rolePermissionsTable = pgTable("role_permissions", {
//     id: uuid('id')
//         .primaryKey()
//         .default(sql`gen_random_uuid()`),
//     roleId: uuid("role_id")
//         .references(() => rolesTable.roleId),
//     permissionId: uuid("permission_id")
//         .references(() => permissionsTable.permissionId),
// });

export const usersTable = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 60 }).notNull(),
  email: text('email').notNull(),
  address: varchar('address', { length: 400 }).notNull(),
  hashedPassword: text('hashed_password').notNull(),
  roleId: uuid('role_id')
    .notNull()
    .references(() => rolesTable.roleId),
});

export const uniqueEmailRole = unique('unique_email_role')
  .on(usersTable.email, usersTable.roleId);

export type UserModel = InferSelectModel<typeof usersTable>;
export type NewUser = Omit<UserModel, "id">;


/**
 * Store Table
*/
export const storesTable = pgTable("stores", {
    id: uuid("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 60 }).notNull(),
    email: text("email").notNull().unique(),
    ownerId: uuid("owner_id").notNull().references(() => usersTable.id),
    address: varchar("address", { length: 400 }).notNull()
});

export type StoreModel = InferSelectModel<typeof storesTable>;
export type NewStore = Omit<StoreModel, "id">;

export const storeRatingsTable = pgTable("store_ratings", {
    id: uuid("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    storeId: uuid("store_id").notNull().references(() => storesTable.id),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    rating: integer("rating")
});

export type StoreRatingModel = InferSelectModel<typeof storeRatingsTable>;
export type NewStoreRating = {
    [K in keyof Omit<StoreRatingModel, "id">]: NonNullable<Omit<StoreRatingModel, "id">[K]>
};