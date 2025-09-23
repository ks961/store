# Store

[Store Frontend](#store-frontend)  
[Store Backend](#store-backend)

## Store Frontend

---

## Public Routes

These pages can be accessed without logging in.

* `/` → **Home page**

  * File: `app/page.tsx`

* `/login` → **Login page**

  * File: `app/(public)/login/page.tsx`

* `/signup` → **Signup page**

  * File: `app/(public)/signup/page.tsx`

---

## Protected Routes

These pages require authentication (user must be logged in).
They are grouped under `app/(protected)/`.

* `/admins` → **Admins page**

  * File: `app/(protected)/admins/page.tsx`

* `/dashboard` → **Dashboard page**

  * File: `app/(protected)/dashboard/page.tsx`

* `/profile` → **Profile page**

  * File: `app/(protected)/profile/page.tsx`

* `/stores` → **Stores page**

  * File: `app/(protected)/stores/page.tsx`

* `/users` → **Users page**

  * File: `app/(protected)/users/page.tsx`

---

## Shared Files

* `app/layout.tsx` → Main layout for the whole app.
* `app/globals.css` → Global styles.
* `app/error.tsx` → Error handling UI.


---

## Store Backend


## Scripts

### 1. Development

```bash
bun run dev
```

Runs the backend server in development mode.

* Uses `bun --watch src/server.ts`
* Automatically reloads on file changes.

---

### 2. Database: Generate

```bash
bun run db:generate
```

Generates SQL migrations from the Drizzle schema.

* Uses `bunx drizzle-kit generate`
* Creates migration files based on schema changes.

---

### 3. Database: Push

```bash
bun run db:push
```

Pushes the latest schema changes directly to the database.

* Uses `bunx drizzle-kit push`
* Syncs database with schema (without generating separate migration files).

---

### 4. Build

```bash
bun run build
```

Builds the backend for production.

* Uses `bun build --target=bun src/server.ts --outdir dist/`
* Outputs compiled files into the `dist/` folder.

---

## Users API (`/v1/users`)

All routes under `/v1/users` require:

* **requireAccessToken** → Checks that a valid access token is present.
* **isAuthenticated** → Ensures the user is authenticated.
* **validateRequest** → Validates request parameters, query, or body using Zod schemas.

---

## Endpoints

### 1. Get Users

**`GET /v1/users`**

Fetch users with optional filters.

* **Query Params**: Must match `FilterUsersSchema`
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `UserController.getUsersBy`

---

### 2. User Dashboard

**`GET /v1/users/dashboard`**

Fetch dashboard data for the authenticated user.

* **Middleware**: `requireAccessToken`, `isAuthenticated`
* **Controller**: `UserController.dashboard`

---

### 3. Create User

**`POST /v1/users`**

Create a new user.

* **Body**: Must match `CreateUserSchema`
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `UserController.createUser`

---

### 4. Get User by ID

**`GET /v1/users/:id`**

Fetch a single user by ID.

* **Params**: `{ id: string }` (validated with `FilterUsersSchema.pick({ id: true })`)
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `UserController.getUserProfile`

---

### 5. Update User

**`PATCH /v1/users/:id`**

Update an existing user.

* **Params**: `{ id: string }`
* **Body**:

  * Combination of:

    * `FilterUsersSchema.omit({ id: true, roleName: true })`
    * `CreateUserSchema.pick({ password: true })`
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `UserController.updateUser`

---

### 6. Delete User

**`DELETE /v1/users/:id`**

Delete a user by ID.

* **Params**: `{ id: string }`
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `UserController.deleteUser`

---

Nice — let’s document the **auth router** (`/v1/auth`) the same way.
Here’s the clean Markdown doc:

---

## Authentication API (`/v1/auth`)

Handles signup, login, token validation, logout, and user profile retrieval.

---

### 1. Signup

**`POST /v1/auth/signup`**

Register a new user.

* **Body**: Must match `CreateUserSchema`
* **Middleware**: `validateRequest`
* **Controller**: `AuthController.signup`

---

### 2. Login

**`POST /v1/auth/login`**

Authenticate a user and return an access token.

* **Body**: Must match `LoginUserSchema`
* **Middleware**: `validateRequest`
* **Controller**: `AuthController.login`

---

### 3. Validate Token

**`POST /v1/auth/validate`**

Check if the provided access token is valid.

* **Middleware**: `requireAccessToken`
* **Controller**: `AuthController.validate`

---

### 4. Logout

**`POST /v1/auth/logout`**

Invalidate the current user’s session or access token.

* **Middleware**: `requireAccessToken`
* **Controller**: `AuthController.logout`

---

### 5. Get Current User

**`GET /v1/auth/me`**

Retrieve the profile of the currently authenticated user.

* **Middleware**: `requireAccessToken`, `isAuthenticated`
* **Controller**: `AuthController.getProfile`

---

## Stores API (`/v1/stores`)

### 1. Get All Stores

**`GET /v1/stores`**

Retrieve a list of all stores.

* **Middleware**: *none* (public route)
* **Controller**: `StoreController.getAllStores`

---

### 2. List Users in Stores

**`GET /v1/stores/users`**

Retrieve users associated with stores (auth required).

* **Middleware**: `requireAccessToken`, `isAuthenticated`
* **Controller**: `StoreController.listUsers`

---

### 3. Get Store by ID

**`GET /v1/stores/:id`**

Retrieve details of a specific store.

* **Params**: `{ id: string }` (validated with `StoreIdSchema`)
* **Middleware**: `validateRequest`
* **Controller**: `StoreController.getStore`

---

### 4. Create Store

**`POST /v1/stores`**

Create a new store.

* **Body**: Must match `CreateStoreSchema`
* **Middleware**: `validateRequest`, `requireAccessToken`, `isAuthenticated`
* **Controller**: `StoreController.createStore`

---

### 5. Update Store

**`PATCH /v1/stores/:id`**

Update details of a store.

* **Params**: `{ id: string }` (validated with `StoreIdSchema`)
* **Body**: Must match `UpdateStoreSchema`
* **Middleware**: `validateRequest`, `requireAccessToken`, `isAuthenticated`
* **Controller**: `StoreController.updateStore`

---

### 6. Delete Store

**`DELETE /v1/stores/:id`**

Delete a store by ID.

* **Params**: `{ id: string }` (validated with `StoreIdSchema`)
* **Middleware**: `validateRequest`, `requireAccessToken`, `isAuthenticated`
* **Controller**: `StoreController.deleteStore`

---

### 7. Store Ratings (Nested Routes)

**`/v1/stores/:id/ratings`**

Forwarded to `storeRatingsRouter`.

* **Params**: `{ id: string }` (validated with `StoreIdSchema`)
* **Middleware**: `validateRequest`
* **Controller**: handled by `storeRatingsRouter`

---

# Store Ratings API (`/v1/stores/:id/ratings`)

Handles creating, reading, updating, and deleting ratings for a store.
Each route is scoped under a store (`:id` in parent route).

---

## Endpoints

### 1. Get Store Ratings

**`GET /v1/stores/:id/ratings`**

Retrieve all ratings for a given store.

* **Params**: `{ id: string }` (validated by parent `StoreIdSchema`)
* **Middleware**: *none (public route)*
* **Controller**: `StoreRatingController.getStoreRating`

---

### 2. Get My Rating for a Store

**`GET /v1/stores/:id/ratings/me`**

Retrieve the rating submitted by the currently authenticated user for a specific store.

* **Params**: `{ id: string }` (from parent)
* **Middleware**: `requireAccessToken`, `isAuthenticated`
* **Controller**: `StoreRatingController.getStoreRatingForNormalUser`

---

### 3. Submit Rating

**`POST /v1/stores/:id/ratings`**

Submit a new rating for a store.

* **Params**: `{ id: string }` (from parent)
* **Body**: `{ rating: number }` (validated by `CreateStoreRatingSchema.pick({ rating: true }).required()`)
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `StoreRatingController.submitRating`

---

### 4. Update Rating

**`PATCH /v1/stores/:id/ratings/:storeRatingId`**

Update an existing rating for a store.

* **Params**: `{ id: string, storeRatingId: string }` (validated with `UpdateStoreRatingParamSchema`)
* **Body**: `{ rating: number }` (validated by `CreateStoreRatingSchema.pick({ rating: true }).required()`)
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `StoreRatingController.updateStoreRating`

---

### 5. Delete Rating

**`DELETE /v1/stores/:id/ratings/:storeRatingId`**

Delete a rating by its ID.

* **Params**: `{ id: string, storeRatingId: string }` (validated with `UpdateStoreRatingParamSchema`)
* **Middleware**: `requireAccessToken`, `isAuthenticated`, `validateRequest`
* **Controller**: `StoreRatingController.deleteStoreRating`
