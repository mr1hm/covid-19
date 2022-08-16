--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

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

ALTER TABLE ONLY public.lastupdated DROP CONSTRAINT lastupdated_pkey;
ALTER TABLE public.lastupdated ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.lastupdated_id_seq;
DROP TABLE public.lastupdated;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lastupdated; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lastupdated (
    id integer NOT NULL,
    datetime character varying(20) NOT NULL,
    country text,
    infections bigint,
    recovered bigint,
    deaths bigint,
    increased boolean
);


--
-- Name: lastupdated_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lastupdated_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lastupdated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lastupdated_id_seq OWNED BY public.lastupdated.id;


--
-- Name: lastupdated id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lastupdated ALTER COLUMN id SET DEFAULT nextval('public.lastupdated_id_seq'::regclass);


--
-- Data for Name: lastupdated; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lastupdated (id, datetime, country, infections, recovered, deaths, increased) FROM stdin;
7	1586192780	\N	\N	\N	\N	t
8	1586196381	\N	\N	\N	\N	t
9	1586196381	\N	\N	\N	\N	t
10	1586196381	\N	\N	\N	\N	t
11	1586196381	\N	\N	\N	\N	t
12	1586196381	\N	\N	\N	\N	t
13	1586196381	\N	\N	\N	\N	t
14	1586275581	\N	\N	\N	\N	t
15	1586275581	\N	\N	\N	\N	t
16	1586275581	\N	\N	\N	\N	t
1	1586426779	United States	1511104	328661	88338	f
\.


--
-- Name: lastupdated_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lastupdated_id_seq', 16, true);


--
-- Name: lastupdated lastupdated_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lastupdated
    ADD CONSTRAINT lastupdated_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

