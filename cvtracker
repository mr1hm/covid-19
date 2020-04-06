--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lastupdated; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.lastupdated (
    id integer NOT NULL,
    datetime character varying(20) NOT NULL,
    country text NOT NULL
);


ALTER TABLE public.lastupdated OWNER TO dev;

--
-- Name: lastupdated_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.lastupdated_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lastupdated_id_seq OWNER TO dev;

--
-- Name: lastupdated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.lastupdated_id_seq OWNED BY public.lastupdated.id;


--
-- Name: lastupdated id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.lastupdated ALTER COLUMN id SET DEFAULT nextval('public.lastupdated_id_seq'::regclass);


--
-- Data for Name: lastupdated; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.lastupdated (id, datetime, country) FROM stdin;
1	2020-03-27 22:14:55	United States
\.


--
-- Name: lastupdated_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.lastupdated_id_seq', 3, true);


--
-- Name: lastupdated lastupdated_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.lastupdated
    ADD CONSTRAINT lastupdated_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

