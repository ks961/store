--
-- PostgreSQL database dump
--

\restrict 4Prob0UAfaWebd4zlieeS15X9cdEHe3s29rrHMyhcos1VDlo9MBoC710Cea5o6U

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: permission_lookup; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.permission_lookup (
    permission text NOT NULL
);


ALTER TABLE public.permission_lookup OWNER TO l0c4l;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.role_permissions (
    permission_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    permission text NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO l0c4l;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.roles (
    role_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_name text NOT NULL
);


ALTER TABLE public.roles OWNER TO l0c4l;

--
-- Name: store_ratings; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.store_ratings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rating integer,
    store_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.store_ratings OWNER TO l0c4l;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.stores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(60) NOT NULL,
    email text NOT NULL,
    address character varying(400) NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.stores OWNER TO l0c4l;

--
-- Name: users; Type: TABLE; Schema: public; Owner: l0c4l
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(60) NOT NULL,
    email text NOT NULL,
    address character varying(400) NOT NULL,
    hashed_password text NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.users OWNER TO l0c4l;

--
-- Data for Name: permission_lookup; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.permission_lookup (permission) FROM stdin;
ADD_NORMAL_USER
ADD_ADMIN_USER
ADD_STORE_OWNER_USER
ADD_STORE
VIEW_NORMAL_USERS
VIEW_ADMIN_USERS
VIEW_STORE_OWNER_USERS
VIEW_STORES
VIEW_STORE_RATINGS
MODIFY_NORMAL_USER
MODIFY_ADMIN_USER
MODIFY_STORE_OWNER_USER
MODIFY_RATING
MODIFY_OWN_PROFILE
VIEW_OWN_STORE_RATINGS
VIEW_USERS_WHO_RATED_OWN_STORE
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.role_permissions (permission_id, role_id, permission) FROM stdin;
d9c5e115-380c-4c10-952d-a6ed7c46576e	bdd49e48-f486-46bd-a34d-a5b1a5f54015	ADD_NORMAL_USER
f515ef8a-aab2-46d8-ab30-68a081050f31	bdd49e48-f486-46bd-a34d-a5b1a5f54015	ADD_ADMIN_USER
adaaffe6-f05c-4ea3-b607-ebee3bd7d230	bdd49e48-f486-46bd-a34d-a5b1a5f54015	ADD_STORE
ba20accd-e290-44e8-8683-fb9f134f8a41	bdd49e48-f486-46bd-a34d-a5b1a5f54015	VIEW_NORMAL_USERS
2fa830d4-1c54-4e10-8cbf-e104682bf7cc	bdd49e48-f486-46bd-a34d-a5b1a5f54015	VIEW_ADMIN_USERS
b2208d60-e211-4144-9b41-2b8c96800deb	bdd49e48-f486-46bd-a34d-a5b1a5f54015	VIEW_STORE_OWNER_USERS
2fb9e059-c98b-408d-bf57-8ba4a00ec31d	bdd49e48-f486-46bd-a34d-a5b1a5f54015	VIEW_STORES
9a821c9c-ca5f-4aef-b508-c018ca3aa2fb	15801f30-bf8e-4777-a4b6-b6b9cf9dbb5a	VIEW_STORES
dcb51183-9bd1-4ba5-bab0-bb8277feeb34	15801f30-bf8e-4777-a4b6-b6b9cf9dbb5a	MODIFY_RATING
9dd5e9af-8480-4aab-9a5a-293ee6b95fa9	15801f30-bf8e-4777-a4b6-b6b9cf9dbb5a	MODIFY_OWN_PROFILE
3751f3c7-916e-45b7-8b6c-a30d02da7533	1b903d4d-5df5-4536-b6b1-68e38974c075	MODIFY_OWN_PROFILE
3bed928f-95d9-4906-b506-5dad74b422e6	1b903d4d-5df5-4536-b6b1-68e38974c075	VIEW_OWN_STORE_RATINGS
b98fbf6d-a49f-4017-aff3-aa817d160bae	1b903d4d-5df5-4536-b6b1-68e38974c075	VIEW_USERS_WHO_RATED_OWN_STORE
d6449cca-bfc9-471f-b32d-7b0784d2fd01	bdd49e48-f486-46bd-a34d-a5b1a5f54015	MODIFY_OWN_PROFILE
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.roles (role_id, role_name) FROM stdin;
bdd49e48-f486-46bd-a34d-a5b1a5f54015	SYSTEM_ADMINISTRATOR
15801f30-bf8e-4777-a4b6-b6b9cf9dbb5a	NORMAL_USER
1b903d4d-5df5-4536-b6b1-68e38974c075	STORE_OWNER
\.


--
-- Data for Name: store_ratings; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.store_ratings (id, rating, store_id, user_id) FROM stdin;
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.stores (id, name, email, address, owner_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: l0c4l
--

COPY public.users (id, name, email, address, hashed_password, role_id) FROM stdin;
\.


--
-- Name: permission_lookup permission_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.permission_lookup
    ADD CONSTRAINT permission_lookup_pkey PRIMARY KEY (permission);


--
-- Name: role_permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_unique; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_unique UNIQUE (role_name);


--
-- Name: store_ratings store_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.store_ratings
    ADD CONSTRAINT store_ratings_pkey PRIMARY KEY (id);


--
-- Name: stores stores_email_unique; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_email_unique UNIQUE (email);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_permission_permission_lookup_permission_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_permission_lookup_permission_fk FOREIGN KEY (permission) REFERENCES public.permission_lookup(permission);


--
-- Name: role_permissions role_permissions_role_id_roles_role_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: store_ratings store_ratings_store_id_stores_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.store_ratings
    ADD CONSTRAINT store_ratings_store_id_stores_id_fk FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- Name: store_ratings store_ratings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.store_ratings
    ADD CONSTRAINT store_ratings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: stores stores_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: users users_role_id_roles_role_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: l0c4l
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 4Prob0UAfaWebd4zlieeS15X9cdEHe3s29rrHMyhcos1VDlo9MBoC710Cea5o6U

