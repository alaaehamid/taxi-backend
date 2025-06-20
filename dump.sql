--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    license_plate text NOT NULL,
    make text,
    model text,
    year integer
);


ALTER TABLE public.cars OWNER TO postgres;

--
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cars_id_seq OWNER TO postgres;

--
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    license_number text,
    username text,
    password text
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_id_seq OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    driver_id integer,
    car_id integer,
    amount numeric(10,2),
    description text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type text
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: shifts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shifts (
    id integer NOT NULL,
    driver_id integer,
    car_id integer,
    start_time timestamp without time zone,
    end_time timestamp without time zone
);


ALTER TABLE public.shifts OWNER TO postgres;

--
-- Name: shifts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shifts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shifts_id_seq OWNER TO postgres;

--
-- Name: shifts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shifts_id_seq OWNED BY public.shifts.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: shifts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts ALTER COLUMN id SET DEFAULT nextval('public.shifts_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, name, username, password) FROM stdin;
1   Admin User  admin   admin
\.


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cars (id, license_plate, make, model, year) FROM stdin;
1	AD61	mazda	zoom	2005
2	fffff	BMW	i3	2000
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (id, name, address, phone, license_number, username, password) FROM stdin;
1	alaa1	en5	999999999	123456	alaa1	1234
2	alaa2	en66	3443534534634	234234234	alaa2	1234
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, driver_id, car_id, amount, description, "timestamp", type) FROM stdin;
2	1	1	60.00	petrol full	2025-06-03 20:39:56.502493	fuel
3	1	1	20.00	wheels	2025-06-03 20:40:08.419109	maintenance
4	1	1	12.50	wood str	2025-06-03 20:40:23.028741	parking
5	2	1	10.00	half petrol	2025-06-03 20:41:04.216501	fuel
6	2	1	20.00	food	2025-06-03 20:41:16.082881	personal
7	1	1	100.00	petrol	2025-06-04 21:19:45.998967	fuel
8	1	1	1.00	parking	2025-06-04 21:33:35.14606	parking
\.


--
-- Data for Name: shifts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shifts (id, driver_id, car_id, start_time, end_time) FROM stdin;
3	1	1	2025-06-03 20:39:37.744092	2025-06-03 20:39:41.749111
4	1	1	2025-06-03 20:40:45.116404	2025-06-03 20:40:47.281509
5	1	1	2025-06-03 20:40:48.356025	2025-06-03 20:40:49.555812
6	1	1	2025-06-03 23:16:20.417132	\N
7	1	1	2025-06-04 21:19:17.74974	2025-06-04 21:19:21.060779
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cars_id_seq', 2, true);


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_id_seq', 2, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 8, true);


--
-- Name: shifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shifts_id_seq', 7, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_username_key UNIQUE (username);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: shifts shifts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id);


--
-- Name: expenses expenses_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: shifts shifts_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id);


--
-- Name: shifts shifts_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- PostgreSQL database dump complete
--

