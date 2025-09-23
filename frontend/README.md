# Frontend Routes (Next.js)

This project uses the **App Router** in Next.js.
Each folder inside the `app/` directory represents a route.
Files like `page.tsx` are rendered as pages, and `layout.tsx` is used as a wrapper for pages inside that folder.

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