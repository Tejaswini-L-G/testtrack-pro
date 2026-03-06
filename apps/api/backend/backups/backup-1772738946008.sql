--
-- PostgreSQL database dump
--

\restrict WlE8DPU623tl5GKj3Nlt9sCGvZec0s2fj4VzhJY7n5Z4boBTF5dFbkIfN6GCkKF

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ApiKey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApiKey" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."ApiKey" OWNER TO postgres;

--
-- Name: Attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attachment" (
    id text NOT NULL,
    "fileName" text NOT NULL,
    "fileType" text NOT NULL,
    "filePath" text NOT NULL,
    "testCaseId" text,
    "testStepId" text,
    "uploadedById" text NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Bug; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bug" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity text NOT NULL,
    priority text NOT NULL,
    status text DEFAULT 'Open'::text NOT NULL,
    "testCaseId" text,
    "runId" text,
    "stepNumber" integer,
    "evidencePath" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" text,
    "reportedById" text,
    "assignedToId" text,
    "actualBehavior" text,
    "affectedVersion" text,
    "bugId" text,
    environment text,
    "expectedBehavior" text,
    "stepsToReproduce" text,
    type text,
    "commitLink" text,
    "fixNotes" text,
    "fixedAt" timestamp(3) without time zone,
    "resolutionNote" text,
    "startedAt" timestamp(3) without time zone,
    "projectId" text NOT NULL,
    "branchName" text
);


ALTER TABLE public."Bug" OWNER TO postgres;

--
-- Name: BugComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BugComment" (
    id text NOT NULL,
    content text NOT NULL,
    "bugId" text NOT NULL,
    "authorId" text NOT NULL,
    "parentId" text,
    mentions text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BugComment" OWNER TO postgres;

--
-- Name: Commit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Commit" (
    id text NOT NULL,
    hash text NOT NULL,
    message text NOT NULL,
    branch text NOT NULL,
    author text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "bugId" text
);


ALTER TABLE public."Commit" OWNER TO postgres;

--
-- Name: DashboardWidget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DashboardWidget" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    "position" integer NOT NULL,
    config jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "projectId" text,
    width integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."DashboardWidget" OWNER TO postgres;

--
-- Name: ExecutionEvidence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExecutionEvidence" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    "stepNumber" integer NOT NULL,
    "filePath" text NOT NULL,
    "fileType" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ExecutionEvidence" OWNER TO postgres;

--
-- Name: ExecutionResult; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExecutionResult" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    "executionTime" integer,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ExecutionResult" OWNER TO postgres;

--
-- Name: ExecutionStep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExecutionStep" (
    id text NOT NULL,
    "executionId" text NOT NULL,
    "stepNumber" integer NOT NULL,
    action text NOT NULL,
    expected text NOT NULL,
    actual text,
    status text,
    notes text
);


ALTER TABLE public."ExecutionStep" OWNER TO postgres;

--
-- Name: FilterPreset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FilterPreset" (
    id text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL,
    filters jsonb NOT NULL,
    "isShared" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FilterPreset" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "referenceId" text
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: NotificationPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "bugAssignedEmail" boolean DEFAULT true NOT NULL,
    "bugAssignedInApp" boolean DEFAULT true NOT NULL,
    "statusChangedEmail" boolean DEFAULT true NOT NULL,
    "statusChangedInApp" boolean DEFAULT true NOT NULL,
    "commentEmail" boolean DEFAULT false NOT NULL,
    "commentInApp" boolean DEFAULT true NOT NULL,
    "testAssignedEmail" boolean DEFAULT true NOT NULL,
    "testAssignedInApp" boolean DEFAULT true NOT NULL,
    "retestEmail" boolean DEFAULT true NOT NULL,
    "retestInApp" boolean DEFAULT true NOT NULL,
    "quietHoursStart" text,
    "quietHoursEnd" text
);


ALTER TABLE public."NotificationPreference" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    "roleId" text NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdById" text
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: ProjectCustomField; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectCustomField" (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    required boolean DEFAULT false NOT NULL,
    options text,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProjectCustomField" OWNER TO postgres;

--
-- Name: ProjectEnvironment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectEnvironment" (
    id text NOT NULL,
    name text NOT NULL,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProjectEnvironment" OWNER TO postgres;

--
-- Name: ProjectMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL,
    role text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProjectMember" OWNER TO postgres;

--
-- Name: ProjectMilestone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectMilestone" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "targetDate" timestamp(3) without time zone NOT NULL,
    "targetPassRate" double precision NOT NULL,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProjectMilestone" OWNER TO postgres;

--
-- Name: ProjectModule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectModule" (
    id text NOT NULL,
    name text NOT NULL,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProjectModule" OWNER TO postgres;

--
-- Name: ProjectWorkflow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectWorkflow" (
    id text NOT NULL,
    name text NOT NULL,
    statuses text NOT NULL,
    "projectId" text NOT NULL
);


ALTER TABLE public."ProjectWorkflow" OWNER TO postgres;

--
-- Name: ReportSchedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReportSchedule" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    frequency text NOT NULL,
    "dayOfWeek" integer,
    "time" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReportSchedule" OWNER TO postgres;

--
-- Name: ReportScheduleHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReportScheduleHistory" (
    id text NOT NULL,
    "scheduleId" text NOT NULL,
    "executedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text NOT NULL,
    message text
);


ALTER TABLE public."ReportScheduleHistory" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: SystemConfig; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemConfig" (
    id text NOT NULL,
    "defaultSeverity" text,
    "defaultPriority" text,
    "emailEnabled" boolean DEFAULT true NOT NULL,
    "autoAssignBug" boolean DEFAULT false NOT NULL,
    "maxUploadSize" integer DEFAULT 10 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemConfig" OWNER TO postgres;

--
-- Name: TemplateStep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TemplateStep" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "stepNumber" integer NOT NULL,
    action text NOT NULL,
    "testData" text,
    expected text NOT NULL
);


ALTER TABLE public."TemplateStep" OWNER TO postgres;

--
-- Name: TestCase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestCase" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    module text NOT NULL,
    priority text NOT NULL,
    severity text NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    preconditions text,
    "testData" text,
    environment text,
    postconditions text,
    "cleanupSteps" text,
    "createdById" text NOT NULL,
    "assignedTesterId" text,
    version integer DEFAULT 1 NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "impactIfFails" text,
    "testDataRequirements" text,
    "order" integer,
    "suiteId" text,
    "projectId" text NOT NULL
);


ALTER TABLE public."TestCase" OWNER TO postgres;

--
-- Name: TestCaseCustomValue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestCaseCustomValue" (
    id text NOT NULL,
    value text NOT NULL,
    "testCaseId" text NOT NULL,
    "fieldId" text NOT NULL
);


ALTER TABLE public."TestCaseCustomValue" OWNER TO postgres;

--
-- Name: TestCaseTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestCaseTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    module text NOT NULL,
    priority text NOT NULL,
    severity text NOT NULL,
    type text NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "isGlobal" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."TestCaseTemplate" OWNER TO postgres;

--
-- Name: TestCaseVersion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestCaseVersion" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    version integer NOT NULL,
    "changeLog" text NOT NULL,
    snapshot jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TestCaseVersion" OWNER TO postgres;

--
-- Name: TestExecution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestExecution" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    "executedById" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    status text NOT NULL,
    "testRunId" text
);


ALTER TABLE public."TestExecution" OWNER TO postgres;

--
-- Name: TestRun; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestRun" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'Planned'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "projectId" text NOT NULL,
    "milestoneId" text
);


ALTER TABLE public."TestRun" OWNER TO postgres;

--
-- Name: TestRunAssignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestRunAssignment" (
    id text NOT NULL,
    "testRunId" text NOT NULL,
    "testerId" text NOT NULL
);


ALTER TABLE public."TestRunAssignment" OWNER TO postgres;

--
-- Name: TestRunCase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestRunCase" (
    id text NOT NULL,
    "testRunId" text NOT NULL,
    "testCaseId" text NOT NULL
);


ALTER TABLE public."TestRunCase" OWNER TO postgres;

--
-- Name: TestStep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestStep" (
    id text NOT NULL,
    "testCaseId" text NOT NULL,
    "stepNumber" integer NOT NULL,
    action text NOT NULL,
    "testData" text,
    expected text NOT NULL
);


ALTER TABLE public."TestStep" OWNER TO postgres;

--
-- Name: TestSuite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestSuite" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    module text,
    "parentId" text,
    "projectId" text NOT NULL
);


ALTER TABLE public."TestSuite" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'tester'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resetExpiry" timestamp(3) without time zone,
    "resetToken" text,
    "failedAttempts" integer DEFAULT 0 NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "lockUntil" timestamp(3) without time zone,
    "passwordHistory" text[],
    "refreshToken" text,
    "verifyToken" text,
    active boolean DEFAULT true NOT NULL,
    "roleId" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: ApiKey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApiKey" (id, key, name, "userId", "createdAt", "isActive") FROM stdin;
a4ea4b33-a17b-4453-bff3-8748ad75f535	8f74afb0-3afd-403b-912a-d1858ca4946c	CI/CD Key	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-04 15:55:30.187	t
\.


--
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attachment" (id, "fileName", "fileType", "filePath", "testCaseId", "testStepId", "uploadedById", "isDeleted", "createdAt") FROM stdin;
9c25c40e-e4d4-4d2b-a9a4-57f039dbbb84	Screenshot (2).png	image/png	uploads\\1771327088775-Screenshot (2).png	05d71e78-f5b0-4a5d-942d-66559df895d1	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	f	2026-02-17 11:18:08.786
8de631a0-5294-46bc-8659-d34bab736476	r2.jpg	image/jpeg	uploads\\1771519121126-r2.jpg	075f277a-1313-49dc-b306-7ade4d9fbfc9	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	f	2026-02-19 16:38:41.137
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, entity, "entityId", details, "createdAt", "userId", "isArchived") FROM stdin;
559b87e0-4c5d-41c5-bc8c-303fb5dbb82d	Delete Project	Project	\N	Project ID: 0c3996d6-9386-4b59-accf-f6327f038eea	2026-02-27 11:59:09.407	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
540defcb-a67c-4b5e-9652-80cf384c9f9c	Delete Project	Project	\N	Project ID: d56c8397-1336-4c11-a4c8-82f4e1f464c1	2026-02-27 11:59:14.867	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
1650642e-6fbf-4f33-b095-b44e7be32bdc	Delete Project	Project	\N	Project ID: 8d8af8d4-3ab9-4a69-b096-e5222ed0b79c	2026-02-27 12:02:03.744	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
cd658386-e80f-4baf-a689-0245d163c75d	Create Project	Project	\N	Farm	2026-02-27 12:03:46.882	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
7eda47de-8220-48ec-b0a0-e906c94cf1ac	Create Project	Project	\N	Project: Warehouse 	2026-02-27 12:05:52.631	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
b6b879cf-b400-49ab-ab0f-4cbb2cb159ae	Deactivate User	User	\N	User ID: 6fa87983-9f89-4966-a143-421951234a3d	2026-02-27 12:06:21.895	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
0221a1ad-b05f-46e6-b4d4-5086aad8f003	Deactivate User	User	\N	User ID: 981d64dc-f8ce-4e74-91d0-3ac861069361	2026-02-28 04:40:59.017	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
bdc1e68c-7c4c-4737-8da3-741468229608	Deactivate User	User	\N	User ID: 8c279212-efda-4da5-948e-7883af7e6eb4	2026-02-28 04:41:06.164	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
d1a04071-d3f3-4beb-9c5e-9e701a292ef6	Update User	User	981d64dc-f8ce-4e74-91d0-3ac861069361	User ID: 981d64dc-f8ce-4e74-91d0-3ac861069361	2026-02-27 18:19:46.878	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
f4b2aa91-d328-4a3e-9b24-acdc5e3aca09	Deactivate User	User	\N	User ID: 8c279212-efda-4da5-948e-7883af7e6eb4	2026-02-28 10:43:13.342	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
5d330c8a-cb43-4132-8aae-22e0f4ee771f	Deactivate User	User	\N	User ID: e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	2026-02-28 10:43:14.571	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
7906bdf2-12b5-4d30-a8d7-ffdcef929956	Delete Project	Project	\N	Project ID: d79635bd-5730-4dae-9279-031745a6d035	2026-02-28 10:52:41.761	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
15e39fb0-5409-4c2f-8788-e35a2597ddfe	Create Project	Project	\N	Project: Farm	2026-02-28 10:52:50.167	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t
88ef72ff-fc8c-4d80-8b3e-23c750c4e80d	Archive Project	9fe49374-d183-4f11-9ad3-ed1484aedac3	\N	Project	2026-02-28 11:09:35.974	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
62fe8ab8-8558-4428-b6ae-7ac723dd2baa	Archive Project	9fe49374-d183-4f11-9ad3-ed1484aedac3	\N	Project	2026-02-28 11:09:39.528	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
575b9d5c-fdf5-406a-a7a8-14e99fcf0be1	Create User	c221c249-d575-4a79-90f8-5eb415527218	\N	User	2026-02-28 11:18:48.323	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2077e71f-2303-4e8c-8784-246b8ddecd11	Create User	686dd7e6-7da1-49a1-9d54-559ffc2b58fd	\N	User	2026-02-28 11:19:20.287	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
f655d344-3c9f-4c94-905a-d9ad8c5a5e76	Update User	User	f682f61d-6909-4ae9-aa01-3ee808f057a6	User ID: f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 11:19:44.723	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
8080c16b-602a-4d29-bfdf-2285fcd34dba	Deactivate User	User	\N	User ID: dadb6a81-dce0-4a20-b926-bc56405b774f	2026-02-28 11:33:21.97	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2bbfcf61-3e6b-4be9-bc36-62b0ffd7ad32	Deactivate User	User	\N	User ID: 686dd7e6-7da1-49a1-9d54-559ffc2b58fd	2026-02-28 11:33:23.777	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
e094959e-8217-4e2d-8084-139fdcebd0dc	Deactivate User	User	\N	User ID: 8c279212-efda-4da5-948e-7883af7e6eb4	2026-02-28 11:33:30.451	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
af80f768-170b-4b88-ae91-ab251f52c68f	Deactivate User	User	\N	User ID: 34124ee8-0242-4699-88e5-f6c7d5c95550	2026-02-28 11:33:32.058	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
20c04fd3-8215-4fa0-ae80-82c8889f33a3	Activate User	6fa87983-9f89-4966-a143-421951234a3d	Activated user ash@gmail.com	User	2026-02-28 11:37:44.683	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
cbf0f15b-2063-4701-a165-847727b7b2b1	Deactivate User	User	\N	User ID: 5d7dceac-43a2-472f-8d39-212fbb369ba6	2026-02-28 11:37:47.608	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
a01f5ce1-1b3c-47ae-83d6-e5921236fe5c	Activate User	dadb6a81-dce0-4a20-b926-bc56405b774f	Activated user anusha@gmail.com	User	2026-02-28 11:37:50.798	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
a39f96c2-e46d-481c-a8d7-098d7710e5c2	Activate User	686dd7e6-7da1-49a1-9d54-559ffc2b58fd	Activated user savi@gmail.com	User	2026-02-28 11:37:51.861	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
15feaee9-6102-456d-92ff-329436369a80	Activate User	8c279212-efda-4da5-948e-7883af7e6eb4	Activated user ven@gmail.com	User	2026-02-28 11:37:52.836	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
3d429b85-bd38-42f3-a9ef-93575cc1df0a	Activate User	5d7dceac-43a2-472f-8d39-212fbb369ba6	Activated user spoo@gmail.com	User	2026-02-28 11:37:54.69	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
f96308ed-1ef7-497b-9e19-aabe8a621c50	Activate User	34124ee8-0242-4699-88e5-f6c7d5c95550	Activated user theju@gmail.com	User	2026-02-28 11:37:58.185	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
e471f4e7-9569-49ab-9d8f-1cd59f428f80	Deactivate User	User	\N	User ID: 8c279212-efda-4da5-948e-7883af7e6eb4	2026-02-28 11:38:00.196	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
97734ae8-838c-45ef-ac1a-fdf76c435249	Deactivate User	User	\N	User ID: 686dd7e6-7da1-49a1-9d54-559ffc2b58fd	2026-02-28 11:38:01.098	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
3131e581-0d64-4a81-ac0e-2fda63ba81c4	Deactivate User	User	\N	User ID: 34124ee8-0242-4699-88e5-f6c7d5c95550	2026-02-28 11:38:02.749	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
f2506d43-d05e-4526-84cd-74b20402a108	Archive Project	edebd40a-5b07-4087-9cb7-8573b03f7db3	\N	Project	2026-02-28 11:38:55.973	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
14c791de-efdb-41ee-9524-20cbb5fd4a61	Archive Project	edebd40a-5b07-4087-9cb7-8573b03f7db3	\N	Project	2026-02-28 11:38:57.769	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2f3a11e4-d14f-46b8-860f-b9f7d07df4d0	Delete Project	Project	\N	Project ID: edebd40a-5b07-4087-9cb7-8573b03f7db3	2026-02-28 11:39:00.732	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
eef25653-6e29-4389-b57c-c83b153303d7	Create Project	Project	\N	Project: Best Home	2026-02-28 11:39:18.452	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
844e770f-4481-4d5b-b4b4-da49cf6281c0	Create User	83b2a4d3-aa55-4899-b4d7-ee13da6506b0	\N	User	2026-02-28 11:40:11.845	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
90f75334-7414-4b0d-9693-d2c2ceb8170a	Update User	User	dadb6a81-dce0-4a20-b926-bc56405b774f	User ID: dadb6a81-dce0-4a20-b926-bc56405b774f	2026-02-28 11:40:21.869	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2c24f03f-30a1-4316-8de3-0e717349a05e	Activate User	34124ee8-0242-4699-88e5-f6c7d5c95550	Activated user theju@gmail.com	User	2026-02-28 11:40:33.871	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
fd8b56c6-34ed-471d-8e71-9a8b45bfb6b6	Deactivate User	User	\N	User ID: 5d7dceac-43a2-472f-8d39-212fbb369ba6	2026-02-28 11:40:35.357	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
70e410f8-5db2-4ec4-84bf-813112c8c51b	Update Role	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Updated role permissions	Role	2026-02-28 12:15:30.417	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
66ed813f-ff4e-476a-b79a-fb6147f6cdb3	Update Role	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Updated role permissions	Role	2026-02-28 12:33:36.93	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
fd82a00f-47be-40ec-9208-9116d2e6af83	Update Role	78371782-33a2-42df-b954-dc5d57107f7e	Updated role permissions	Role	2026-02-28 12:33:49.577	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
eef540f8-c6f5-4ca1-ac6d-6d982214eae4	Delete Role	78371782-33a2-42df-b954-dc5d57107f7e	Deleted role	Role	2026-02-28 12:36:35.062	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
24bb3f6c-3d25-4106-a204-4c703cfd058d	Create Role	9af681de-910a-4deb-a62b-908de277e3b5	Created role developer	Role	2026-02-28 12:37:04.453	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
3eee6570-ca3c-41f0-b2ce-6db7c7836d5f	Update Role	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Updated role permissions	Role	2026-02-28 12:43:59.811	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
220da52a-3585-43bd-9dae-9fd633abc16b	Update Role	9fe29e29-b509-4a3d-9649-e64597a64a64	Updated role permissions	Role	2026-02-28 12:44:08.539	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
ac2f04c8-8575-4e79-8cc0-92f4505dab59	Update Role Permissions	9af681de-910a-4deb-a62b-908de277e3b5	Permissions updated	Role	2026-02-28 12:47:56.946	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
b0e33ec8-bd7d-44ec-9075-36acca6987d6	Activate User	5d7dceac-43a2-472f-8d39-212fbb369ba6	Activated user spoo@gmail.com	User	2026-02-28 13:07:46.787	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
56627cd3-7e59-442d-b07a-05439d4025f4	Activate User	34124ee8-0242-4699-88e5-f6c7d5c95550	Activated user theju@gmail.com	User	2026-02-28 13:07:49.417	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
17c88967-4875-4d42-9996-e128e4f277bc	Deactivate User	User	\N	User ID: 83b2a4d3-aa55-4899-b4d7-ee13da6506b0	2026-02-28 13:15:57.344	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2cbcaa7e-df3e-449e-bb36-32277eb02eb2	Activate User	8c279212-efda-4da5-948e-7883af7e6eb4	Activated user ven@gmail.com	User	2026-02-28 13:15:59.215	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
dfc8b472-21e4-4c15-a02a-72d87c7aca67	Deactivate User	User	\N	User ID: f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 13:16:00.711	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
e761aa67-2da3-4edc-85db-d62774cd45ad	Deactivate User	User	\N	User ID: c221c249-d575-4a79-90f8-5eb415527218	2026-02-28 13:16:02.123	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
3b653d54-da2f-4c8f-92bd-810a3b47f1b1	Activate User	83b2a4d3-aa55-4899-b4d7-ee13da6506b0	Activated user yashwanth@gmail.com	User	2026-02-28 13:16:03.637	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
e7c2988f-a484-4c2d-aac6-14698bd36d07	Update User	User	686dd7e6-7da1-49a1-9d54-559ffc2b58fd	User ID: 686dd7e6-7da1-49a1-9d54-559ffc2b58fd	2026-02-28 13:16:08.964	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
e783ac62-f71d-4d47-84e4-13b1f6679998	Archive Project	3f69ce75-d29e-4f46-a4e6-37f7ffceef69	\N	Project	2026-02-28 13:16:24.117	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
56df14af-cc07-4515-8472-01df2774d675	Archive Project	3f69ce75-d29e-4f46-a4e6-37f7ffceef69	\N	Project	2026-02-28 13:16:24.967	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
a6241eb8-8a47-403c-b80d-bb379381dfed	Delete Project	Project	\N	Project ID: 3f69ce75-d29e-4f46-a4e6-37f7ffceef69	2026-02-28 13:16:30.784	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
9b22900a-36b2-4204-904f-9183212c0ce5	Update Role Permissions	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Permissions updated	Role	2026-02-28 13:16:41.498	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
fb390dac-b156-4a04-accf-57fd47e20632	Delete Project	Project	\N	Project ID: 1b23d2d5-a1a7-4584-928d-9f9fc3156c46	2026-02-28 21:02:32.663	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
fbce479e-a72c-4710-a951-70d3ebfd81e8	Archive Project	9fe49374-d183-4f11-9ad3-ed1484aedac3	\N	Project	2026-02-28 21:03:06.188	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
0f1e3e82-b7ff-45d3-b77c-fdd8b96a9390	Archive Project	9fe49374-d183-4f11-9ad3-ed1484aedac3	\N	Project	2026-03-01 06:45:47.366	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
0acc22f9-499a-4fff-bd39-1402d01c2a03	Update Role Permissions	9af681de-910a-4deb-a62b-908de277e3b5	Permissions updated	Role	2026-03-04 11:39:44.675	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
0b7468f1-4139-46ab-8152-6972f2ca862b	Activate User	f682f61d-6909-4ae9-aa01-3ee808f057a6	Activated user teju@gmail.com	User	2026-03-04 12:07:49.454	f682f61d-6909-4ae9-aa01-3ee808f057a6	f
49646a0f-bf58-405f-8e3a-b8027f43c842	Deactivate User	User	\N	User ID: f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-04 12:14:53.024	f682f61d-6909-4ae9-aa01-3ee808f057a6	f
2399c515-8ff0-44f5-98f7-12f481efa9c8	Activate User	User	\N	User ID: f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-04 12:15:34.175	f682f61d-6909-4ae9-aa01-3ee808f057a6	f
3dd939e4-c17b-4016-89d4-7844f00c0b4e	Update Role Permissions	9af681de-910a-4deb-a62b-908de277e3b5	Permissions updated	Role	2026-03-04 12:36:04.998	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
22b61d16-2e8d-40f3-a481-ceb956b4f807	Update Role Permissions	9fe29e29-b509-4a3d-9649-e64597a64a64	Permissions updated	Role	2026-03-04 12:36:24.526	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
2764a744-576a-422a-91c4-d8fe695ab64d	Update Role Permissions	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Permissions updated	Role	2026-03-04 12:41:11.681	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
00898c91-74c1-4f05-a2de-8a0942786741	Update Role Permissions	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Permissions updated	Role	2026-03-04 12:42:00.406	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
d4f24317-4075-4a5b-9f89-848920e729a2	Update Role Permissions	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Permissions updated	Role	2026-03-04 12:42:32.785	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
b1687301-52b4-43ad-adaa-56ff8949fa51	Update Role Permissions	b9c90170-74b4-4a14-bed8-226ce1d8dcba	Permissions updated	Role	2026-03-04 12:44:07.391	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
92ee7313-5143-4552-b7ad-83c3f53de233	Deactivate User	User	\N	User ID: dadb6a81-dce0-4a20-b926-bc56405b774f	2026-03-05 19:27:43.661	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
9fc86140-61ea-44ac-97a6-f11149800213	Archive Project	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	Project	2026-03-05 19:28:30.703	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
707fb7c1-d915-4cf5-849d-82639a0478e9	Archive Project	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	Project	2026-03-05 19:28:33.584	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
bd2fc14d-0b2c-470a-8ece-6416daf569a5	Archive Project	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	Project	2026-03-05 19:28:34.557	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
64474821-15af-4ddd-8080-03f3c4bea3c9	Archive Project	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	Project	2026-03-05 19:28:36.379	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
5aef106b-a340-42a7-8f69-d1a5b2737fff	Delete Project	Project	\N	Project ID: 6f7ce4dd-1902-4b94-bcf4-a13eeb63f426	2026-03-05 19:28:51.102	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	f
\.


--
-- Data for Name: Bug; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bug" (id, title, description, severity, priority, status, "testCaseId", "runId", "stepNumber", "evidencePath", "createdAt", "createdById", "reportedById", "assignedToId", "actualBehavior", "affectedVersion", "bugId", environment, "expectedBehavior", "stepsToReproduce", type, "commitLink", "fixNotes", "fixedAt", "resolutionNote", "startedAt", "projectId", "branchName") FROM stdin;
f6abba45-c3d1-4774-883a-1e298515bb7d	Failure in 19dcc8bf-568b-45e4-b264-19390a039665 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Won't Fix	19dcc8bf-568b-45e4-b264-19390a039665	null	1	\N	2026-02-27 13:04:57.93	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	bad	21	BUG-2026-00008	11	good	abc	Functional	\N	\N	\N	it is not good	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
9be759c5-2078-4fa4-bde0-d46f62b2b088	Failure in 811d6be1-ce4d-49ab-94d1-d42851cf64c9 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na1\r\n\r\nExpected:\r\na3\r\n\r\nActual:\r\n	High	Medium	Won't Fix	811d6be1-ce4d-49ab-94d1-d42851cf64c9	null	1	\N	2026-02-22 18:07:05.973	\N	\N	6fa87983-9f89-4966-a143-421951234a3d	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
f1f911e3-61ff-4a50-8064-b29022687516	Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1	Step 1 failed.\r\n\r\nAction:\r\n1\r\n\r\nExpected:\r\n3\r\n\r\nActual:\r\n	High	Medium	Open	2feb7741-682d-4592-bf05-e2e9d1387b4f	78da32c4-27d7-4d66-916b-7d4a85ce5d92	1	\N	2026-03-03 06:16:47.473	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N			BUG-2026-00013				Functional	\N	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
ced64570-57d8-46dc-9edf-c5d6d167722c	Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1	Step 1 failed.\r\n\r\nAction:\r\n1\r\n\r\nExpected:\r\n3\r\n\r\nActual:\r\n	High	Medium	Won't Fix	2feb7741-682d-4592-bf05-e2e9d1387b4f	null	1	\N	2026-02-23 11:10:42.946	\N	\N	6fa87983-9f89-4966-a143-421951234a3d	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
7c5c6de8-b550-4d5c-96cd-781eefe0a83a	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Verified	79818a20-00bc-435f-b4e5-322eee831864	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	1	1771953027153-aza.jpg	2026-02-24 17:10:27.171	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	b	12	BUG-2026-00007	11	a	abc	Functional	url	Good	2026-02-24 17:19:09.353	\N	2026-02-24 17:11:54.402	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
c3aa3a73-f564-41a1-8545-cbc65edbf0e0	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Fixed	79818a20-00bc-435f-b4e5-322eee831864	ae75aeb8-a0ef-4848-881d-ff96f9df4a70	1	\N	2026-03-03 03:30:20.266	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	a	1	BUG-2026-00011	1	a	a	Functional	url	Good	2026-03-03 03:31:55.119	\N	2026-03-03 03:31:40.002	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
946af332-b08e-4e08-a439-249d7df27447	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Closed	79818a20-00bc-435f-b4e5-322eee831864	ae75aeb8-a0ef-4848-881d-ff96f9df4a70	1	\N	2026-02-24 12:52:53.127	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	good	2,1	BUG-2026-00006	windows	behaviour	steps	Functional	\N	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
30223744-a4fd-4e5b-bc1a-d130dcfa93c5	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Won't Fix	79818a20-00bc-435f-b4e5-322eee831864	null	1	\N	2026-02-23 11:16:56.501	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
dc597a4b-7631-4f11-bb9b-0ac471022b26	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Fixed	79818a20-00bc-435f-b4e5-322eee831864	8807a216-bb2b-47de-bda6-b762d038fe0e	1	\N	2026-03-01 10:45:30.392	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	aa	1	BUG-2026-00010	1	aa	aa	Functional	url	Good	2026-03-03 03:05:34.46	\N	2026-03-03 03:05:04.41	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
f9836eca-46da-41d9-bdc6-1a9b41bc6dcc	Failure in 1045360c-a11d-43a4-b1c7-d31e4a78a654 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Won't Fix	1045360c-a11d-43a4-b1c7-d31e4a78a654	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	1	\N	2026-02-28 21:39:40.511	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	s	2	BUG-2026-00009	21	s	a	Functional	\N	\N	\N	it is bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
fb2ef50a-e16f-4ed2-a95d-594a7148afbc	Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1	Step 1 failed.\r\n\r\nAction:\r\n1\r\n\r\nExpected:\r\n3\r\n\r\nActual:\r\n	High	Medium	Won't Fix	2feb7741-682d-4592-bf05-e2e9d1387b4f	null	1	\N	2026-02-22 19:18:52.064	\N	\N	6fa87983-9f89-4966-a143-421951234a3d	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
8b23ffe0-aae7-439e-ba20-53334c6cfc01	Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1	Step 1 failed.\r\n\r\nAction:\r\n1\r\n\r\nExpected:\r\n3\r\n\r\nActual:\r\n	High	Medium	Won't Fix	2feb7741-682d-4592-bf05-e2e9d1387b4f	78da32c4-27d7-4d66-916b-7d4a85ce5d92	1	\N	2026-03-03 03:41:37.037	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d			BUG-2026-00012				Functional	\N	\N	\N	Bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
4eb1bb57-d267-430b-8db4-2ab34e4daf0b	Failure in adcfa343-8a05-4bce-8bf4-53f465857b07 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Open	adcfa343-8a05-4bce-8bf4-53f465857b07	null	1	\N	2026-03-03 06:17:18.998	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d			BUG-2026-00016				Functional	\N	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
745a93ab-3d4e-4d42-8e9d-febf2c6193cc	Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Fixed	79818a20-00bc-435f-b4e5-322eee831864	null	1	\N	2026-02-22 19:42:31.364	\N	\N	6fa87983-9f89-4966-a143-421951234a3d	\N	\N	\N	\N	\N	\N	\N	url	Good	2026-03-03 06:03:03.194	\N	2026-03-03 06:02:47.498	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
fb59c494-dcba-43e0-967f-706a162ebbde	Failure in 95ebeff1-8c99-4d5a-a409-6c62f79ed531 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na1\r\n\r\nExpected:\r\na3\r\n\r\nActual:\r\n	High	Medium	Fixed	95ebeff1-8c99-4d5a-a409-6c62f79ed531	null	1	\N	2026-03-03 06:17:30.147	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d			BUG-2026-00017				Functional	url	Good	2026-03-03 06:29:36.474	\N	2026-03-03 06:29:19.908	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
d51634c9-8028-4f0f-a9f1-1e3527ad89e0	Failure in adcfa343-8a05-4bce-8bf4-53f465857b07 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Open	adcfa343-8a05-4bce-8bf4-53f465857b07	null	1	\N	2026-03-03 06:17:09.49	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d			BUG-2026-00015				Functional	\N	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
69e0f829-422b-4ae4-b9d4-81d1e9c742d7	Failure in 0d68a8a4-d84a-4509-aa51-78adf6f59bc5 — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\nc\r\n\r\nActual:\r\n	High	Medium	Won't Fix	0d68a8a4-d84a-4509-aa51-78adf6f59bc5	null	1	\N	2026-03-03 06:16:58.681	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d			BUG-2026-00014				Functional	\N	\N	\N	bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
6499b52f-bafd-4766-81a2-8ca681239103	Failure in bbe692f7-3d6f-4906-aa32-5c9ef78040da — Step 1	Step 1 failed.\r\n\r\nAction:\r\na\r\n\r\nExpected:\r\ns\r\n\r\nActual:\r\n	High	Medium	Won't Fix	bbe692f7-3d6f-4906-aa32-5c9ef78040da	null	1	\N	2026-03-05 19:15:01.363	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	6fa87983-9f89-4966-a143-421951234a3d	a	1	BUG-2026-00018	1	a	a	Performance	\N	\N	\N	bad	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
\.


--
-- Data for Name: BugComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BugComment" (id, content, "bugId", "authorId", "parentId", mentions, "createdAt", "updatedAt") FROM stdin;
c5e92ad1-e5e3-4756-9702-0d65b1651444	@Teju\n all good	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	{Teju}	2026-02-24 17:37:53.604	2026-02-24 17:37:53.604
689d2d94-5567-43a3-891d-f24e83b90195	good	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	{}	2026-02-24 17:40:33.119	2026-02-24 17:40:33.119
f7593f21-ce86-4918-a421-baffe20df59d	good\n	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	{}	2026-02-24 17:40:41.638	2026-02-24 17:40:41.638
2792e5ee-eef1-49c9-b33f-93a2d00afb32	All good	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	6fa87983-9f89-4966-a143-421951234a3d	\N	{}	2026-02-24 18:09:37.908	2026-02-24 18:09:37.908
87276b29-f9ff-4bd4-914e-2f880cb7afcb	ok nice	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	c5e92ad1-e5e3-4756-9702-0d65b1651444	{}	2026-02-24 18:18:43.951	2026-02-24 18:19:22.771
54af9d18-a53a-4cde-8455-9208c77f7918	ok	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	c5e92ad1-e5e3-4756-9702-0d65b1651444	{}	2026-02-24 18:19:47.111	2026-02-24 18:19:47.111
6bcaee25-fc46-4891-a9ed-47ddf01e6ba1	good	7c5c6de8-b550-4d5c-96cd-781eefe0a83a	f682f61d-6909-4ae9-aa01-3ee808f057a6	87276b29-f9ff-4bd4-914e-2f880cb7afcb	{}	2026-02-24 18:20:08.418	2026-02-24 18:20:08.418
cc45ac3e-c2ed-4302-be8a-0a8e4911adfb	It is open	dc597a4b-7631-4f11-bb9b-0ac471022b26	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	\N	{}	2026-03-02 14:52:32.456	2026-03-02 14:52:32.456
7fad0621-2be8-4781-8775-688d1a996fb4	@Ashwini \nit is good thing	fb59c494-dcba-43e0-967f-706a162ebbde	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	{Ashwini}	2026-03-03 11:16:11.29	2026-03-03 11:16:11.29
28926a04-bc67-4886-baf2-47efe8d96144	@Ashwini\n\nwork on it	fb59c494-dcba-43e0-967f-706a162ebbde	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	{Ashwini}	2026-03-03 11:41:47.019	2026-03-03 11:41:47.019
\.


--
-- Data for Name: Commit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Commit" (id, hash, message, branch, author, "createdAt", "bugId") FROM stdin;
1b7c5364-1184-4cbf-9135-1b64fb0fe365	ba0ea957cf608aa1a5fa4bce975bfa132f42509d	Add API keys, webhook Git integration, and report scheduling features	notification-system	Tejaswini-L-G	2026-03-04 16:51:40.99	\N
\.


--
-- Data for Name: DashboardWidget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DashboardWidget" (id, "userId", type, title, "position", config, "createdAt", "projectId", width) FROM stdin;
a9007d82-b7d6-48ab-be44-cd2c4b24b985	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	counter	Overall Execution	1	\N	2026-02-26 19:40:35.896	\N	1
467e659a-7f40-4a40-8e9d-181c7594888d	6fa87983-9f89-4966-a143-421951234a3d	list	Assigned Bugs	0	\N	2026-02-26 19:41:11.453	\N	1
d387a874-57d7-4d5e-97a3-f6d65c3ecda9	6fa87983-9f89-4966-a143-421951234a3d	counter	Fix Rate	1	\N	2026-02-26 19:41:11.453	\N	1
8536ec11-3f62-42fc-a601-6844516c8b49	6fa87983-9f89-4966-a143-421951234a3d	counter	Reopen Rate	2	\N	2026-02-26 19:41:11.453	\N	1
aefd3acb-72eb-4bae-a699-00bcf300638a	6fa87983-9f89-4966-a143-421951234a3d	counter	Resolution Time	3	\N	2026-02-26 19:41:11.453	\N	1
ec047550-0225-4da1-b494-bcf3d7609738	f682f61d-6909-4ae9-aa01-3ee808f057a6	chart	Execution Trend	0	\N	2026-02-26 19:02:28.886	\N	1
ceae5d39-246d-40ea-9a6c-643c7068fc5f	f682f61d-6909-4ae9-aa01-3ee808f057a6	counter	Bug Detection Rate	2	\N	2026-02-26 18:52:31.214	\N	1
0fb95f46-e3df-4380-b371-c5777404ad64	f682f61d-6909-4ae9-aa01-3ee808f057a6	list	My Pending Tests	3	\N	2026-02-26 18:52:31.214	\N	1
9d758b3b-9a84-4236-916a-9cf866b77330	f682f61d-6909-4ae9-aa01-3ee808f057a6	counter	Bug Detection Rate	4	\N	2026-02-26 19:02:32.64	\N	1
fb4ef57a-52d8-4e83-bf9f-7e46bd60f76f	f682f61d-6909-4ae9-aa01-3ee808f057a6	list	Recent Failures	1	\N	2026-02-26 18:52:31.214	\N	1
8510fe7b-1e85-404d-b041-482ab22af68f	f682f61d-6909-4ae9-aa01-3ee808f057a6	counter	Overall Execution	5	\N	2026-03-05 11:21:17.725	\N	1
9653ad20-d7b6-477d-8190-2dea47852b62	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	chart	Bug Status	0	\N	2026-02-26 19:40:35.896	\N	1
e5e4dea4-ba52-491c-b272-dbfa8ef38b2b	403eef28-8359-41ff-b4de-18d83a77b157	counter	Overall Execution	0	\N	2026-03-01 18:46:21.069	\N	1
834dbda3-40c8-4397-8c0c-bf4b2680fa51	403eef28-8359-41ff-b4de-18d83a77b157	chart	Bug Status	1	\N	2026-03-01 18:46:21.069	\N	1
f3ef8c14-95b0-4afa-ab97-c3f8d3feb210	403eef28-8359-41ff-b4de-18d83a77b157	chart	Team Performance	2	\N	2026-03-01 18:46:21.069	\N	1
4ae1a833-0b64-457e-a080-2363cb9014da	403eef28-8359-41ff-b4de-18d83a77b157	list	Active Test Runs	3	\N	2026-03-01 18:46:21.069	\N	1
1104e627-3dad-4b42-a889-b8878d9ad743	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	chart	Team Performance	2	\N	2026-02-26 19:40:35.896	\N	1
2bf395bd-43c8-4103-96c3-9520930fe412	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	chart	Execution Trend	4	\N	2026-03-04 11:29:01.299	\N	1
\.


--
-- Data for Name: ExecutionEvidence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExecutionEvidence" (id, "testCaseId", "stepNumber", "filePath", "fileType", "uploadedAt") FROM stdin;
f83ad0c6-5a23-42b0-b8d7-996fd7c75f6c	2feb7741-682d-4592-bf05-e2e9d1387b4f	1	1771616467650-Screenshot (3).png	image/png	2026-02-20 19:41:07.661
\.


--
-- Data for Name: ExecutionResult; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExecutionResult" (id, "testCaseId", "executionTime", "completedAt") FROM stdin;
\.


--
-- Data for Name: ExecutionStep; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExecutionStep" (id, "executionId", "stepNumber", action, expected, actual, status, notes) FROM stdin;
cfaa5e5e-0156-4ddc-bda4-97646c81ef89	ccba03c2-062f-4c59-b6f4-72f43d417a55	1	a	c	Success	Pass	\N
1b979bc1-0b34-459e-a2c5-e25315c1d819	ad6c4215-7a28-47eb-afca-c2d6ceeb6f79	1	a	c	Success	Pass	\N
e50ba0d1-a7a8-4055-bbbd-5b33a0c69f2c	a2b5c634-d1cc-4255-b0bf-958fa7a4a626	1	a	c	Fail	Fail	\N
cb038185-4e2b-412d-9dea-cc9a8924bae8	23fdf5a5-955e-4037-803b-dfb49b63c778	1	a	s	Success	Pass	\N
11ef2b42-58c1-4180-8c50-aebd8b20c3e5	69308ebe-8b1a-4ed6-827f-3a0b0f3ab15e	1	a	c	Success	Pass	\N
\.


--
-- Data for Name: FilterPreset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FilterPreset" (id, name, "userId", filters, "isShared", "createdAt") FROM stdin;
5bb06d13-2f0f-47ed-a409-6e65a498c9fe	Closed Bugs	f682f61d-6909-4ae9-aa01-3ee808f057a6	{"type": "bug", "status": "Closed", "priority": "", "projectId": "5a372245-d15d-4439-aeaa-fde1eb24e9b4", "assignedTo": "6fa87983-9f89-4966-a143-421951234a3d"}	t	2026-03-01 15:19:42.47
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, type, title, message, link, "isRead", "createdAt", "userId", "referenceId") FROM stdin;
2b22aef4-9462-4c58-a6ac-cf56d7bdd7ed	BUG_ASSIGNED	New bug BUG-2026-00011 assigned to you	Bug "Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1" has been assigned to you.	/bugs/c3aa3a73-f564-41a1-8545-cbc65edbf0e0	t	2026-03-03 03:30:48.226	6fa87983-9f89-4966-a143-421951234a3d	c3aa3a73-f564-41a1-8545-cbc65edbf0e0
0ca7051f-2ca7-4dd0-a5c2-5db0124166fa	BUG_ASSIGNED	New bug BUG-2026-00012 assigned to you	Bug "Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1" has been assigned to you.	/bugs/8b23ffe0-aae7-439e-ba20-53334c6cfc01	t	2026-03-03 04:10:07.95	6fa87983-9f89-4966-a143-421951234a3d	8b23ffe0-aae7-439e-ba20-53334c6cfc01
6d72cd3a-0481-4da2-97fc-563e15fe9928	BUG_ASSIGNED	New bug 745a93ab-3d4e-4d42-8e9d-febf2c6193cc assigned to you	Bug "Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1" has been assigned to you.	/bugs/745a93ab-3d4e-4d42-8e9d-febf2c6193cc	f	2026-03-03 06:00:24.779	6fa87983-9f89-4966-a143-421951234a3d	745a93ab-3d4e-4d42-8e9d-febf2c6193cc
818fc45e-8de2-430d-9fa4-4585fcb4627d	BUG_ASSIGNED	New bug BUG-2026-00016 assigned to you	Bug "Failure in adcfa343-8a05-4bce-8bf4-53f465857b07 — Step 1" has been assigned to you.	/bugs/4eb1bb57-d267-430b-8db4-2ab34e4daf0b	t	2026-03-03 17:14:10.024	6fa87983-9f89-4966-a143-421951234a3d	4eb1bb57-d267-430b-8db4-2ab34e4daf0b
bbf3b436-6805-4111-bd61-52b44d0a89c2	BUG_ASSIGNED	New bug 9be759c5-2078-4fa4-bde0-d46f62b2b088 assigned to you	Bug "Failure in 811d6be1-ce4d-49ab-94d1-d42851cf64c9 — Step 1" has been assigned to you.	/bugs/9be759c5-2078-4fa4-bde0-d46f62b2b088	f	2026-03-03 06:07:01.685	6fa87983-9f89-4966-a143-421951234a3d	9be759c5-2078-4fa4-bde0-d46f62b2b088
9aebf63c-0b21-4841-be47-838da693c324	BUG_ASSIGNED	New bug BUG-2026-00017 assigned to you	Bug "Failure in 95ebeff1-8c99-4d5a-a409-6c62f79ed531 — Step 1" has been assigned to you.	/bugs/fb59c494-dcba-43e0-967f-706a162ebbde	t	2026-03-03 06:17:52.702	6fa87983-9f89-4966-a143-421951234a3d	fb59c494-dcba-43e0-967f-706a162ebbde
c150bad6-89c4-406a-b4db-1d535694b1f9	BUG_ASSIGNED	New bug BUG-2026-00015 assigned to you	Bug "Failure in adcfa343-8a05-4bce-8bf4-53f465857b07 — Step 1" has been assigned to you.	/bugs/d51634c9-8028-4f0f-a9f1-1e3527ad89e0	f	2026-03-03 17:20:30.506	6fa87983-9f89-4966-a143-421951234a3d	d51634c9-8028-4f0f-a9f1-1e3527ad89e0
86703b2f-a9bd-4b74-8c2e-5959b3a41016	BUG_ASSIGNED	New bug BUG-2026-00010 assigned to you	Bug "Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1" has been assigned to you.	/bugs/dc597a4b-7631-4f11-bb9b-0ac471022b26	t	2026-03-02 17:32:48.84	6fa87983-9f89-4966-a143-421951234a3d	\N
ce935ecf-0092-490c-8ca6-e9e45bfa01d6	BUG_ASSIGNED	New bug BUG-2026-00010 assigned to you	Bug "Failure in 79818a20-00bc-435f-b4e5-322eee831864 — Step 1" has been assigned to you.	/bugs/dc597a4b-7631-4f11-bb9b-0ac471022b26	t	2026-03-02 17:33:18.258	6fa87983-9f89-4966-a143-421951234a3d	\N
099f219a-eaab-4b49-9d0e-f5df1ca79524	BUG_ASSIGNED	New bug BUG-2026-00009 assigned to you	Bug "Failure in 1045360c-a11d-43a4-b1c7-d31e4a78a654 — Step 1" has been assigned to you.	/bugs/f9836eca-46da-41d9-bdc6-1a9b41bc6dcc	t	2026-03-02 17:42:54.538	6fa87983-9f89-4966-a143-421951234a3d	\N
d6390467-2803-4c25-bebc-3a79fd3edf66	BUG_ASSIGNED	New bug BUG-2026-00008 assigned to you	Bug "Failure in 19dcc8bf-568b-45e4-b264-19390a039665 — Step 1" has been assigned to you.	/bugs/f6abba45-c3d1-4774-883a-1e298515bb7d	t	2026-03-02 18:47:57.108	6fa87983-9f89-4966-a143-421951234a3d	f6abba45-c3d1-4774-883a-1e298515bb7d
c6f31532-13c2-49d0-8da8-5b516f3dc3cf	BUG_ASSIGNED	New bug ced64570-57d8-46dc-9edf-c5d6d167722c assigned to you	Bug "Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1" has been assigned to you.	/bugs/ced64570-57d8-46dc-9edf-c5d6d167722c	t	2026-03-02 19:03:07.318	6fa87983-9f89-4966-a143-421951234a3d	ced64570-57d8-46dc-9edf-c5d6d167722c
1f5a2697-d3f9-45de-b465-d1ee45f9c1e4	TEST_ASSIGNED	New Test Run Assigned	You have been assigned to test run: a	\N	f	2026-03-03 10:45:29.952	c8e80221-f3ce-45f8-b5e2-303146417d07	dc9be45b-1276-4720-8f15-cfc704ece935
1f38bb66-85d8-4dff-9a1e-7c85a45e7c1c	RETEST	Bug BUG-2026-00017 ready for verification	Developer marked this bug as Fixed.	\N	t	2026-03-03 06:29:32.569	f682f61d-6909-4ae9-aa01-3ee808f057a6	fb59c494-dcba-43e0-967f-706a162ebbde
4a676a3a-9278-4c23-ad83-2fb191c24c76	BUG_ASSIGNED	New bug fb2ef50a-e16f-4ed2-a95d-594a7148afbc assigned to you	Bug "Failure in 2feb7741-682d-4592-bf05-e2e9d1387b4f — Step 1" has been assigned to you.	/bugs/fb2ef50a-e16f-4ed2-a95d-594a7148afbc	t	2026-03-03 06:00:42.596	6fa87983-9f89-4966-a143-421951234a3d	fb2ef50a-e16f-4ed2-a95d-594a7148afbc
4ef1b127-4301-4ff4-b49c-ba2fb32db93a	BUG_ASSIGNED	New bug BUG-2026-00014 assigned to you	Bug "Failure in 0d68a8a4-d84a-4509-aa51-78adf6f59bc5 — Step 1" has been assigned to you.	/bugs/69e0f829-422b-4ae4-b9d4-81d1e9c742d7	t	2026-03-04 17:36:42.159	6fa87983-9f89-4966-a143-421951234a3d	69e0f829-422b-4ae4-b9d4-81d1e9c742d7
bdc0e640-fa02-464f-9519-6126ff325cfa	COMMENT	New comment on Bug BUG-2026-00017	Teju commented on this bug	\N	t	2026-03-03 11:16:11.355	6fa87983-9f89-4966-a143-421951234a3d	fb59c494-dcba-43e0-967f-706a162ebbde
d43e69ff-6fd9-43da-ae53-9fba009f9dec	COMMENT	New comment on Bug BUG-2026-00017	Teju commented on this bug	\N	t	2026-03-03 11:41:47.092	6fa87983-9f89-4966-a143-421951234a3d	fb59c494-dcba-43e0-967f-706a162ebbde
b924c718-4fad-43d9-9dbc-53a47b22ff7d	RETEST	Bug BUG-2026-00017 ready for verification	Developer marked this bug as Fixed.	\N	t	2026-03-03 06:29:36.524	f682f61d-6909-4ae9-aa01-3ee808f057a6	fb59c494-dcba-43e0-967f-706a162ebbde
3786715e-c58b-4022-b3b0-7dc5dc211bfc	STATUS_CHANGED	Bug BUG-2026-00014 marked Won't Fix	Developer marked this bug as Won't Fix.	\N	t	2026-03-04 17:37:51.68	f682f61d-6909-4ae9-aa01-3ee808f057a6	69e0f829-422b-4ae4-b9d4-81d1e9c742d7
ea7a19b3-7bc3-4c48-933b-dfe711ff4681	BUG_ASSIGNED	New bug BUG-2026-00018 assigned to you	Bug "Failure in bbe692f7-3d6f-4906-aa32-5c9ef78040da — Step 1" has been assigned to you.	/bugs/6499b52f-bafd-4766-81a2-8ca681239103	t	2026-03-05 19:17:33.26	6fa87983-9f89-4966-a143-421951234a3d	6499b52f-bafd-4766-81a2-8ca681239103
3ade6c80-2f2f-4d21-be93-5a86c74501a5	STATUS_CHANGED	Bug BUG-2026-00018 marked Won't Fix	Developer marked this bug as Won't Fix.	\N	t	2026-03-05 19:25:00.974	f682f61d-6909-4ae9-aa01-3ee808f057a6	6499b52f-bafd-4766-81a2-8ca681239103
\.


--
-- Data for Name: NotificationPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationPreference" (id, "userId", "bugAssignedEmail", "bugAssignedInApp", "statusChangedEmail", "statusChangedInApp", "commentEmail", "commentInApp", "testAssignedEmail", "testAssignedInApp", "retestEmail", "retestInApp", "quietHoursStart", "quietHoursEnd") FROM stdin;
545e4c56-a779-4143-a722-f2f27c37b834	6fa87983-9f89-4966-a143-421951234a3d	t	t	t	t	f	t	t	t	t	t	\N	\N
47686300-db42-4043-9ae5-425256c0d2e8	c8e80221-f3ce-45f8-b5e2-303146417d07	t	t	t	t	f	t	t	t	t	t	\N	\N
35a165e0-28ed-44c3-a959-faee6789274d	f682f61d-6909-4ae9-aa01-3ee808f057a6	t	t	t	t	f	t	t	t	t	t	20:59	\N
47024321-dd55-415e-8619-e4ab64eb02b4	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	t	t	t	t	f	t	t	t	t	t	\N	\N
cb131e18-a16f-4070-9539-82cb19e40bba	b6704d5d-dc39-4c55-a262-89b5cfdc644c	t	t	t	t	f	t	t	t	t	t	\N	\N
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name, "roleId") FROM stdin;
621798d4-d6d7-4093-95de-c2dfb518d49c	link_commits	9af681de-910a-4deb-a62b-908de277e3b5
24fa880a-c843-49ed-8a88-828f038f8e13	view_dashboard	9af681de-910a-4deb-a62b-908de277e3b5
ced2f92a-788d-431b-a4ba-f7463cc93262	view_test_case_details	9af681de-910a-4deb-a62b-908de277e3b5
d41277f9-9a2f-433a-84eb-c97506ca71b6	generate_reports	9af681de-910a-4deb-a62b-908de277e3b5
49853d1b-cacf-4f58-b231-2b5433f00906	execute_test	9af681de-910a-4deb-a62b-908de277e3b5
4ee1165c-f56a-4a0a-994e-0689da720aeb	request_retest	9af681de-910a-4deb-a62b-908de277e3b5
b9f5a19c-611a-4cb5-9d49-c7e1779df979	comment_issue	9af681de-910a-4deb-a62b-908de277e3b5
ddebeff2-100c-4d15-8b64-598182c56118	export_reports	9af681de-910a-4deb-a62b-908de277e3b5
39cfd25f-043e-420c-b998-ed5eb52b9ff0	add_fix_notes	9fe29e29-b509-4a3d-9649-e64597a64a64
0e568894-32bd-40fd-8a6d-b9dc23e9caf5	view_reports	9fe29e29-b509-4a3d-9649-e64597a64a64
024a8315-6447-473a-a7bb-c31914249482	view_dashboard	9fe29e29-b509-4a3d-9649-e64597a64a64
90f3560c-4e8e-4605-8dc1-d660b3e1a813	export_reports	9fe29e29-b509-4a3d-9649-e64597a64a64
9add8c56-17ca-4f07-a931-d14ddaab6b42	manage_users	9fe29e29-b509-4a3d-9649-e64597a64a64
f880f229-9d39-4c80-b17e-70f9a7d3c554	manage_projects	9fe29e29-b509-4a3d-9649-e64597a64a64
c033ab45-3b8e-4fdb-a94e-ed9c10e259d6	manage_roles	9fe29e29-b509-4a3d-9649-e64597a64a64
97e2c140-1824-4f80-9217-afe2339187c2	view_audit_logs	9fe29e29-b509-4a3d-9649-e64597a64a64
06c43c1e-993e-4926-9e56-1527f85434bd	system_config	9fe29e29-b509-4a3d-9649-e64597a64a64
568497c1-cb43-40c0-a446-663bd0f9be15	backup_management	9fe29e29-b509-4a3d-9649-e64597a64a64
1ccdaa61-a1c3-489e-9705-117713bce6c0	create test case	b9c90170-74b4-4a14-bed8-226ce1d8dcba
37a5d4a9-d2c6-47d9-b7ff-a64053b67be9	execute_test	b9c90170-74b4-4a14-bed8-226ce1d8dcba
518333cd-6072-4322-a2ac-5080aff4feba	edit_test_case	b9c90170-74b4-4a14-bed8-226ce1d8dcba
dccce230-7de3-40a6-bc09-ab7ae0b714e1	delete_test_case	b9c90170-74b4-4a14-bed8-226ce1d8dcba
5ccc3a90-c950-45b6-9c35-97d70e04e6a4	assign_bug	b9c90170-74b4-4a14-bed8-226ce1d8dcba
549a9972-10aa-4f3b-b22f-0891c1b36414	generate_reports	b9c90170-74b4-4a14-bed8-226ce1d8dcba
6a287dcf-3a04-49e5-84d8-807229deb019	create_bug	b9c90170-74b4-4a14-bed8-226ce1d8dcba
8045c471-1644-45ed-bc51-b3361d5d9a3a	upload_attachment	b9c90170-74b4-4a14-bed8-226ce1d8dcba
e98ac2a8-16ba-4dae-9496-90700cb5cbbf	create_test_case	b9c90170-74b4-4a14-bed8-226ce1d8dcba
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, description, "createdAt", active, "createdById") FROM stdin;
bb82400f-364b-4cef-ba01-f074215993b1	Farm2Home	Web based platform	2026-02-27 10:26:33.182	t	\N
6cc10c75-ec03-4af7-8d98-ad803063d05f	Testtrack	software	2026-02-27 10:55:45.336	t	\N
9fe49374-d183-4f11-9ad3-ed1484aedac3	Warehouse 	Environment	2026-02-27 12:05:52.565	t	\N
5a372245-d15d-4439-aeaa-fde1eb24e9b4	Default Project		2026-02-28 18:08:32.703	t	\N
\.


--
-- Data for Name: ProjectCustomField; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectCustomField" (id, name, type, required, options, "projectId", "createdAt") FROM stdin;
dc792218-b4a7-4e30-95f8-76eb31d9ea33	web	text	f	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4	2026-03-01 07:38:37.865
\.


--
-- Data for Name: ProjectEnvironment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectEnvironment" (id, name, "projectId", "createdAt") FROM stdin;
af33d587-a3db-469e-82cc-c1df29b90efb	a	5a372245-d15d-4439-aeaa-fde1eb24e9b4	2026-03-01 09:04:39.82
\.


--
-- Data for Name: ProjectMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectMember" (id, "userId", "projectId", role, "createdAt") FROM stdin;
206519ec-d8c4-4fa2-b4de-62ea8ac4a238	6fa87983-9f89-4966-a143-421951234a3d	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.889
663f0366-e56d-456f-b6ca-498cb261ec4a	dadb6a81-dce0-4a20-b926-bc56405b774f	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.909
952f334d-38dd-4eaa-8157-e0ab8fb2eb0b	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.914
8bbbeba2-3f31-41f5-83f1-99f33ed02221	f682f61d-6909-4ae9-aa01-3ee808f057a6	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.919
82da3397-af9e-4ad0-9082-2538d0326b09	7bdfe490-d994-402c-bfa4-905fe928cb9e	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.924
423b22e5-a9c2-4e9e-855d-c487dbfa6bf9	5d7dceac-43a2-472f-8d39-212fbb369ba6	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.928
66a3b147-8588-41eb-ab61-c0270be2fc9f	34124ee8-0242-4699-88e5-f6c7d5c95550	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.933
8300f919-86a4-4ea7-8919-6e61ec231456	8c279212-efda-4da5-948e-7883af7e6eb4	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.939
43d5d573-3f9a-479d-a406-95df9cba9dab	981d64dc-f8ce-4e74-91d0-3ac861069361	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.943
286375d1-af02-4d99-81b4-1b91b21e25c7	c221c249-d575-4a79-90f8-5eb415527218	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.948
bb9a85f7-d042-44a8-bb25-fd2fb44121af	83b2a4d3-aa55-4899-b4d7-ee13da6506b0	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.952
36358b40-5847-48e3-9d67-215f253dcc0a	686dd7e6-7da1-49a1-9d54-559ffc2b58fd	bb82400f-364b-4cef-ba01-f074215993b1	\N	2026-02-28 20:37:15.957
4b914ad0-6fa4-48d5-98df-9add806f9c09	f682f61d-6909-4ae9-aa01-3ee808f057a6	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	2026-02-28 21:02:49.117
bd90c884-5bc5-46e5-bdcb-87f2f300419e	ad873da6-1099-4e10-b50c-04693884e2c4	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N	2026-03-05 19:28:02.477
\.


--
-- Data for Name: ProjectMilestone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectMilestone" (id, name, description, "targetDate", "targetPassRate", "projectId", "createdAt") FROM stdin;
0021973e-1102-42e3-a4a8-4aa43b39e28d	Beta Release	Beat release edition	2026-03-01 00:00:00	90	5a372245-d15d-4439-aeaa-fde1eb24e9b4	2026-03-01 09:31:01.005
f719529a-b556-422f-abe5-0a3f7b974aae	Gamma	Gamma release	2026-03-05 00:00:00	80	5a372245-d15d-4439-aeaa-fde1eb24e9b4	2026-03-01 09:42:32.012
\.


--
-- Data for Name: ProjectModule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectModule" (id, name, "projectId", "createdAt") FROM stdin;
5d436d26-fb82-49f8-b2fa-6e01546be168	Authentication	5a372245-d15d-4439-aeaa-fde1eb24e9b4	2026-03-01 08:39:11.202
\.


--
-- Data for Name: ProjectWorkflow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectWorkflow" (id, name, statuses, "projectId") FROM stdin;
2b5aa370-b54e-4e57-855c-310c7eeba782	TestCase	["Open","enter details","create","save"]	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0991f430-f3c0-4bc2-9bf5-6dfd474430b5	Bug	["Open","Assigned","Dev fixed","verified","closed"]	5a372245-d15d-4439-aeaa-fde1eb24e9b4
\.


--
-- Data for Name: ReportSchedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReportSchedule" (id, "userId", type, frequency, "dayOfWeek", "time", "isActive", "createdAt") FROM stdin;
a8a7ba51-5901-4a16-a240-d54197361ff3	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	BUG_REPORT	WEEKLY	3	09:00	t	2026-03-04 02:35:37.966
6c9b4f3b-abab-420b-b386-64b2b449f8ca	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	BUG_REPORT	WEEKLY	3	09:00	t	2026-03-04 03:11:17.109
\.


--
-- Data for Name: ReportScheduleHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReportScheduleHistory" (id, "scheduleId", "executedAt", status, message) FROM stdin;
206b0704-2d6e-4435-9008-4d056e9a00d9	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 02:48:22.85	FAILED	Cannot read properties of undefined (reading 'findMany')
fe0b6f94-9667-40c9-8471-cad133c38b54	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 02:53:11.996	FAILED	Cannot read properties of undefined (reading 'findMany')
ca24d021-876a-4b8a-a6ab-7cf435184a90	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 02:53:23.986	FAILED	Cannot read properties of undefined (reading 'findMany')
3428de2e-bcbe-4371-91f9-51045ce45a9e	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 02:56:22.131	FAILED	Cannot read properties of undefined (reading 'findMany')
deb8cf49-a5ec-4792-a6a6-0462b7bc5e06	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 03:03:36.917	FAILED	sendEmail is not defined
9ad1c592-52e3-42bc-8d27-bc263368261f	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 03:07:45.407	FAILED	generateTestExecutionData is not defined
b4e5def4-e28f-4302-bdaa-94223b43555c	a8a7ba51-5901-4a16-a240-d54197361ff3	2026-03-04 03:11:34.034	SUCCESS	Manual report executed
068e3644-349f-431e-9b13-8abccb622700	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 03:41:55.072	FAILED	reportData is not defined
1232bfe7-129a-421f-aed5-797bbb5ae626	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 03:53:41.215	FAILED	Cannot read properties of undefined (reading 'forEach')
5222f8f3-f64d-460a-8ce9-120bcb070ff7	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 03:57:09.516	FAILED	\nInvalid `prisma.testExecution.findMany()` invocation in\nC:\\Users\\theja\\Desktop\\testtrack-pro\\apps\\api\\backend\\src\\server.js:95:49\n\n  92 \n  93 async function generateTestExecutionData(userId) {\n  94 \n→ 95   const executions = await prisma.testExecution.findMany({\n         where: {\n           executedById: "e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6"\n         },\n         include: {\n           testCase: true,\n           ~~~~~~~~\n       ?   steps?: true,\n       ?   testRun?: true,\n       ?   executedBy?: true\n         }\n       })\n\nUnknown field `testCase` for include statement on model `TestExecution`. Available options are marked with ?.
6d0e91c3-3d48-4c97-8ec0-a927a134da54	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 03:59:07.794	FAILED	Cannot read properties of undefined (reading 'forEach')
025328d1-4fe1-453d-b88e-2c7d53b3b6bd	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 04:01:28.4	SUCCESS	Manual report executed with PDF
e8306770-4bf5-4a3e-bcda-338f54cd7398	6c9b4f3b-abab-420b-b386-64b2b449f8ca	2026-03-04 10:18:39.569	SUCCESS	Manual report executed with PDF
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name) FROM stdin;
b9c90170-74b4-4a14-bed8-226ce1d8dcba	tester
9fe29e29-b509-4a3d-9649-e64597a64a64	admin
9af681de-910a-4deb-a62b-908de277e3b5	developer
\.


--
-- Data for Name: SystemConfig; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemConfig" (id, "defaultSeverity", "defaultPriority", "emailEnabled", "autoAssignBug", "maxUploadSize", "updatedAt") FROM stdin;
e9172a1a-1970-46c2-aad4-bdeaf77ada76	High	P1	t	f	10	2026-02-28 12:54:48.612
\.


--
-- Data for Name: TemplateStep; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TemplateStep" (id, "templateId", "stepNumber", action, "testData", expected) FROM stdin;
8a9b3a90-e16d-4f1a-a0af-e598ae5093bc	9b30328a-5d61-4894-99c8-0a21084fc804	1	a	b	c
a7d3ef14-57e7-4309-949f-f5749a940787	d4dbe0ff-5bc0-4757-92f9-488b9eb7f2ea	1	a	a	a
a08ab4db-9d54-471c-82f4-cb6ca2984598	97266b04-9cf3-427b-a077-2b27258f1aff	1	a	a1	a2
da398ea1-d031-47c7-b970-d43139ff66cb	2559f1a3-f5f0-4963-aefa-ed6a67c23cd2	1	a	c	s
\.


--
-- Data for Name: TestCase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestCase" (id, "testCaseId", title, description, module, priority, severity, type, status, preconditions, "testData", environment, postconditions, "cleanupSteps", "createdById", "assignedTesterId", version, tags, "isDeleted", "createdAt", "updatedAt", "impactIfFails", "testDataRequirements", "order", "suiteId", "projectId") FROM stdin;
bbe692f7-3d6f-4906-aa32-5c9ef78040da	TC-2026-44905	Register	registration	Authentication	Medium	Major	Functional	Approved	ac	\N	ddd	a	dd	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-28 21:14:38.472	2026-03-05 10:36:34.694	c	d	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7779f3fd-806e-4e17-9c36-30526617cdf5	TC-2026-27145	88		E4Bbcd8AD81fC5f	Alison	Vargas	"Vaughn	 Watts and Leach"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 12:25:27.147	2026-03-05 18:21:21.208	\N	\N	\N	c14b572f-9207-499c-a674-638df7957046	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3ac589cf-311f-4c93-b4c1-a57ab9b5503e	TC-2026-44906	Sprint	cycle	Autg	Medium	Major	Functional	Ready		\N				f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	t	2026-03-01 06:34:21.348	2026-03-05 15:39:48.553			\N	e5004a73-8265-4926-aa8c-4f95448885f7	5a372245-d15d-4439-aeaa-fde1eb24e9b4
79d8417e-40f9-42e3-a77c-4a6758a7c662	TC-2026-00037	37		889eCf90f68c5Da	Nicholas	Sosa	Jordan Ltd	South Hunter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.992	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bee7080b-6c79-4d52-b4ee-978fdad9a767	TC-2026-44907	Log	logging	Auth	High	Major	Functional	Draft		\N				f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-01 07:03:07.147	2026-03-05 10:37:00.581			\N	dea66b66-63f2-447a-af94-22fd7f9c31e0	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fce9e351-37e1-4c71-a284-0e82a441811e	TC-2026-89806	a	a	Authentication	Medium	Critical	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:34:16.411	2026-03-05 18:34:16.411			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
85a6381b-d435-43d4-be1e-69370689586b	TC-2026-00073	73		F560f2d3cDFb618	Candice	Keller	Huynh and Sons	East Summerstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.212	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
247d845b-25c5-49c0-a982-a5c830bb78fb	TC-2026-00074	74		A3F76Be153Df4a3	Anita	Benson	Parrish Ltd	Skinnerport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.224	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7ffba524-498d-4e2c-ac34-509dd5344bc3	TC-2026-44908	Sprinting	cycle	GoodAuth	High	Major	Regression	Draft		\N				f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-01 07:47:02.189	2026-03-05 10:37:00.581			\N	dea66b66-63f2-447a-af94-22fd7f9c31e0	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cf1b6a21-baf0-4504-81d0-448ea986b124	TC-2026-89807	a	a	Authentication	Medium	Critical	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:34:16.449	2026-03-05 18:34:16.449			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cae068ef-cc9a-44e3-b83c-82842c7ca303	TC-2026-44909	ad	s	Authentication	High	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-04 12:46:59.227	2026-03-05 10:37:00.581			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41ce5fe0-3023-43fa-97d9-f9b6a1fdea09	TC-2026-89808	as	as	auth	Medium	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-03-05 18:35:53.346	2026-03-05 18:37:08.409			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b05aff7b-8cac-483f-b5c0-7173285a9d93	TC-2026-44910	auth	authentication	Authentication	Medium	Major	Functional	Deprecated		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	3	{}	f	2026-03-04 12:56:42.834	2026-03-05 15:39:32.933			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4df8d841-fa46-4a16-85fd-b459a296c043	TC-2026-89809	a	a	Authentication	Medium	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:36:26.804	2026-03-05 18:36:26.804			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
162140e2-9fbb-44d3-8f9f-78399c6f38fc	TC-2026-89805	Untitled Test Case		General	Medium	Major	Functional	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 12:21:29.814	2026-03-05 18:37:48.562	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
87b57bda-92e1-4dc5-8efd-2cf40a4838e5	TC-2026-89810	sam	sa	Authentication	Medium	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:38:17.84	2026-03-05 18:38:17.84			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4c8dec8d-9863-48d8-b77f-ca6a9c940664	TC-2026-27178	95		BE91A0bdcA49Bbc	Darrell	Douglas	"Newton	 Petersen and Mathis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 12:25:27.18	2026-03-05 10:15:36.441	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
57efb062-b3c7-4051-bec4-d3bfc6409766	TC-2026-68430	"71581ab8-a62f-4cfb-94a4-17c4cf9536e1"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:23:10.937Z"	"2026-02-22T15:23:20.097Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.438	2026-03-05 18:52:48.438	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ba953a64-75d7-4d60-925a-04fb1b36f90f	TC-2026-68451	"26f1a1a2-fed6-4990-ad92-0b580b1e5a2f"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:23:26.438Z"	"2026-02-22T15:23:37.474Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.457	2026-03-05 18:52:48.457	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6e57d550-a01c-43f3-b21b-e9ec0dc225be	TC-2026-68459	"083bdddc-c328-4f70-8aff-cb5cfb4353d6"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:32:13.628Z"	"2026-02-22T15:32:23.223Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.463	2026-03-05 18:52:48.463	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e23787dc-cdaf-4990-9b83-6af1daae8285	TC-2026-68465	"60deffb2-0daa-41d6-8952-d75e2f92aa05"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:32:33.093Z"	"2026-02-22T15:32:41.912Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.47	2026-03-05 18:52:48.47	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
72d8c259-53f0-4976-9952-82308ba8de45	TC-2026-68472	"daf65465-fce8-49d1-ba21-92eeeb1ccc4f"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:37:20.508Z"	"2026-02-22T15:37:29.412Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.476	2026-03-05 18:52:48.476	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0ce302f6-fd1e-4aa3-8858-59abdd95e94a	TC-2026-68478	"61ee3681-7962-45e3-a982-3696cb7bfded"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:37:35.532Z"	"2026-02-22T15:37:43.873Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.483	2026-03-05 18:52:48.483	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
81bc14dd-b333-4b74-93d3-d0265e3bd66d	TC-2026-68485	"6bf88419-bbb5-4119-8771-801727e54d0b"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:45:39.097Z"	"2026-02-22T15:45:52.144Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.49	2026-03-05 18:52:48.49	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4d2d19a4-2e51-424c-ab23-84c2e51d9515	TC-2026-68490	"447a438f-a53b-4954-a816-37dd45e56ddb"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:45:59.820Z"	"2026-02-22T15:46:10.256Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.496	2026-03-05 18:52:48.496	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
945ec3ff-ffa1-419c-96c5-c1de445ded27	TC-2026-68497	"682cb52c-b8ba-4049-8cb5-ff1281dcd4fe"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T12:43:11.985Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.502	2026-03-05 18:52:48.502	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7d1dd1d6-3e11-4289-ba4e-d1c79c81e694	TC-2026-68503	"b0924cad-783f-4330-9808-a377853f9582"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T13:04:27.842Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.508	2026-03-05 18:52:48.508	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c894f222-136e-484c-a061-4c012fd255ee	TC-2026-68508	"2fabf708-9fec-40da-a857-44bfcfc938d4"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T13:35:04.309Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:52:48.512	2026-03-05 18:52:48.512	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3e6a47c7-5dda-4286-95b0-6a69881c9937	TC-2026-94194	"71581ab8-a62f-4cfb-94a4-17c4cf9536e1"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:23:10.937Z"	"2026-02-22T15:23:20.097Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.198	2026-03-05 18:53:14.198	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1f4a0a1c-b485-467f-9128-564e3e6c50e0	TC-2026-94208	"26f1a1a2-fed6-4990-ad92-0b580b1e5a2f"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:23:26.438Z"	"2026-02-22T15:23:37.474Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.212	2026-03-05 18:53:14.212	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
521c25c2-b631-4acb-99fd-d7606032869d	TC-2026-94212	"083bdddc-c328-4f70-8aff-cb5cfb4353d6"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:32:13.628Z"	"2026-02-22T15:32:23.223Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.217	2026-03-05 18:53:14.217	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c79d5065-fd4d-44da-bcef-33c995c31562	TC-2026-94222	"60deffb2-0daa-41d6-8952-d75e2f92aa05"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:32:33.093Z"	"2026-02-22T15:32:41.912Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.226	2026-03-05 18:53:14.226	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
70b3d425-07a2-4bf5-a36c-8e30df75de45	TC-2026-94226	"daf65465-fce8-49d1-ba21-92eeeb1ccc4f"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:37:20.508Z"	"2026-02-22T15:37:29.412Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.23	2026-03-05 18:53:14.23	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9e38bf8a-bd91-4db3-a8c8-b0a9f4174dc7	TC-2026-94229	"61ee3681-7962-45e3-a982-3696cb7bfded"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:37:35.532Z"	"2026-02-22T15:37:43.873Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.233	2026-03-05 18:53:14.233	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0b76c423-978a-45bb-b99f-731178b4f4b9	TC-2026-94231	"6bf88419-bbb5-4119-8771-801727e54d0b"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:45:39.097Z"	"2026-02-22T15:45:52.144Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.235	2026-03-05 18:53:14.235	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
671d3d2f-5944-41ad-871b-74fa46e74d80	TC-2026-94233	"447a438f-a53b-4954-a816-37dd45e56ddb"		"2feb7741-682d-4592-bf05-e2e9d1387b4f"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-22T15:45:59.820Z"	"2026-02-22T15:46:10.256Z"	"Passed"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.237	2026-03-05 18:53:14.237	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
08c18d48-fe6e-4f03-af87-8715e075f02b	TC-2026-94236	"682cb52c-b8ba-4049-8cb5-ff1281dcd4fe"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T12:43:11.985Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.24	2026-03-05 18:53:14.24	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f26164d6-cb63-4e67-b16b-16d13fcb88be	TC-2026-44911	Register	registration	Authentication	Medium	Major	Functional	Draft		\N	a			b6704d5d-dc39-4c55-a262-89b5cfdc644c	\N	1	{}	f	2026-03-05 15:42:50.233	2026-03-05 15:42:50.233			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
90ab1fa8-65f4-4ee8-81e0-f647cb4cbb1f	TC-2026-44912				Medium	Major	Functional	Draft		\N	a			b6704d5d-dc39-4c55-a262-89b5cfdc644c	\N	1	{}	f	2026-03-05 15:43:03.567	2026-03-05 15:43:03.567			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0683744d-589a-47cb-b223-a94be5a04d74	TC-2026-94238	"b0924cad-783f-4330-9808-a377853f9582"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T13:04:27.842Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.242	2026-03-05 18:53:14.242	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
480f2fa0-6a0e-413f-b456-fa64f7f8147a	TC-2026-94240	"2fabf708-9fec-40da-a857-44bfcfc938d4"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T13:35:04.309Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:53:14.244	2026-03-05 18:55:44.405	\N	\N	\N	d73666b7-2fff-46f5-a93c-7949036f1735	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0cffd878-f63a-4b94-aa7c-c25dc6da8c2f	TC-2026-43310-COPY-COPY	TC-2026-27200	scbbhj	100	2354a0E336A91A1	Clarence	Haynes	Approved		\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 16:12:26.03	2026-03-05 16:12:26.03	\N	\N	\N	701ec30b-3473-483c-b5c7-7dc517ea80ed	5a372245-d15d-4439-aeaa-fde1eb24e9b4
24d5afd0-fbc7-4d3e-be6b-01f703a12180	TC-2026-27200-COPY	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-03-05 16:12:25.978	2026-03-05 16:34:36.107	\N	\N	1	701ec30b-3473-483c-b5c7-7dc517ea80ed	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b2f2a61b-7712-4dc0-9b45-2da3eab00a15	TC-2026-44903-COPY	TC-2026-27204		Untitled Test Case	General	Medium	Major	Approved	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-03-05 16:12:26.044	2026-03-05 17:19:22.049	\N	\N	\N	701ec30b-3473-483c-b5c7-7dc517ea80ed	5a372245-d15d-4439-aeaa-fde1eb24e9b4
03646605-5b25-47f3-9505-f551b9c773c3	TC-2026-43326-COPY	Login verification	login details	Auth	High	Critical	Regression	Approved	a	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 16:12:26.012	2026-03-05 17:36:23.065	\N	\N	\N	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3afb6fb6-4490-4ed6-9748-547187269ce3	TC-2026-27194-COPY	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-03-05 16:12:26.001	2026-03-05 18:21:10.298	\N	\N	2	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
691c50de-ba80-4d40-8f66-4a8d9d2f6102	TC-2026-51715	Yashu		yashu@gmail.com	Deactivate User	User ID: 6fa87983-9f89-4966-a143-421951234a3d	2/27/2026	 5:36:21 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.717	2026-03-05 18:54:11.717	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
99344068-6489-4223-8d0d-935307671a08	TC-2026-51734	Yashu		yashu@gmail.com	Create Project	Project: Warehouse 	2/27/2026	 5:35:52 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.735	2026-03-05 18:54:11.735	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
548318af-be96-466f-ba23-c80384cb085b	TC-2026-51739	Yashu		yashu@gmail.com	Create Project	Farm	2/27/2026	 5:33:46 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.741	2026-03-05 18:54:11.741	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
855921df-7e7d-429d-a84d-726ba1f12c5d	TC-2026-51746	Yashu		yashu@gmail.com	Delete Project	Project ID: 8d8af8d4-3ab9-4a69-b096-e5222ed0b79c	2/27/2026	 5:32:03 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.747	2026-03-05 18:54:11.747	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0dde04cb-97e5-471c-84d1-e667a847342c	TC-2026-51751	Yashu		yashu@gmail.com	Delete Project	Project ID: d56c8397-1336-4c11-a4c8-82f4e1f464c1	2/27/2026	 5:29:14 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.753	2026-03-05 18:54:11.753	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6f49374b-98e3-47b5-8545-4a556be43a16	TC-2026-51757	Yashu		yashu@gmail.com	Delete Project	Project ID: 0c3996d6-9386-4b59-accf-f6327f038eea	2/27/2026	 5:29:09 PM	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:54:11.759	2026-03-05 18:54:11.759	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a5a0040a-73be-46cd-afe1-259af0ff9d92	TC-2026-94241	logging	log	Authentication	Medium	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-03-05 18:54:38.2	2026-03-05 18:55:44.38			\N	d73666b7-2fff-46f5-a93c-7949036f1735	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e1600865-06f8-45f6-9671-daef2cbd90c6	TC-1772736950794-8078	"2fabf708-9fec-40da-a857-44bfcfc938d4"		"79818a20-00bc-435f-b4e5-322eee831864"	"f682f61d-6909-4ae9-aa01-3ee808f057a6"	"2026-02-23T13:35:04.309Z"	Functional	"InProgress"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:55:50.797	2026-03-05 18:55:50.797	\N	\N	\N	a154f15e-fd3e-4c77-b6bd-25302ffc9669	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bd27ae58-23ea-4111-903d-64a6d9b529dd	TC-1772736950798-2960	logging	log	Authentication	Medium	Major	Functional	Draft		\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:55:50.8	2026-03-05 18:55:50.8	\N	\N	\N	a154f15e-fd3e-4c77-b6bd-25302ffc9669	5a372245-d15d-4439-aeaa-fde1eb24e9b4
785262e3-0eba-4d85-802b-b3da7c2626a0	TC-2026-94242	sample	sample	Authentication	Medium	Major	Functional	Draft		\N	a			f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 19:23:36.171	2026-03-05 19:23:36.171			\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
92d7b501-6d6b-49d6-812f-21c6a49e9f8a	TC-1772738629253-3523	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 19:23:49.255	2026-03-05 19:23:49.255	\N	\N	2	1502c188-fa27-4fe2-8af4-c0b93b7e66d9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
069906f6-63f8-4fc3-871d-d54f704d0d15	TC-1772738629259-1324	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 19:23:49.261	2026-03-05 19:23:49.261	\N	\N	2	1502c188-fa27-4fe2-8af4-c0b93b7e66d9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bdde75aa-eff9-467e-88d8-2ce7035619b5	TC-1772738629262-1294	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 19:23:49.264	2026-03-05 19:23:49.264	\N	\N	\N	1502c188-fa27-4fe2-8af4-c0b93b7e66d9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
42165c04-a176-49b8-9ffd-2fef00a0ed09	TC-1772738629266-1628	Login verification	login details	Auth	High	Critical	Regression	Approved	a	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 19:23:49.267	2026-03-05 19:23:49.267	\N	\N	\N	1502c188-fa27-4fe2-8af4-c0b93b7e66d9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41f5e576-82ec-45ba-b361-8d2212b4299a	TC-1772734291670-4516	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.672	2026-03-05 18:11:31.672	\N	\N	\N	9d82bcec-b416-4dce-a89a-7038307f1a56	5a372245-d15d-4439-aeaa-fde1eb24e9b4
800026b2-703e-4741-88c2-ba6390d53778	TC-1772734291688-4480	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.69	2026-03-05 18:11:31.69	\N	\N	\N	9d82bcec-b416-4dce-a89a-7038307f1a56	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4442d392-a7cf-4135-bbdc-4c4b4b25085c	TC-1772734291690-3432	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.692	2026-03-05 18:11:31.692	\N	\N	\N	9d82bcec-b416-4dce-a89a-7038307f1a56	5a372245-d15d-4439-aeaa-fde1eb24e9b4
77d064c6-1979-4980-a5f3-d52bba84e2c4	TC-2026-27029	61		a940cE42e035F28	Lynn	Pham	"Brennan	 Camacho and Tapia"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.03	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
de51b75c-b0d3-4cd2-b489-4e7cc367a4a7	TC-2026-27033	62		9Cf5E6AFE0aeBfd	Shelley	Harris	"Prince	 Malone and Pugh"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.035	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c2af7ffb-2d6a-4bc8-b95d-51742eb17000	TC-2026-27186	97		CeD220bdAaCfaDf	Lynn	Atkinson	"Ware	 Burns and Oneal"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.189	2026-03-02 15:53:45.379	\N	\N	\N	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9c03d5ac-a05f-4483-bd6b-41a3026bb980	TC-2026-27200	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 12:25:27.202	2026-03-05 16:13:12.198	\N	\N	1	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3bc7e53e-c3e1-4aa5-827a-d49e040220b1	TC-2026-27191	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.193	2026-03-05 17:36:23.135	\N	\N	\N	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d8bef670-af11-42a9-846c-becd62a235ec	TC-1772734291703-4810	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.705	2026-03-05 18:11:31.705	\N	\N	\N	60770767-a19b-4a36-aa50-5ceccf1565a1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7e785745-40df-4948-a24f-1cbca7596377	TC-1772734291706-4814	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.708	2026-03-05 18:11:31.708	\N	\N	\N	60770767-a19b-4a36-aa50-5ceccf1565a1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9fc89060-40dd-489b-b3db-7b0f4e0ab196	TC-1772734291708-9680	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:31.71	2026-03-05 18:11:31.71	\N	\N	\N	60770767-a19b-4a36-aa50-5ceccf1565a1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a16baff0-9666-41e9-8a80-a751f2c12678	TC-2026-27204	Untitled Test Case		Authentication	Medium	Major	Functional	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.206	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
68fc5745-81b2-4427-ad86-5996b9b930e2	TC-2026-00508	100 (Clone) (Clone)		2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 16:38:51.363	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f457f200-1869-48f2-b60d-99c1768a902e	TC-2026-70055	100 (Clone) (Clone) (Copy)		2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 16:44:30.061	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
62b1b7a1-77ca-4789-a3a1-0c7f036ff13a	TC-2026-64983	Untitled Test Case		Authentication	Medium	Major	Functional	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:26:04.985	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a4e4de24-768b-4348-98e1-fd88d4362279	TC-2026-27155	90		37Ec4B395641c1E	Lori	Flowers	Decker-Mcknight	North Joeburgh	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.157	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b44f8a8b-dd6a-4f88-8cd2-5427aa20085f	TC-2026-27159	91		5ef6d3eefdD43bE	Nina	Chavez	Byrd-Campbell	Cassidychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.162	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
93ae8660-4afa-4c0e-8135-ba48e5d12008	TC-2026-27164	92		98b3aeDcC3B9FF3	Shane	Foley	Rocha-Hart	South Dannymouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.166	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d1de1cbc-6d64-48e5-a2ea-3151360de274	TC-2026-47449	TC-2026-27200		100	2354a0E336A91A1	Clarence	Haynes	"Le	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 19:04:07.452	2026-03-01 19:30:41.122	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
14d520db-ceba-4778-9085-398906159ec8	TC-2026-47478	TC-2026-27204		Untitled Test Case	General	Medium	Major	Functional	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 19:04:07.48	2026-03-05 15:49:03.436	\N	\N	3	6a33adf1-73b0-47d7-9c30-6847228b1b41	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e4a21f5a-531a-42eb-b2e5-4bc56f785e22	TC-1772734318198-7560	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:58.201	2026-03-05 18:11:58.201	\N	\N	\N	4052663b-50ee-4541-bff7-219729888fb7	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fb76397a-b17a-4eec-9cad-d5692ba14919	TC-1772734318204-67	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:58.207	2026-03-05 18:11:58.207	\N	\N	\N	4052663b-50ee-4541-bff7-219729888fb7	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0d8a0006-89d2-40c6-8a6a-dfdf159cc18d	TC-1772734318209-5644	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:11:58.211	2026-03-05 18:11:58.211	\N	\N	\N	4052663b-50ee-4541-bff7-219729888fb7	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fa3950fb-fb59-4377-aa79-9d7a7f112ff2	TC-2026-00001	1		DD37Cf93aecA6Dc	Sheryl	Baxter	Rasmussen Group	East Leonard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.785	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
125b3cad-aeb9-4c1c-abda-e61a0c7d1ea4	TC-2026-00002	2		1Ef7b82A4CAAD10	Preston	Lozano	Vega-Gentry	East Jimmychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.8	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c2aa731d-d5bc-4ce2-9612-a9805d558688	TC-2026-00003	3		6F94879bDAfE5a6	Roy	Berry	Murillo-Perry	Isabelborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.806	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cdcd10cd-31ac-4050-bf65-6a691842fa6b	TC-2026-00004	4		5Cef8BFA16c5e3c	Linda	Olsen	"Dominguez	 Mcmillan and Donovan"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.812	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
913466ac-4821-4d9a-9cfa-73f4711ca9fe	TC-2026-00005	5		053d585Ab6b3159	Joanna	Bender	"Martin	 Lang and Andrade"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.818	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c694f57c-e1e1-45a9-8540-f9ce7c71d5ad	TC-2026-00006	6		2d08FB17EE273F4	Aimee	Downs	Steele Group	Chavezborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.824	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ea5301ff-57e1-43a7-ba95-c1fa66e567ba	TC-2026-00007	7		EA4d384DfDbBf77	Darren	Peck	"Lester	 Woodard and Mitchell"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.83	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ff5a8608-2ff1-4e10-b18b-3267d0e6150f	TC-2026-00008	8		0e04AFde9f225dE	Brett	Mullen	"Sanford	 Davenport and Giles"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.835	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e745b741-d4f1-460f-b56b-5cb586b3a158	TC-2026-00009	9		C2dE4dEEc489ae0	Sheryl	Meyers	Browning-Simon	Robersonstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.843	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
982bda7c-064c-4506-8dcd-03ebcdc7e21f	TC-2026-00010	10		8C2811a503C7c5a	Michelle	Gallagher	Beck-Hendrix	Elaineberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.848	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8416b049-70ca-45ec-8202-6ed0cfea6135	TC-2026-06705	TC-2026-64983 (Copy)		Untitled Test Case	General	Medium	Major	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-20 12:33:26.707	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f25c4eea-dfde-47e5-8786-0dca483753f6	TC-2026-44902	Login verification (Copy)	login details	Auth	High	Critical	Regression	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-27 12:59:04.905	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4bc14f8d-732f-407c-af2e-786cf035a4b1	TC-2026-00011	11		216E205d6eBb815	Carl	Schroeder	"Oconnell	 Meza and Everett"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.854	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
82da4f54-f0ac-4c1d-967f-072eea4fa56e	TC-2026-00012	12		CEDec94deE6d69B	Jenna	Dodson	"Hoffman	 Reed and Mcclain"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.86	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d7c9664d-6990-48c0-87f2-fade92e04621	TC-2026-00013	13		e35426EbDEceaFF	Tracey	Mata	Graham-Francis	South Joannamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.865	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
511ba3a0-b16e-4676-884e-92fd49b24af4	TC-2026-00014	14		A08A8aF8BE9FaD4	Kristine	Cox	Carpenter-Cook	Jodyberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.871	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fc69e945-f1f3-470c-8181-d35200157a10	TC-2026-00015	15		6fEaA1b7cab7B6C	Faith	Lutz	Carter-Hancock	Burchbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.876	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4a9c3049-9a40-4278-9f2c-4b4fb35ce3f0	TC-2026-00016	16		8cad0b4CBceaeec	Miranda	Beasley	Singleton and Sons	Desireeshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.881	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2b0cd7ad-4ee2-43c1-b0e1-e8efec404472	TC-2026-00017	17		a5DC21AE3a21eaA	Caroline	Foley	Winters-Mendoza	West Adriennestad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.886	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
58c5e9e1-0cc0-43f9-b6c3-c6606d0ae2f9	TC-2026-00018	18		F8Aa9d6DfcBeeF8	Greg	Mata	Valentine LLC	Lake Leslie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.891	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a55797aa-a2dc-498a-abb4-8adf7d63356c	TC-2026-00019	19		F160f5Db3EfE973	Clifford	Jacobson	Simon LLC	Harmonview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.896	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0bc3f4a9-b0c2-4608-bdc6-846b59f8c9fa	TC-2026-00020	20		0F60FF3DdCd7aB0	Joanna	Kirk	Mays-Mccormick	Jamesshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.901	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e0c8231a-9fc3-4398-ae5c-18889d620758	TC-2026-00021	21		9F9AdB7B8A6f7F2	Maxwell	Frye	Patterson Inc	East Carly	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.906	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c5b3019b-3ca3-4fd4-b595-b3d97c1730cb	TC-2026-00022	22		FBd0Ded4F02a742	Kiara	Houston	"Manning	 Hester and Arroyo"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.912	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f0325802-9d89-43b3-adf9-7ad1d50df652	TC-2026-00023	23		2FB0FAA1d429421	Colleen	Howard	Greer and Sons	Brittanyview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.917	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
637934df-ccf4-465a-8931-fb515af41014	TC-2026-00024	24		010468dAA11382c	Janet	Valenzuela	Watts-Donaldson	Veronicamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.922	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
98c97961-0f74-4a6b-a829-732345786ea9	TC-2026-00025	25		eC1927Ca84E033e	Shane	Wilcox	Tucker LLC	Bryanville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.928	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
98629710-4dd7-4e64-9ca9-ab22359a3dd4	TC-2026-00026	26		09D7D7C8Fe09aea	Marcus	Moody	Giles Ltd	Kaitlyntown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.933	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d40ccc6c-0883-4b32-81cc-cdc6a0e38c20	TC-2026-00027	27		aBdfcF2c50b0bfD	Dakota	Poole	Simmons Group	Michealshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.938	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
acddf189-cdbc-40c2-8b19-ef3f859f09b5	TC-2026-00028	28		b92EBfdF8a3f0E6	Frederick	Harper	"Hinton	 Chaney and Stokes"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.943	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e6bec617-2e81-4e35-8b8f-be4104b18cbb	TC-2026-00029	29		3B5dAAFA41AFa22	Stefanie	Fitzpatrick	Santana-Duran	Acevedoville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.949	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f7211371-d1d9-4e1e-b33e-458f2f4dee52	TC-2026-00030	30		EDA69ca7a6e96a2	Kent	Bradshaw	Sawyer PLC	North Harold	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.954	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
891b95ca-38c0-4071-9157-fbc0ec97a388	TC-2026-00031	31		64DCcDFaB9DFd4e	Jack	Tate	"Acosta	 Petersen and Morrow"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.959	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b5d1b961-d127-4aba-bf79-f74d527ff090	TC-2026-00032	32		679c6c83DD872d6	Tom	Trujillo	Mcgee Group	Cunninghamborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.964	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
107174bf-531e-4b42-947c-99bd8b5be7ee	TC-2026-00033	33		7Ce381e4Afa4ba9	Gabriel	Mejia	Adkins-Salinas	Port Annatown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.97	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3b52315a-97e3-4f45-92a7-bceec52c137a	TC-2026-00034	34		A09AEc6E3bF70eE	Kaitlyn	Santana	Herrera Group	New Kaitlyn	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.976	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a5864803-79d7-4b0d-bab9-c35e413c81db	TC-2026-00035	35		aA9BAFfBc3710fe	Faith	Moon	"Waters	 Chase and Aguilar"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.981	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f6dce250-eded-4d7a-aaa1-8f76d34210e5	TC-2026-00036	36		E11dfb2DB8C9f72	Tammie	Haley	"Palmer	 Barnes and Houston"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.987	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f641ace0-8b9a-4e66-9647-3b4ba6d49872	TC-2026-00038	38		7a1Ee69F4fF4B4D	Jordan	Gay	Glover and Sons	South Walter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:38.999	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3231008a-6248-47c3-be5f-bd4908cf49c7	TC-2026-00039	39		dca4f1D0A0fc5c9	Bruce	Esparza	Huerta-Mclean	Poolefurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.004	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c822ab55-7b88-4a03-ab73-92b0fcf18de3	TC-2026-00040	40		17aD8e2dB3df03D	Sherry	Garza	Anderson Ltd	West John	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.01	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8ee85dfa-13b8-41ce-9aac-f254325f0a12	TC-2026-00041	41		2f79Cd309624Abb	Natalie	Gentry	Monroe PLC	West Darius	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.015	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c77849c8-e46a-443c-8139-8dee12288f05	TC-2026-00042	42		6e5ad5a5e2bB5Ca	Bryan	Dunn	Kaufman and Sons	North Jimstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.02	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
44113e3f-4942-4d76-9e2e-340eb88c829d	TC-2026-00046	46		fD780ED8dbEae7B	Joanne	Montes	"Price	 Sexton and Mcdaniel"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.042	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
84a42da0-5649-41a9-8962-1d048fb7e01d	TC-2026-00047	47		300A40d3ce24bBA	Geoffrey	Guzman	Short-Wiggins	Zimmermanland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.047	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a54e4f51-11bb-42e6-8e3a-d2a551f5445e	TC-2026-00048	48		283DFCD0Dba40aF	Gloria	Mccall	"Brennan	 Acosta and Ramos"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.056	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5622d314-37b6-4d84-abf7-0ebe81fb41a2	TC-2026-00049	49		F4Fc91fEAEad286	Brady	Cohen	Osborne-Erickson	North Eileenville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.065	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ca7cee95-1a52-457b-a9e4-0c3781452b31	TC-2026-00050	50		80F33Fd2AcebF05	Latoya	Mccann	"Hobbs	 Garrett and Sanford"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.074	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
199bbe07-81b1-4582-ac78-32eedf825d4c	TC-2026-00051	51		Aa20BDe68eAb0e9	Gerald	Hawkins	"Phelps	 Forbes and Koch"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.081	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6b83cf23-e55b-4086-9b6c-99b80fd92f15	TC-2026-00052	52		e898eEB1B9FE22b	Samuel	Crawford	"May	 Goodwin and Martin"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.087	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d713a5f0-2f71-4b12-aa63-4bdd71e07dad	TC-2026-00053	53		faCEF517ae7D8eB	Patricia	Goodwin	"Christian	 Winters and Ellis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.093	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f9f9833f-2424-4b5f-9ede-b34027f9b3ac	TC-2026-00054	54		c09952De6Cda8aA	Stacie	Richard	Byrd Inc	New Deborah	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.105	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e687acfe-1a29-40bf-a96d-ed269c900362	TC-2026-00055	55		f3BEf3Be028166f	Robin	West	"Nixon	 Blackwell and Sosa"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.111	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cd8a501f-da06-4fb7-b94c-f9b4eda780b5	TC-2026-00056	56		C6F2Fc6a7948a4e	Ralph	Haas	Montes PLC	Lake Ellenchester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.117	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
09a88861-1b87-4269-ae83-7725c66148d1	TC-2026-00057	57		c8FE57cBBdCDcb2	Phyllis	Maldonado	Costa PLC	Lake Whitney	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.123	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
dbb3d079-1d53-42b7-af49-594fd3f883e2	TC-2026-00058	58		B5acdFC982124F2	Danny	Parrish	Novak LLC	East Jaredbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.129	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2ba2f3fa-abb3-488b-bdbe-18ccf52867c7	TC-2026-00059	59		8c7DdF10798bCC3	Kathy	Hill	"Moore	 Mccoy and Glass"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.134	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
84212117-95fa-4690-9c20-8dccb82d833d	TC-2026-00060	60		C681dDd0cc422f7	Kelli	Hardy	Petty Ltd	Huangfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.139	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e83d21e5-b957-4f99-9e58-5f41291da82d	TC-2026-00061	61		a940cE42e035F28	Lynn	Pham	"Brennan	 Camacho and Tapia"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.144	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
94ead45e-64f5-4fc7-885e-ff937047dde3	TC-2026-00062	62		9Cf5E6AFE0aeBfd	Shelley	Harris	"Prince	 Malone and Pugh"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.15	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3094acac-5efc-4c23-a498-274118d01f5e	TC-2026-00063	63		aEcbe5365BbC67D	Eddie	Jimenez	Caldwell Group	West Kristine	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.155	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
094bda14-b247-4706-be67-ef525098db73	TC-2026-00064	64		FCBdfCEAe20A8Dc	Chloe	Hutchinson	Simon LLC	South Julia	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.16	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
01c8e25a-be50-492b-b31d-11d6aaecaae5	TC-2026-00065	65		636cBF0835E10ff	Eileen	Lynch	"Knight	 Abbott and Hubbard"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.166	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
26a202de-6c81-4277-adf3-54aaeb6db6ea	TC-2026-00066	66		fF1b6c9E8Fbf1ff	Fernando	Lambert	Church-Banks	Lake Nancy	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.172	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5c5ca07f-256e-4a9c-877a-5164ca5c8a4d	TC-2026-00067	67		2A13F74EAa7DA6c	Makayla	Cannon	Henderson Inc	Georgeport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.178	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e537c9a1-8b0c-4df5-b4d2-8c097f6546ef	TC-2026-00068	68		a014Ec1b9FccC1E	Tom	Alvarado	Donaldson-Dougherty	South Sophiaberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.183	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2faa7303-7077-4b22-b7d1-60d9718074c3	TC-2026-00069	69		421a109cABDf5fa	Virginia	Dudley	Warren Ltd	Hartbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.188	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a6337b32-14fe-43ce-afaa-04e561846cea	TC-2026-00070	70		CC68FD1D3Bbbf22	Riley	Good	Wade PLC	Erikaville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.194	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bc6a2eac-b859-4a06-b5a2-5268031def91	TC-2026-00071	71		CBCd2Ac8E3eBDF9	Alexandria	Buck	Keller-Coffey	Nicolasfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.201	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41b55fc3-85a9-40ff-b403-38fbb04ac9d3	TC-2026-00072	72		Ef859092FbEcC07	Richard	Roth	Conway-Mcbride	New Jasmineshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.207	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6527b640-5359-4a3c-b08f-0f0e571a8c80	TC-2026-00043	43		7E441b6B228DBcA	Wayne	Simpson	Perkins-Trevino	East Rebekahborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.026	2026-02-28 18:10:22.334	\N	\N	3	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
12460e78-3d78-4916-88a2-149fd8ad7e6d	TC-2026-00075	75		D01Af0AF7cBbFeA	Regina	Stein	Guzman-Brown	Raystad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.237	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5d08406f-8dd7-4c05-aeb1-6b843b449475	TC-2026-00076	76		d40e89dCade7b2F	Debra	Riddle	"Chang	 Aguirre and Leblanc"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.244	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1f6b02ef-8b30-45ac-bf59-b02b1a51cae6	TC-2026-00077	77		BF6a1f9bd1bf8DE	Brittany	Zuniga	Mason-Hester	West Reginald	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.25	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7a67305e-deed-4ee6-b6a6-4dd10f5fa222	TC-2026-00078	78		FfaeFFbbbf280db	Cassidy	Mcmahon	"Mcguire	 Huynh and Hopkins"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.256	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7e52ec94-83bd-4fcc-a2f4-6a6471bc67c2	TC-2026-00079	79		CbAE1d1e9a8dCb1	Laurie	Pennington	"Sanchez	 Marsh and Hale"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.261	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
448f4132-8f12-44a5-8a41-f1fe3da0ed39	TC-2026-00080	80		A7F85c1DE4dB87f	Alejandro	Blair	"Combs	 Waller and Durham"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.266	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d9c6450e-d414-4f98-b517-098cd4190ca6	TC-2026-00081	81		D6CEAfb3BDbaa1A	Leslie	Jennings	Blankenship-Arias	Coreybury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.271	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7902d4c0-40a8-472d-9797-52141fb58fdd	TC-2026-00082	82		Ebdb6F6F7c90b69	Kathleen	Mckay	"Coffey	 Lamb and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.276	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
08229245-71ce-485d-831c-c3de034eadde	TC-2026-00083	83		E8E7e8Cfe516ef0	Hunter	Moreno	Fitzpatrick-Lawrence	East Clinton	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.28	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
31a3c0aa-b629-4e5f-b356-71fc780d8d2f	TC-2026-00084	84		78C06E9b6B3DF20	Chad	Davidson	Garcia-Jimenez	South Joshuashire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.285	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1e87d335-eb7e-4d11-9ef9-0df40c683461	TC-2026-00085	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.291	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0a5b431b-47c8-43c7-a0e6-1ce2b2dd36a3	TC-2026-00086	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.296	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fc2d3a2d-3830-47cd-89d9-a6975d16123d	TC-2026-00089	89		efeb73245CDf1fF	Vernon	Kane	Carter-Strickland	Thomasfurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.311	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f73c89ce-6147-470f-a70f-6857a0244f43	TC-2026-00098	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.357	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4ca269c4-77c0-4621-a467-40beb2a33b1b	TC-2026-00096	96		cb8E23e48d22Eae	Karl	Greer	Carey LLC	East Richard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.347	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
298ce024-17f4-4ecc-b65d-8ec5b53cba85	TC-2026-00087	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.3	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cf26bc27-d288-4f4f-a326-9aed9b54c80d	TC-2026-00090	90	vhvh	37Ec4B395641c1E	High	Critical	Regression	Ready	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-17 11:16:39.316	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
05d71e78-f5b0-4a5d-942d-66559df895d1	TC-2026-00101	100 (Clone)		2354a0E336A91A1	Clarence	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:17:50.736	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9659565b-117d-45a7-9aa2-7ab714595b2e	TC-2026-00095	95		BE91A0bdcA49Bbc	Darrell	Douglas	"Newton	 Petersen and Mathis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.343	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
706d3440-8c20-4d2f-abbc-4cbc3a6a28c2	TC-2026-00100	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.367	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
96224b90-f28b-4ae1-a412-a351ffae0ba0	TC-2026-00088	88		E4Bbcd8AD81fC5f	Alison	Vargas	"Vaughn	 Watts and Leach"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.306	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1211cb9e-9834-4551-97e0-a9179c2232be	TC-2026-00099	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.362	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
716aff64-9d80-4f67-bfc5-721a06c8ea77	TC-2026-00093	93		aAb6AFc7AfD0fF3	Medium	Critical	Lamb-Peterson	Ready for Review	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.334	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44	TC-2026-00094	94	ewrew	54B5B5Fe9F1B6C5	High	Major	Smoke	Ready	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	3	{}	f	2026-02-17 11:16:39.339	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a29127d3-87f4-4640-831d-7b35a25fd116	TC-2026-00102	97 (Clone)	afshdgf	CeD220bdAaCfaDf	Medium	Atkinson	"Ware	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:32:12.642	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
79818a20-00bc-435f-b4e5-322eee831864	TC-2026-00097	97	afshdgf	CeD220bdAaCfaDf	Medium	Atkinson	"Ware	Approved	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	t	2026-02-17 11:16:39.353	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
caed6ce2-814a-4845-8bb8-8e54ff6771d1	TC-2026-00092	92		98b3aeDcC3B9FF3	Shane	Major	Rocha-Hart	Ready for Review	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.328	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8c6758e5-40df-4ea9-b5b4-85e2904e4162	TC-2026-00091	91		5ef6d3eefdD43bE	High	Chavez	Byrd-Campbell	Cassidychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-17 11:16:39.321	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
533792dc-ee27-4aa2-85b8-dc1c0a0bc401	TC-2026-00103	1		DD37Cf93aecA6Dc	Sheryl	Baxter	Rasmussen Group	East Leonard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:04.978	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d819ce3f-81b1-48c1-8897-e55355833921	TC-2026-00104	2		1Ef7b82A4CAAD10	Preston	Lozano	Vega-Gentry	East Jimmychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:04.989	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bf589aac-e6f1-47b6-9fa4-b011e248a746	TC-2026-00105	3		6F94879bDAfE5a6	Roy	Berry	Murillo-Perry	Isabelborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:04.997	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e43a0691-bbea-4594-957b-e9175085d18d	TC-2026-00106	4		5Cef8BFA16c5e3c	Linda	Olsen	"Dominguez	 Mcmillan and Donovan"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.005	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3137cbc2-21e9-49c1-93af-582439a9e2b4	TC-2026-00107	5		053d585Ab6b3159	Joanna	Bender	"Martin	 Lang and Andrade"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.013	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ff5501fb-b661-48d7-8c1e-05b26eaf692a	TC-2026-00108	6		2d08FB17EE273F4	Aimee	Downs	Steele Group	Chavezborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.02	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9b7f0586-ba1a-465f-b960-635b24b851c3	TC-2026-00109	7		EA4d384DfDbBf77	Darren	Peck	"Lester	 Woodard and Mitchell"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.027	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8f53565d-94ea-48a1-9b38-94747aea8634	TC-2026-00110	8		0e04AFde9f225dE	Brett	Mullen	"Sanford	 Davenport and Giles"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.033	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
28ca27d9-69ce-4939-8840-6b954afe8165	TC-2026-00111	9		C2dE4dEEc489ae0	Sheryl	Meyers	Browning-Simon	Robersonstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.04	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b360c3fe-fcbd-46e5-9f47-52790a95059b	TC-2026-00112	10		8C2811a503C7c5a	Michelle	Gallagher	Beck-Hendrix	Elaineberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.046	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
60102622-e80b-43c9-95c1-15c09ab230c0	TC-2026-00113	11		216E205d6eBb815	Carl	Schroeder	"Oconnell	 Meza and Everett"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.052	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
63908284-c7f9-499e-a1e3-6183d2f305be	TC-2026-00114	12		CEDec94deE6d69B	Jenna	Dodson	"Hoffman	 Reed and Mcclain"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.057	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c0c2f05f-0739-44e6-afee-1895226807a5	TC-2026-00115	13		e35426EbDEceaFF	Tracey	Mata	Graham-Francis	South Joannamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.063	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
114d0a85-1d62-475c-a6b3-f56f6a20d6ab	TC-2026-00116	14		A08A8aF8BE9FaD4	Kristine	Cox	Carpenter-Cook	Jodyberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.068	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
96442b03-c567-4aaa-ab51-a513ccb96100	TC-2026-00117	15		6fEaA1b7cab7B6C	Faith	Lutz	Carter-Hancock	Burchbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.075	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
84935c2a-2b8f-4bfe-be66-17a47a0a7851	TC-2026-00118	16		8cad0b4CBceaeec	Miranda	Beasley	Singleton and Sons	Desireeshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.081	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4b5e9e26-636a-4bac-84f2-0aa00eff9f6b	TC-2026-00119	17		a5DC21AE3a21eaA	Caroline	Foley	Winters-Mendoza	West Adriennestad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.088	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
046c1b8e-976e-41a0-b603-cfd24f6c3db9	TC-2026-00120	18		F8Aa9d6DfcBeeF8	Greg	Mata	Valentine LLC	Lake Leslie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.095	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b1429b58-0427-4cbd-99e8-354a842a9f6c	TC-2026-00121	19		F160f5Db3EfE973	Clifford	Jacobson	Simon LLC	Harmonview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.1	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a736bd3a-9273-4138-bb5e-5610d77e6a38	TC-2026-00122	20		0F60FF3DdCd7aB0	Joanna	Kirk	Mays-Mccormick	Jamesshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.106	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1bef2e1a-9fdd-49af-98e7-6e0dcca0c83f	TC-2026-00123	21		9F9AdB7B8A6f7F2	Maxwell	Frye	Patterson Inc	East Carly	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.112	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a611fd2a-8f30-49ce-8b62-3b1ddd862fc6	TC-2026-00124	22		FBd0Ded4F02a742	Kiara	Houston	"Manning	 Hester and Arroyo"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.119	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
636b60fd-3b25-43ef-9d4c-45e4fa9c8c46	TC-2026-00125	23		2FB0FAA1d429421	Colleen	Howard	Greer and Sons	Brittanyview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.126	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
10a213a6-2ef7-43f6-893c-fd5b102532dc	TC-2026-00126	24		010468dAA11382c	Janet	Valenzuela	Watts-Donaldson	Veronicamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.131	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b149b663-68c1-4bbc-b25a-446ff1d7a0f7	TC-2026-00127	25		eC1927Ca84E033e	Shane	Wilcox	Tucker LLC	Bryanville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.138	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f3214ea4-8459-46d4-9c21-dbeb938d0b52	TC-2026-00128	26		09D7D7C8Fe09aea	Marcus	Moody	Giles Ltd	Kaitlyntown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.145	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0601922f-d964-4420-bad8-ddde37430033	TC-2026-00129	27		aBdfcF2c50b0bfD	Dakota	Poole	Simmons Group	Michealshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.15	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7441282b-fc2f-498e-9cab-e7c1211ab63f	TC-2026-00130	28		b92EBfdF8a3f0E6	Frederick	Harper	"Hinton	 Chaney and Stokes"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.156	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b4f0ad5c-ba30-45e5-8ced-43ce58c5df4b	TC-2026-00131	29		3B5dAAFA41AFa22	Stefanie	Fitzpatrick	Santana-Duran	Acevedoville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.163	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
eedfbc23-ba2a-4ed9-9de3-0405eb24b7ba	TC-2026-00132	30		EDA69ca7a6e96a2	Kent	Bradshaw	Sawyer PLC	North Harold	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.169	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d5445f01-aae6-410a-9509-a054080b55db	TC-2026-00133	31		64DCcDFaB9DFd4e	Jack	Tate	"Acosta	 Petersen and Morrow"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.175	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e740b8be-1757-4ad7-a96d-4f0732314880	TC-2026-00134	32		679c6c83DD872d6	Tom	Trujillo	Mcgee Group	Cunninghamborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.181	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
18d2443d-99bc-4d4e-b58a-905e350e1c17	TC-2026-00135	33		7Ce381e4Afa4ba9	Gabriel	Mejia	Adkins-Salinas	Port Annatown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.186	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c12b3555-a3f1-4165-9502-6d822bd767fa	TC-2026-00136	34		A09AEc6E3bF70eE	Kaitlyn	Santana	Herrera Group	New Kaitlyn	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.192	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
84467880-f087-45d8-8f73-d060dce0e65f	TC-2026-00137	35		aA9BAFfBc3710fe	Faith	Moon	"Waters	 Chase and Aguilar"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.198	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5e73fe8a-1813-4139-b97e-4a22237695eb	TC-2026-00138	36		E11dfb2DB8C9f72	Tammie	Haley	"Palmer	 Barnes and Houston"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.204	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
eb197155-0e37-4716-a224-5e0e41955bcb	TC-2026-00139	37		889eCf90f68c5Da	Nicholas	Sosa	Jordan Ltd	South Hunter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.211	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1d45e5f2-3ed3-4d01-84f6-7bb566ce43ce	TC-2026-00140	38		7a1Ee69F4fF4B4D	Jordan	Gay	Glover and Sons	South Walter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.217	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3e6ce3ec-23a8-4b6e-830c-bed8d001d628	TC-2026-00141	39		dca4f1D0A0fc5c9	Bruce	Esparza	Huerta-Mclean	Poolefurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.223	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
51705b5d-0db5-48b7-b89e-46622078043c	TC-2026-00142	40		17aD8e2dB3df03D	Sherry	Garza	Anderson Ltd	West John	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.229	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
71639af3-56cb-4f6b-852a-9f5f29b7b3b1	TC-2026-00143	41		2f79Cd309624Abb	Natalie	Gentry	Monroe PLC	West Darius	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.234	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0fa2b95b-4a81-413e-a28c-12fa2b04d2fd	TC-2026-00144	42		6e5ad5a5e2bB5Ca	Bryan	Dunn	Kaufman and Sons	North Jimstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.24	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
94c6796e-3d44-470e-bb25-fd37b380fb34	TC-2026-00145	43		7E441b6B228DBcA	Wayne	Simpson	Perkins-Trevino	East Rebekahborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.245	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
23aa6bf0-4855-45c1-9ea0-83f553a11115	TC-2026-00146	44		D3fC11A9C235Dc6	Luis	Greer	Cross PLC	North Drew	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.252	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0930f9eb-0533-403e-a920-f14592375d50	TC-2026-00147	45		30Dfa48fe5Ede78	Rhonda	Frost	"Herrera	 Shepherd and Underwood"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.258	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
47424fe1-fa9b-408e-83cc-18104c0e5cb8	TC-2026-00148	46		fD780ED8dbEae7B	Joanne	Montes	"Price	 Sexton and Mcdaniel"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.263	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8816710a-46c2-4650-95cb-8306715e46dd	TC-2026-00149	47		300A40d3ce24bBA	Geoffrey	Guzman	Short-Wiggins	Zimmermanland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.269	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
74175651-8267-482a-aac5-56b02b6041ab	TC-2026-00150	48		283DFCD0Dba40aF	Gloria	Mccall	"Brennan	 Acosta and Ramos"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.275	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1c3667c5-6d8c-4752-95d2-f034255b1df1	TC-2026-00151	49		F4Fc91fEAEad286	Brady	Cohen	Osborne-Erickson	North Eileenville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.28	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7999ffcd-1108-4986-aaa6-1a9bcd74db85	TC-2026-00152	50		80F33Fd2AcebF05	Latoya	Mccann	"Hobbs	 Garrett and Sanford"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.287	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f134e126-0687-4961-b272-6c764a3d3ce2	TC-2026-00153	51		Aa20BDe68eAb0e9	Gerald	Hawkins	"Phelps	 Forbes and Koch"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.295	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8f6db547-b611-4659-8671-c1bd47d90885	TC-2026-00154	52		e898eEB1B9FE22b	Samuel	Crawford	"May	 Goodwin and Martin"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.302	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2b62a604-354c-4959-a0a4-16d34522c900	TC-2026-00155	53		faCEF517ae7D8eB	Patricia	Goodwin	"Christian	 Winters and Ellis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.308	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41b5089d-2ae5-41ed-9d49-ce41c00f5e69	TC-2026-00156	54		c09952De6Cda8aA	Stacie	Richard	Byrd Inc	New Deborah	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.316	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1f6c178c-c33b-4375-83cf-282b5058aa50	TC-2026-00157	55		f3BEf3Be028166f	Robin	West	"Nixon	 Blackwell and Sosa"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.321	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1a6d3a10-a9b7-417d-8a12-38b0b39d47d4	TC-2026-00158	56		C6F2Fc6a7948a4e	Ralph	Haas	Montes PLC	Lake Ellenchester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.327	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
392673b1-6365-4ebc-9c4b-963475f3aaf2	TC-2026-00159	57		c8FE57cBBdCDcb2	Phyllis	Maldonado	Costa PLC	Lake Whitney	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.336	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8b2dc848-e02b-4d79-99f5-46a19562b6bb	TC-2026-00160	58		B5acdFC982124F2	Danny	Parrish	Novak LLC	East Jaredbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.341	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5eac6de5-d61a-4129-bb13-fc8b2db8d106	TC-2026-00161	59		8c7DdF10798bCC3	Kathy	Hill	"Moore	 Mccoy and Glass"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.346	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
86a61386-4e81-4b5d-b121-b098569c12ff	TC-2026-00162	60		C681dDd0cc422f7	Kelli	Hardy	Petty Ltd	Huangfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.352	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b805c3c4-7bd7-4789-a6e7-7e2bf43b5d14	TC-2026-00163	61		a940cE42e035F28	Lynn	Pham	"Brennan	 Camacho and Tapia"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.359	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
df6e7a05-69eb-4517-8fa9-5686db9ef758	TC-2026-00164	62		9Cf5E6AFE0aeBfd	Shelley	Harris	"Prince	 Malone and Pugh"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.366	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
df8c1352-c528-4971-8f98-45ed56b91c8a	TC-2026-00165	63		aEcbe5365BbC67D	Eddie	Jimenez	Caldwell Group	West Kristine	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.373	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fb4f5111-aff0-4c40-9397-596a4e0cc4dd	TC-2026-00166	64		FCBdfCEAe20A8Dc	Chloe	Hutchinson	Simon LLC	South Julia	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.38	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b46662b6-11f8-4c21-83be-f063165de92d	TC-2026-00167	65		636cBF0835E10ff	Eileen	Lynch	"Knight	 Abbott and Hubbard"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.387	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9a25d9f1-390b-47b9-9abd-938f042a5aaa	TC-2026-00168	66		fF1b6c9E8Fbf1ff	Fernando	Lambert	Church-Banks	Lake Nancy	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.394	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
45e2ca83-5d93-494f-8c2e-f3bfbd67a3b6	TC-2026-00169	67		2A13F74EAa7DA6c	Makayla	Cannon	Henderson Inc	Georgeport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.402	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
af4126b9-1527-40f5-ae55-36e4c0fe64c9	TC-2026-00170	68		a014Ec1b9FccC1E	Tom	Alvarado	Donaldson-Dougherty	South Sophiaberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.409	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7c4ebf75-9548-42f9-aba2-41fc369341db	TC-2026-00171	69		421a109cABDf5fa	Virginia	Dudley	Warren Ltd	Hartbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.416	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
420a485b-6415-41c7-808e-a41a9cf2b484	TC-2026-00172	70		CC68FD1D3Bbbf22	Riley	Good	Wade PLC	Erikaville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.424	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
713e0f64-d45b-4c04-bc05-ff40bea9735a	TC-2026-00173	71		CBCd2Ac8E3eBDF9	Alexandria	Buck	Keller-Coffey	Nicolasfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.432	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7544bf9b-9dbe-4209-95ed-5548b970ee91	TC-2026-00174	72		Ef859092FbEcC07	Richard	Roth	Conway-Mcbride	New Jasmineshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.44	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
da1cf20b-5b58-46e4-bf4e-b757cb2e2aaf	TC-2026-00175	73		F560f2d3cDFb618	Candice	Keller	Huynh and Sons	East Summerstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.447	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
baa42b15-b132-457a-a2a8-4dd75709e84f	TC-2026-00176	74		A3F76Be153Df4a3	Anita	Benson	Parrish Ltd	Skinnerport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.455	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6a6cbf0b-a6ea-410a-9c03-a28a5b014729	TC-2026-00177	75		D01Af0AF7cBbFeA	Regina	Stein	Guzman-Brown	Raystad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.461	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
de8d77ae-ee05-47ca-9d51-2a066f795b47	TC-2026-00178	76		d40e89dCade7b2F	Debra	Riddle	"Chang	 Aguirre and Leblanc"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.469	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a810e631-5eb4-435b-8eb5-dabc99290728	TC-2026-00179	77		BF6a1f9bd1bf8DE	Brittany	Zuniga	Mason-Hester	West Reginald	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.476	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
817c4f0e-ce77-48d9-a201-e54eac117200	TC-2026-00180	78		FfaeFFbbbf280db	Cassidy	Mcmahon	"Mcguire	 Huynh and Hopkins"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.483	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b8a80262-b650-4330-8860-3f7875ea124b	TC-2026-00181	79		CbAE1d1e9a8dCb1	Laurie	Pennington	"Sanchez	 Marsh and Hale"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.49	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
17ef705a-1c83-44a8-9f28-96de681ba671	TC-2026-00182	80		A7F85c1DE4dB87f	Alejandro	Blair	"Combs	 Waller and Durham"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.497	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
210d2227-1145-4e33-affb-4045fdfcd8f8	TC-2026-00183	81		D6CEAfb3BDbaa1A	Leslie	Jennings	Blankenship-Arias	Coreybury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.507	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cf7c4288-e59f-4c68-89e8-28e948da2db3	TC-2026-00184	82		Ebdb6F6F7c90b69	Kathleen	Mckay	"Coffey	 Lamb and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.515	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6eab9978-462d-4a6a-9c5a-caa39b4a05c3	TC-2026-00185	83		E8E7e8Cfe516ef0	Hunter	Moreno	Fitzpatrick-Lawrence	East Clinton	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.522	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bec0b78a-c7fb-4807-9aff-43a49c9b1122	TC-2026-00186	84		78C06E9b6B3DF20	Chad	Davidson	Garcia-Jimenez	South Joshuashire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.528	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
53169c08-a67d-479a-8170-9477e3999b1e	TC-2026-00187	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.533	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7b47de9e-1b09-4d6b-8497-2c66915939f2	TC-2026-00188	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.539	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7ca1052a-fb3a-4753-882f-5d70172d3480	TC-2026-00189	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.545	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8496570a-0ae4-48a4-91c9-de1a20791428	TC-2026-00190	88		E4Bbcd8AD81fC5f	Alison	Vargas	"Vaughn	 Watts and Leach"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.552	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4e00948e-b06b-4023-aa30-713df33d0af9	TC-2026-00191	89		efeb73245CDf1fF	Vernon	Kane	Carter-Strickland	Thomasfurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.558	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
642fe8b2-6793-4b25-9a56-8db4f87d82df	TC-2026-00192	90		37Ec4B395641c1E	Lori	Flowers	Decker-Mcknight	North Joeburgh	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.563	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d77f171d-bd28-443f-b91b-b0bbbd45f54d	TC-2026-00193	91		5ef6d3eefdD43bE	Nina	Chavez	Byrd-Campbell	Cassidychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.568	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3e995dfa-ddca-4591-b2c9-373734b01c28	TC-2026-00194	92		98b3aeDcC3B9FF3	Shane	Foley	Rocha-Hart	South Dannymouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.574	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f7b0d56f-8f90-400b-9644-a92de125c2ab	TC-2026-00195	93		aAb6AFc7AfD0fF3	Collin	Ayers	Lamb-Peterson	South Lonnie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.579	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4dd17b76-f810-4509-8b34-b7374d1a057a	TC-2026-00196	94		54B5B5Fe9F1B6C5	Sherry	Young	"Lee	 Lucero and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.585	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7855d630-527a-4b76-82fe-f7ee11bd80d7	TC-2026-00197	95		BE91A0bdcA49Bbc	Darrell	Douglas	"Newton	 Petersen and Mathis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.592	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3e00e968-8949-4f0e-8ae9-64a7f852878b	TC-2026-00198	96		cb8E23e48d22Eae	Karl	Greer	Carey LLC	East Richard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.598	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
dd1f0049-fa63-42d9-9651-6fcb2c8e99fd	TC-2026-00199	97		CeD220bdAaCfaDf	Lynn	Atkinson	"Ware	 Burns and Oneal"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.603	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e3f61ef7-d864-4a12-b4ef-6d0739858067	TC-2026-00200	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.608	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cab0070f-5274-4839-b0bc-58209aa54da3	TC-2026-00201	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.614	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7b1a6c74-748b-45b9-b41a-5a1252782328	TC-2026-00202	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 11:59:05.621	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bea70e7b-b0c6-42d6-9712-fa2091e66a84	TC-2026-00203	1		DD37Cf93aecA6Dc	Sheryl	Baxter	Rasmussen Group	East Leonard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.67	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5f4fe083-f120-438c-8199-7d43ed5fc819	TC-2026-00204	2		1Ef7b82A4CAAD10	Preston	Lozano	Vega-Gentry	East Jimmychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.698	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e46016e3-8c98-4d67-8647-d6bd2c4e20a7	TC-2026-00205	3		6F94879bDAfE5a6	Roy	Berry	Murillo-Perry	Isabelborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.706	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
557e697f-2427-468c-9f48-2d1b383e5b13	TC-2026-00206	4		5Cef8BFA16c5e3c	Linda	Olsen	"Dominguez	 Mcmillan and Donovan"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.714	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f7f37703-011d-4bfa-bb75-49047d3c2388	TC-2026-00207	5		053d585Ab6b3159	Joanna	Bender	"Martin	 Lang and Andrade"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.724	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a1a37401-17fb-49a0-ae23-87c18f9794e3	TC-2026-00208	6		2d08FB17EE273F4	Aimee	Downs	Steele Group	Chavezborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.731	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c3c7445b-f3a1-4a81-a80c-b1b3b1ec45c9	TC-2026-00209	7		EA4d384DfDbBf77	Darren	Peck	"Lester	 Woodard and Mitchell"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.737	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ae17b3bb-919a-4bd8-ada7-9acb845ce312	TC-2026-00210	8		0e04AFde9f225dE	Brett	Mullen	"Sanford	 Davenport and Giles"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.745	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5fb23b66-4a72-48a1-b138-194eab5876cb	TC-2026-00211	9		C2dE4dEEc489ae0	Sheryl	Meyers	Browning-Simon	Robersonstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.753	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a620925a-d5fa-42fb-98a5-48e5464aa002	TC-2026-00212	10		8C2811a503C7c5a	Michelle	Gallagher	Beck-Hendrix	Elaineberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.76	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
af5c8576-3637-47e5-b965-50d51d58473f	TC-2026-00213	11		216E205d6eBb815	Carl	Schroeder	"Oconnell	 Meza and Everett"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.765	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
43d4e814-c227-4230-9742-20ff46f83a01	TC-2026-00214	12		CEDec94deE6d69B	Jenna	Dodson	"Hoffman	 Reed and Mcclain"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.772	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d7280e06-dcb1-4482-8ada-4961b571fdbd	TC-2026-00215	13		e35426EbDEceaFF	Tracey	Mata	Graham-Francis	South Joannamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.778	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2284164e-9f96-4fec-a787-8ea007596070	TC-2026-00216	14		A08A8aF8BE9FaD4	Kristine	Cox	Carpenter-Cook	Jodyberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.784	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cc04bb48-ec70-4eeb-89c0-f133a4d91700	TC-2026-00217	15		6fEaA1b7cab7B6C	Faith	Lutz	Carter-Hancock	Burchbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.792	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ff7143d4-7cba-48bf-b33b-25314b83bda7	TC-2026-00218	16		8cad0b4CBceaeec	Miranda	Beasley	Singleton and Sons	Desireeshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.797	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6e8c5e88-c304-4022-9139-a2d2e5a43888	TC-2026-00219	17		a5DC21AE3a21eaA	Caroline	Foley	Winters-Mendoza	West Adriennestad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.805	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
09f7bea2-f481-4fdf-a249-c4d0333737e5	TC-2026-00220	18		F8Aa9d6DfcBeeF8	Greg	Mata	Valentine LLC	Lake Leslie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.813	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3c66557a-5b9c-41ed-94d1-a0b73562bf4c	TC-2026-00221	19		F160f5Db3EfE973	Clifford	Jacobson	Simon LLC	Harmonview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.819	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b611f361-41ec-4653-9e55-2687fa6e43a4	TC-2026-00222	20		0F60FF3DdCd7aB0	Joanna	Kirk	Mays-Mccormick	Jamesshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.824	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bfcdf2a5-ba9b-41dd-a0e8-4a4928cbcd96	TC-2026-00223	21		9F9AdB7B8A6f7F2	Maxwell	Frye	Patterson Inc	East Carly	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.83	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
24e55cef-3e5c-4bbc-ad59-c0657211907a	TC-2026-00224	22		FBd0Ded4F02a742	Kiara	Houston	"Manning	 Hester and Arroyo"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.837	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a22ff0e4-77b0-4dd6-a475-6f6ff2f09e28	TC-2026-00225	23		2FB0FAA1d429421	Colleen	Howard	Greer and Sons	Brittanyview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.843	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e573dd88-892c-4e49-a778-6b42e14a820f	TC-2026-00226	24		010468dAA11382c	Janet	Valenzuela	Watts-Donaldson	Veronicamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.849	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7aafa9d6-8531-4de7-ba83-7076d75d97ae	TC-2026-00227	25		eC1927Ca84E033e	Shane	Wilcox	Tucker LLC	Bryanville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.855	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9a8630e6-3887-4e55-9ef5-4f08a3f91f0b	TC-2026-00228	26		09D7D7C8Fe09aea	Marcus	Moody	Giles Ltd	Kaitlyntown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.862	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
13ce3299-a2bf-4bca-89ba-bb6c92342b82	TC-2026-00229	27		aBdfcF2c50b0bfD	Dakota	Poole	Simmons Group	Michealshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.869	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8e7d019a-3e38-431a-92e2-a8b710039354	TC-2026-00230	28		b92EBfdF8a3f0E6	Frederick	Harper	"Hinton	 Chaney and Stokes"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.877	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5ae53a65-230c-4dea-bd8c-5dbe691b7449	TC-2026-00231	29		3B5dAAFA41AFa22	Stefanie	Fitzpatrick	Santana-Duran	Acevedoville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.885	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7f43208c-a194-4d91-9be6-8101c2782699	TC-2026-00232	30		EDA69ca7a6e96a2	Kent	Bradshaw	Sawyer PLC	North Harold	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.892	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7cc77572-1cec-48a1-9ace-88933485a4cb	TC-2026-00233	31		64DCcDFaB9DFd4e	Jack	Tate	"Acosta	 Petersen and Morrow"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.9	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
30a19d45-df08-4636-96f7-34291a4da964	TC-2026-00234	32		679c6c83DD872d6	Tom	Trujillo	Mcgee Group	Cunninghamborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.908	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
48c6abb8-b2e1-4919-8b71-5be1e295c50b	TC-2026-00235	33		7Ce381e4Afa4ba9	Gabriel	Mejia	Adkins-Salinas	Port Annatown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.915	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2d0b349c-57de-4aa4-b4df-6a66b08d089b	TC-2026-00236	34		A09AEc6E3bF70eE	Kaitlyn	Santana	Herrera Group	New Kaitlyn	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.922	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2df9f5bd-0d8b-4f4c-967b-1ccb04f49f66	TC-2026-00237	35		aA9BAFfBc3710fe	Faith	Moon	"Waters	 Chase and Aguilar"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.93	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1ebf56a5-6a50-40c1-881f-07ff601d1e14	TC-2026-00238	36		E11dfb2DB8C9f72	Tammie	Haley	"Palmer	 Barnes and Houston"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.939	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
34d823ae-647a-4fd4-989a-85b8128d9155	TC-2026-00239	37		889eCf90f68c5Da	Nicholas	Sosa	Jordan Ltd	South Hunter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.946	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
53350617-5d9d-4fa7-8d5c-0abc23622fc8	TC-2026-00240	38		7a1Ee69F4fF4B4D	Jordan	Gay	Glover and Sons	South Walter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.954	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
df73417c-85ce-4a64-b883-ecd8e5ec0e9a	TC-2026-00241	39		dca4f1D0A0fc5c9	Bruce	Esparza	Huerta-Mclean	Poolefurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.962	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fbbb8ade-e4f0-4f2a-9bdd-84fb0a9d5f50	TC-2026-00242	40		17aD8e2dB3df03D	Sherry	Garza	Anderson Ltd	West John	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.968	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d0b3637a-2cb6-4094-a4e1-aaf2e054fbea	TC-2026-00243	41		2f79Cd309624Abb	Natalie	Gentry	Monroe PLC	West Darius	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.976	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b8b74311-bdb7-49fc-91f8-b5517b72a462	TC-2026-00244	42		6e5ad5a5e2bB5Ca	Bryan	Dunn	Kaufman and Sons	North Jimstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.984	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
95610627-6954-4562-9b97-63fc92faa4c2	TC-2026-00245	43		7E441b6B228DBcA	Wayne	Simpson	Perkins-Trevino	East Rebekahborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.99	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
529527a7-d776-456f-a070-c891aed3529f	TC-2026-00246	44		D3fC11A9C235Dc6	Luis	Greer	Cross PLC	North Drew	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:54.996	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a10a5a50-6c22-41bd-9573-19b8c0ae5112	TC-2026-00247	45		30Dfa48fe5Ede78	Rhonda	Frost	"Herrera	 Shepherd and Underwood"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.003	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e92b7171-4fb6-4fc3-a274-d00b503eade4	TC-2026-00248	46		fD780ED8dbEae7B	Joanne	Montes	"Price	 Sexton and Mcdaniel"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.01	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
09070c00-c842-41dd-8255-15850b42f98d	TC-2026-00249	47		300A40d3ce24bBA	Geoffrey	Guzman	Short-Wiggins	Zimmermanland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.017	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6e131c90-3394-4166-8a4c-eef18cbba7fc	TC-2026-00250	48		283DFCD0Dba40aF	Gloria	Mccall	"Brennan	 Acosta and Ramos"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.023	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
641ea90d-bfe5-4406-8865-307ded66ef68	TC-2026-00251	49		F4Fc91fEAEad286	Brady	Cohen	Osborne-Erickson	North Eileenville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.03	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a7293c87-0613-41a9-9f50-afde263ea6c4	TC-2026-00252	50		80F33Fd2AcebF05	Latoya	Mccann	"Hobbs	 Garrett and Sanford"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.036	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
01891778-0b42-4209-8f37-d10ef6f3efd4	TC-2026-00253	51		Aa20BDe68eAb0e9	Gerald	Hawkins	"Phelps	 Forbes and Koch"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.042	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b34835a4-452b-49c4-a423-0202ee048e7d	TC-2026-00254	52		e898eEB1B9FE22b	Samuel	Crawford	"May	 Goodwin and Martin"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.049	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9b0b8661-b167-4bd2-a83e-a2f56bcafdcb	TC-2026-00255	53		faCEF517ae7D8eB	Patricia	Goodwin	"Christian	 Winters and Ellis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.056	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
626fc430-eb0d-444a-8bd8-a3e869ffee22	TC-2026-00256	54		c09952De6Cda8aA	Stacie	Richard	Byrd Inc	New Deborah	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.062	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1b7806ce-f64a-40b1-970f-541b1895136f	TC-2026-00257	55		f3BEf3Be028166f	Robin	West	"Nixon	 Blackwell and Sosa"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.068	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6efafee9-f106-441f-bf3e-03b9a94bd52e	TC-2026-00258	56		C6F2Fc6a7948a4e	Ralph	Haas	Montes PLC	Lake Ellenchester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.073	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
49b7dd53-9887-419a-b18f-26eb2da1e481	TC-2026-00259	57		c8FE57cBBdCDcb2	Phyllis	Maldonado	Costa PLC	Lake Whitney	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.081	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c58bc5a5-2dca-4875-83e3-5b3dc84a3f3e	TC-2026-00260	58		B5acdFC982124F2	Danny	Parrish	Novak LLC	East Jaredbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.089	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
701cc967-49d5-44f5-b907-7c8a7e3f446b	TC-2026-00261	59		8c7DdF10798bCC3	Kathy	Hill	"Moore	 Mccoy and Glass"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.095	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
95eeb93b-4cb6-4e43-afc9-6e959124be2a	TC-2026-00262	60		C681dDd0cc422f7	Kelli	Hardy	Petty Ltd	Huangfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.101	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
07d2d900-ee77-48b8-9887-26f2e3080b24	TC-2026-00263	61		a940cE42e035F28	Lynn	Pham	"Brennan	 Camacho and Tapia"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.107	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
27f8541b-f4c7-4c63-a858-94d703ee2478	TC-2026-00264	62		9Cf5E6AFE0aeBfd	Shelley	Harris	"Prince	 Malone and Pugh"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.114	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
539c593d-a24b-43c8-b8a8-6ae1ea48037c	TC-2026-00265	63		aEcbe5365BbC67D	Eddie	Jimenez	Caldwell Group	West Kristine	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.121	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0ad093eb-3f6f-4c6c-9277-d6b5fea5a125	TC-2026-00266	64		FCBdfCEAe20A8Dc	Chloe	Hutchinson	Simon LLC	South Julia	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.127	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e83987a2-426a-42f5-ab89-b3de5f6a56df	TC-2026-00267	65		636cBF0835E10ff	Eileen	Lynch	"Knight	 Abbott and Hubbard"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.136	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
01664229-478f-432e-b95d-9bb44aa340ba	TC-2026-00268	66		fF1b6c9E8Fbf1ff	Fernando	Lambert	Church-Banks	Lake Nancy	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.142	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9d28993a-8918-47b2-a143-360d2c505dbd	TC-2026-00269	67		2A13F74EAa7DA6c	Makayla	Cannon	Henderson Inc	Georgeport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.148	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c66d8454-bbb3-4d28-9c2e-6d369c840d12	TC-2026-00270	68		a014Ec1b9FccC1E	Tom	Alvarado	Donaldson-Dougherty	South Sophiaberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.154	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b949580f-bc67-4684-9276-99d8320fb4c7	TC-2026-00271	69		421a109cABDf5fa	Virginia	Dudley	Warren Ltd	Hartbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.161	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
dd8d1ffe-365d-466a-80c4-baa394801841	TC-2026-00272	70		CC68FD1D3Bbbf22	Riley	Good	Wade PLC	Erikaville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.166	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8876ee09-75ce-49ee-9332-95af42f22431	TC-2026-00273	71		CBCd2Ac8E3eBDF9	Alexandria	Buck	Keller-Coffey	Nicolasfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.173	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7168105a-ecce-4e51-913b-b969b6b23b7f	TC-2026-00274	72		Ef859092FbEcC07	Richard	Roth	Conway-Mcbride	New Jasmineshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.177	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b8512e6f-d1d3-4054-8bbf-8dbde0c5d4c7	TC-2026-00275	73		F560f2d3cDFb618	Candice	Keller	Huynh and Sons	East Summerstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.184	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e7f93f24-7266-45d2-b6ea-deb0032ca590	TC-2026-00276	74		A3F76Be153Df4a3	Anita	Benson	Parrish Ltd	Skinnerport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.189	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b8f9334f-b23c-4629-8521-5ba5c2deaebb	TC-2026-00277	75		D01Af0AF7cBbFeA	Regina	Stein	Guzman-Brown	Raystad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.195	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2babe7e6-0d2b-455b-af20-6bef5b3bf86f	TC-2026-00278	76		d40e89dCade7b2F	Debra	Riddle	"Chang	 Aguirre and Leblanc"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.201	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
37362a1c-0a3f-475f-bf6f-4743f1a4a655	TC-2026-00279	77		BF6a1f9bd1bf8DE	Brittany	Zuniga	Mason-Hester	West Reginald	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.206	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ef393232-169f-459b-91cf-29ec3bc2b319	TC-2026-00280	78		FfaeFFbbbf280db	Cassidy	Mcmahon	"Mcguire	 Huynh and Hopkins"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.212	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6d78128a-430b-4487-b2bd-bf5aa126c662	TC-2026-00281	79		CbAE1d1e9a8dCb1	Laurie	Pennington	"Sanchez	 Marsh and Hale"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.217	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3c0cab8a-f6c5-4bf3-baf4-f0815b1261e7	TC-2026-00282	80		A7F85c1DE4dB87f	Alejandro	Blair	"Combs	 Waller and Durham"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.224	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
416cba23-2bf6-40b4-9f76-2959cb9baedc	TC-2026-00283	81		D6CEAfb3BDbaa1A	Leslie	Jennings	Blankenship-Arias	Coreybury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.23	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
dda29ffb-2778-4883-be53-4832ea0f2d25	TC-2026-00284	82		Ebdb6F6F7c90b69	Kathleen	Mckay	"Coffey	 Lamb and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.236	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
48c8973c-57e8-4079-8eb3-f618a9d6c436	TC-2026-00285	83		E8E7e8Cfe516ef0	Hunter	Moreno	Fitzpatrick-Lawrence	East Clinton	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.242	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ac015dfc-7295-4a9e-badf-12a7d2789bc3	TC-2026-00286	84		78C06E9b6B3DF20	Chad	Davidson	Garcia-Jimenez	South Joshuashire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.248	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4a0a6d1f-574d-4a0d-80a5-eacc47d91fc2	TC-2026-00287	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.254	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7aeccd7b-5d90-49c7-92c5-b1cfbda928a0	TC-2026-00288	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.26	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
355c72b5-4266-491b-86c2-2e4a3dceb008	TC-2026-00289	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.265	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
184240c2-05d6-466e-a09e-dad57ce37da8	TC-2026-00290	88		E4Bbcd8AD81fC5f	Alison	Vargas	"Vaughn	 Watts and Leach"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.273	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
059cb082-90be-4809-a129-8ff7a50bd358	TC-2026-00291	89		efeb73245CDf1fF	Vernon	Kane	Carter-Strickland	Thomasfurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.283	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
72637720-444e-4b6b-b592-6b77b8a204cf	TC-2026-00292	90		37Ec4B395641c1E	Lori	Flowers	Decker-Mcknight	North Joeburgh	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.289	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3f6e4458-2d7f-4321-bd89-5c782e48ca2c	TC-2026-00293	91		5ef6d3eefdD43bE	Nina	Chavez	Byrd-Campbell	Cassidychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.294	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
eeca79ad-f50e-483a-8a7b-fee1b9493efb	TC-2026-00294	92		98b3aeDcC3B9FF3	Shane	Foley	Rocha-Hart	South Dannymouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.301	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
20d2e6e2-6525-4790-8092-c98e3fb7f99f	TC-2026-00295	93		aAb6AFc7AfD0fF3	Collin	Ayers	Lamb-Peterson	South Lonnie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.307	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1e9be7db-e237-43b8-98ce-1dfe7b0d92f6	TC-2026-00296	94		54B5B5Fe9F1B6C5	Sherry	Young	"Lee	 Lucero and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.313	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d0d1ac48-3a42-4d34-bc75-d627cb08a122	TC-2026-00297	95		BE91A0bdcA49Bbc	Darrell	Douglas	"Newton	 Petersen and Mathis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.318	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fa96e5f6-d57b-435d-8062-c163c4d98b6b	TC-2026-00298	96		cb8E23e48d22Eae	Karl	Greer	Carey LLC	East Richard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.324	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d3430ec7-eafe-4f4e-84f9-2f4239f3029e	TC-2026-00299	97		CeD220bdAaCfaDf	Lynn	Atkinson	"Ware	 Burns and Oneal"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.329	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b049cba6-cc92-400b-9f51-f69a7d9f61e8	TC-2026-00300	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.336	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
09ae9163-d730-4eb2-9e73-298a73f0f0a0	TC-2026-00301	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.342	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2a38abd8-4ba7-48aa-abfb-7ae274f700ec	TC-2026-00302	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:18:55.347	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f404231a-eedd-41ec-803d-84dbacdcc7fa	TC-2026-89167	1		DD37Cf93aecA6Dc	Sheryl	Baxter	Rasmussen Group	East Leonard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.333	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
47e1fe4c-7ae0-49cb-8536-a91174980fc3	TC-2026-89341	2		1Ef7b82A4CAAD10	Preston	Lozano	Vega-Gentry	East Jimmychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.35	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fb0c354e-64cf-49b0-b0c4-0cb154d4663a	TC-2026-89347	3		6F94879bDAfE5a6	Roy	Berry	Murillo-Perry	Isabelborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.356	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a3f5e193-0df3-4a7c-9855-a7243df198e0	TC-2026-89352	4		5Cef8BFA16c5e3c	Linda	Olsen	"Dominguez	 Mcmillan and Donovan"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.361	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a7163931-1590-4e55-9b76-17d09a4ababe	TC-2026-89357	5		053d585Ab6b3159	Joanna	Bender	"Martin	 Lang and Andrade"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.366	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7a9b5693-6a1c-40cf-afbc-c79c986b6bcf	TC-2026-89362	6		2d08FB17EE273F4	Aimee	Downs	Steele Group	Chavezborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.372	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e87a877c-3e1e-45bd-b3a5-6dba1679bce0	TC-2026-89368	7		EA4d384DfDbBf77	Darren	Peck	"Lester	 Woodard and Mitchell"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.377	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f2e0ea5e-3b57-4af6-a4e1-8210b2b7cbc4	TC-2026-89373	8		0e04AFde9f225dE	Brett	Mullen	"Sanford	 Davenport and Giles"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.382	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
aaca3501-a888-4d13-b543-2da761d1bddc	TC-2026-89378	9		C2dE4dEEc489ae0	Sheryl	Meyers	Browning-Simon	Robersonstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.388	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
efd3bd8e-cfbc-4268-9356-68d3eaa74f48	TC-2026-89384	10		8C2811a503C7c5a	Michelle	Gallagher	Beck-Hendrix	Elaineberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.394	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c34575fe-3074-4a9a-9f75-7cba4a19c446	TC-2026-89390	11		216E205d6eBb815	Carl	Schroeder	"Oconnell	 Meza and Everett"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.399	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7a073cff-c51c-46f6-b4d7-a032f51b5a09	TC-2026-89395	12		CEDec94deE6d69B	Jenna	Dodson	"Hoffman	 Reed and Mcclain"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.404	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
19814452-ee10-4462-a32d-b68e5c274d5e	TC-2026-89399	13		e35426EbDEceaFF	Tracey	Mata	Graham-Francis	South Joannamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.409	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b06cce11-e04d-4fa9-8f77-ee3f17e7a0e4	TC-2026-89405	14		A08A8aF8BE9FaD4	Kristine	Cox	Carpenter-Cook	Jodyberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.414	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c25a7a31-3158-4244-8a61-6fcc50c80f36	TC-2026-89410	15		6fEaA1b7cab7B6C	Faith	Lutz	Carter-Hancock	Burchbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.419	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
59aaf7b5-62b1-4ae3-abd7-aae35bf0f44f	TC-2026-89414	16		8cad0b4CBceaeec	Miranda	Beasley	Singleton and Sons	Desireeshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.423	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6cad1426-4d0d-4534-8674-cc12b919f735	TC-2026-89419	17		a5DC21AE3a21eaA	Caroline	Foley	Winters-Mendoza	West Adriennestad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.428	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
822cd3bb-28e5-4f0c-b81d-676975bf3551	TC-2026-89424	18		F8Aa9d6DfcBeeF8	Greg	Mata	Valentine LLC	Lake Leslie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.433	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
02d0b4df-7fbf-41d3-97ef-fb0be653deec	TC-2026-89428	19		F160f5Db3EfE973	Clifford	Jacobson	Simon LLC	Harmonview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.437	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c74dce75-41b8-4165-8aaf-7e5d190f758e	TC-2026-89433	20		0F60FF3DdCd7aB0	Joanna	Kirk	Mays-Mccormick	Jamesshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.442	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2f81fb17-e52b-4299-aad4-d93a2cd02930	TC-2026-89438	21		9F9AdB7B8A6f7F2	Maxwell	Frye	Patterson Inc	East Carly	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.447	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7f0de8ce-eaf0-44b4-9faa-e47aa26185b1	TC-2026-89442	22		FBd0Ded4F02a742	Kiara	Houston	"Manning	 Hester and Arroyo"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.451	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9ff8ace6-1014-4728-9e87-b845cfd8253f	TC-2026-89446	23		2FB0FAA1d429421	Colleen	Howard	Greer and Sons	Brittanyview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.456	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e0e1173d-40a7-48c5-8129-957b46296c6b	TC-2026-89451	24		010468dAA11382c	Janet	Valenzuela	Watts-Donaldson	Veronicamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.46	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bab9e780-7702-451b-85a9-fff750207d50	TC-2026-89456	25		eC1927Ca84E033e	Shane	Wilcox	Tucker LLC	Bryanville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.465	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a6afc096-e05c-498b-a1e2-e678180c48eb	TC-2026-89462	26		09D7D7C8Fe09aea	Marcus	Moody	Giles Ltd	Kaitlyntown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.471	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d8ad7604-5537-4992-91ed-91e20a1af876	TC-2026-89466	27		aBdfcF2c50b0bfD	Dakota	Poole	Simmons Group	Michealshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.475	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
99ecceec-a65d-4695-9087-e787dfa1e818	TC-2026-89470	28		b92EBfdF8a3f0E6	Frederick	Harper	"Hinton	 Chaney and Stokes"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.479	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
88235395-9809-4147-9675-6bb2dc5a20c3	TC-2026-89475	29		3B5dAAFA41AFa22	Stefanie	Fitzpatrick	Santana-Duran	Acevedoville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.484	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f938c2ff-d1d0-44b1-9f7d-402c3bac2c9f	TC-2026-89479	30		EDA69ca7a6e96a2	Kent	Bradshaw	Sawyer PLC	North Harold	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.488	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fb59b27a-680d-4ce8-8b84-1ca683831f18	TC-2026-89484	31		64DCcDFaB9DFd4e	Jack	Tate	"Acosta	 Petersen and Morrow"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.493	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b40b063f-022e-419e-b6f8-ad15b02078de	TC-2026-89489	32		679c6c83DD872d6	Tom	Trujillo	Mcgee Group	Cunninghamborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.498	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0d896468-663c-48c0-9df7-bf50005d184b	TC-2026-89494	33		7Ce381e4Afa4ba9	Gabriel	Mejia	Adkins-Salinas	Port Annatown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.502	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
67f2b742-8184-44e2-ad28-cce91f0e5ccd	TC-2026-89498	34		A09AEc6E3bF70eE	Kaitlyn	Santana	Herrera Group	New Kaitlyn	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.507	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5f1ef288-5908-429c-815a-467d3c71c9bb	TC-2026-89503	35		aA9BAFfBc3710fe	Faith	Moon	"Waters	 Chase and Aguilar"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.512	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5410109e-7437-429a-ad55-5f1c84987ee4	TC-2026-89508	36		E11dfb2DB8C9f72	Tammie	Haley	"Palmer	 Barnes and Houston"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.517	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
095d64b7-2d78-4747-8a33-b011f73a2460	TC-2026-89513	37		889eCf90f68c5Da	Nicholas	Sosa	Jordan Ltd	South Hunter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.522	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f9ca4e4e-64bf-46ea-9dcc-127ceacf4bbe	TC-2026-89517	38		7a1Ee69F4fF4B4D	Jordan	Gay	Glover and Sons	South Walter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.526	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ae988d07-4cb6-4a95-bbb7-44f09c0e2d9f	TC-2026-89522	39		dca4f1D0A0fc5c9	Bruce	Esparza	Huerta-Mclean	Poolefurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.531	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bf980f33-a826-4de6-9b1b-ef6888226e57	TC-2026-89526	40		17aD8e2dB3df03D	Sherry	Garza	Anderson Ltd	West John	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.535	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0992df5e-82f5-4691-96f3-4cf93bbeabdc	TC-2026-89531	41		2f79Cd309624Abb	Natalie	Gentry	Monroe PLC	West Darius	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.54	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8b41bcd1-fbf2-4f29-94c5-0d0ad9395a17	TC-2026-89536	42		6e5ad5a5e2bB5Ca	Bryan	Dunn	Kaufman and Sons	North Jimstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.545	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0e080d2a-db7b-4b9c-94f1-ebc9910be4b7	TC-2026-89539	43		7E441b6B228DBcA	Wayne	Simpson	Perkins-Trevino	East Rebekahborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.549	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
532c86ff-0346-4da6-a63b-d2fcd674f64b	TC-2026-89544	44		D3fC11A9C235Dc6	Luis	Greer	Cross PLC	North Drew	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.553	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d569f607-7b16-411f-b42c-67e127e5f73e	TC-2026-89549	45		30Dfa48fe5Ede78	Rhonda	Frost	"Herrera	 Shepherd and Underwood"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.558	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5c07be19-b1b7-4457-bd8f-0eaeb6503fe0	TC-2026-89553	46		fD780ED8dbEae7B	Joanne	Montes	"Price	 Sexton and Mcdaniel"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.562	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8ff8b662-b204-461e-a7b9-93cf8a72e6dc	TC-2026-89558	47		300A40d3ce24bBA	Geoffrey	Guzman	Short-Wiggins	Zimmermanland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.567	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
afccaa75-55f6-42a8-8608-2a096d8decf3	TC-2026-89562	48		283DFCD0Dba40aF	Gloria	Mccall	"Brennan	 Acosta and Ramos"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.571	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c56d9171-3896-43bf-b87f-2b3d6d9d11fa	TC-2026-89567	49		F4Fc91fEAEad286	Brady	Cohen	Osborne-Erickson	North Eileenville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.576	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4d4392d3-186c-4b42-be24-4d67590ef3a5	TC-2026-89572	50		80F33Fd2AcebF05	Latoya	Mccann	"Hobbs	 Garrett and Sanford"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.581	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1e91109b-9b70-4c5d-8974-40616609860e	TC-2026-89576	51		Aa20BDe68eAb0e9	Gerald	Hawkins	"Phelps	 Forbes and Koch"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.585	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
721835d4-ee66-4c62-a919-f478acf96b23	TC-2026-89581	52		e898eEB1B9FE22b	Samuel	Crawford	"May	 Goodwin and Martin"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.59	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
25d5eeff-0596-4cee-9d73-eaa6da498b29	TC-2026-89586	53		faCEF517ae7D8eB	Patricia	Goodwin	"Christian	 Winters and Ellis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.595	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1ed66c24-3d29-4294-8339-44504cc06caa	TC-2026-89590	54		c09952De6Cda8aA	Stacie	Richard	Byrd Inc	New Deborah	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.599	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
12424eee-7eea-494a-8554-23ecb14d4988	TC-2026-89595	55		f3BEf3Be028166f	Robin	West	"Nixon	 Blackwell and Sosa"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.604	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
acae8265-f6ea-4242-a612-fff6ebcada25	TC-2026-89600	56		C6F2Fc6a7948a4e	Ralph	Haas	Montes PLC	Lake Ellenchester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.609	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c04d9a90-f108-40c3-9bdc-f38ec75baf28	TC-2026-89604	57		c8FE57cBBdCDcb2	Phyllis	Maldonado	Costa PLC	Lake Whitney	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.613	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
97be8f90-de32-4ecd-9a00-0d80f282e480	TC-2026-89609	58		B5acdFC982124F2	Danny	Parrish	Novak LLC	East Jaredbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.618	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
54241d70-6242-4f16-8962-6f9ab9e969af	TC-2026-89614	59		8c7DdF10798bCC3	Kathy	Hill	"Moore	 Mccoy and Glass"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.623	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ae562565-92c9-4922-a55c-cdd9edf9835d	TC-2026-89618	60		C681dDd0cc422f7	Kelli	Hardy	Petty Ltd	Huangfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.627	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
77557863-0466-4a16-9173-a53ff2e5d9d1	TC-2026-89623	61		a940cE42e035F28	Lynn	Pham	"Brennan	 Camacho and Tapia"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.632	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
34cc5342-5444-4c1c-98c8-9425ec495988	TC-2026-89627	62		9Cf5E6AFE0aeBfd	Shelley	Harris	"Prince	 Malone and Pugh"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.636	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5da3d7b1-fca8-4f5e-8323-5b9e7d0c8e33	TC-2026-89632	63		aEcbe5365BbC67D	Eddie	Jimenez	Caldwell Group	West Kristine	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.64	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1c25d1dd-d929-4b75-b302-6bc4b90ec001	TC-2026-89635	64		FCBdfCEAe20A8Dc	Chloe	Hutchinson	Simon LLC	South Julia	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.644	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2dc6eb51-423a-48c0-b22f-f1658e82e8df	TC-2026-89640	65		636cBF0835E10ff	Eileen	Lynch	"Knight	 Abbott and Hubbard"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.649	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
94279332-8e08-4ef9-bf04-4da54df96b79	TC-2026-89645	66		fF1b6c9E8Fbf1ff	Fernando	Lambert	Church-Banks	Lake Nancy	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.654	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6fe2f59d-f9b3-4073-b569-b448a2932806	TC-2026-89649	67		2A13F74EAa7DA6c	Makayla	Cannon	Henderson Inc	Georgeport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.658	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
73c89563-3a2b-4668-8402-a047b67ccc35	TC-2026-89654	68		a014Ec1b9FccC1E	Tom	Alvarado	Donaldson-Dougherty	South Sophiaberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.663	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d93184f1-a5b3-44a1-86a9-39caea0d09f1	TC-2026-89659	69		421a109cABDf5fa	Virginia	Dudley	Warren Ltd	Hartbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.668	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2bffba92-7320-42c6-9edf-7b0be52faffd	TC-2026-89663	70		CC68FD1D3Bbbf22	Riley	Good	Wade PLC	Erikaville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.672	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5796e729-0012-4967-956a-d0dcb728153d	TC-2026-89668	71		CBCd2Ac8E3eBDF9	Alexandria	Buck	Keller-Coffey	Nicolasfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.677	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b09985dc-aad6-4868-a456-2ca0bdde6be9	TC-2026-89673	72		Ef859092FbEcC07	Richard	Roth	Conway-Mcbride	New Jasmineshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.682	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0cf284c1-fffd-4e24-80cc-3151c8a8eebc	TC-2026-89677	73		F560f2d3cDFb618	Candice	Keller	Huynh and Sons	East Summerstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.686	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b5dce780-2a82-4b65-a1bc-490cbbf5959a	TC-2026-89682	74		A3F76Be153Df4a3	Anita	Benson	Parrish Ltd	Skinnerport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.69	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
311ef274-c430-477e-a290-6b65b586112b	TC-2026-89686	75		D01Af0AF7cBbFeA	Regina	Stein	Guzman-Brown	Raystad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.695	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fa6137dc-bb2b-4cf9-b72e-025eef1cec34	TC-2026-89690	76		d40e89dCade7b2F	Debra	Riddle	"Chang	 Aguirre and Leblanc"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.699	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2d548995-db92-47a6-ae54-a1e8eab8010b	TC-2026-89694	77		BF6a1f9bd1bf8DE	Brittany	Zuniga	Mason-Hester	West Reginald	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.703	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a8aa787c-8587-41a6-9b01-e80439ed4038	TC-2026-89698	78		FfaeFFbbbf280db	Cassidy	Mcmahon	"Mcguire	 Huynh and Hopkins"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.707	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ce6d970d-ae61-448d-81be-aaf7f02914fe	TC-2026-89703	79		CbAE1d1e9a8dCb1	Laurie	Pennington	"Sanchez	 Marsh and Hale"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.712	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bc42d7cc-3e60-48f6-9fca-bf1c22a35b29	TC-2026-89708	80		A7F85c1DE4dB87f	Alejandro	Blair	"Combs	 Waller and Durham"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.717	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
44e3db63-5cda-41d6-92ab-595d6975fb42	TC-2026-89712	81		D6CEAfb3BDbaa1A	Leslie	Jennings	Blankenship-Arias	Coreybury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.721	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
819c7ff5-7ae5-41c9-ae1f-10f0e631c15e	TC-2026-89717	82		Ebdb6F6F7c90b69	Kathleen	Mckay	"Coffey	 Lamb and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.726	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a6c8fbee-4a54-4dea-a844-c715d2f22373	TC-2026-89722	83		E8E7e8Cfe516ef0	Hunter	Moreno	Fitzpatrick-Lawrence	East Clinton	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.731	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3afd5ad0-e775-4075-ae3c-3f26d5ae03b5	TC-2026-89727	84		78C06E9b6B3DF20	Chad	Davidson	Garcia-Jimenez	South Joshuashire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.736	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b790a3de-4558-4305-8d5c-a9a0c6f86227	TC-2026-89731	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.74	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
622eb021-a4ad-4583-ba76-1bd112afb0d4	TC-2026-89736	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.745	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4f2ec554-d9af-4e98-b700-fbd5df620583	TC-2026-89740	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.749	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
55c8e29f-a3ee-41da-8e1b-6609ea595902	TC-2026-89745	88		E4Bbcd8AD81fC5f	Alison	Vargas	"Vaughn	 Watts and Leach"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.755	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a48a095d-6bf4-4b32-a849-3735a4c85695	TC-2026-89750	89		efeb73245CDf1fF	Vernon	Kane	Carter-Strickland	Thomasfurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.759	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e427b037-dc3d-4e8c-987b-d8b2225a65bb	TC-2026-89755	90		37Ec4B395641c1E	Lori	Flowers	Decker-Mcknight	North Joeburgh	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.764	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4046f56b-f452-43f8-8d1a-1007c8ddb583	TC-2026-89759	91		5ef6d3eefdD43bE	Nina	Chavez	Byrd-Campbell	Cassidychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.768	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2dc084fd-efa4-4d69-9e67-c9cb52126129	TC-2026-89764	92		98b3aeDcC3B9FF3	Shane	Foley	Rocha-Hart	South Dannymouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.773	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b32742d0-06cb-4b5a-b2ef-a2cdb2647a1a	TC-2026-89768	93		aAb6AFc7AfD0fF3	Collin	Ayers	Lamb-Peterson	South Lonnie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.777	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ba0ecfda-f289-43c1-8652-09754b355cfa	TC-2026-89772	94		54B5B5Fe9F1B6C5	Sherry	Young	"Lee	 Lucero and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.782	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
08f9c821-9a7f-40b2-b863-89ca42b561a2	TC-2026-89777	95		BE91A0bdcA49Bbc	Darrell	Douglas	"Newton	 Petersen and Mathis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.786	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c4e338ef-76ae-44ac-83d7-c1b686d3a84a	TC-2026-89781	96		cb8E23e48d22Eae	Karl	Greer	Carey LLC	East Richard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.79	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
065415b0-6e1d-478d-ab87-5bb0f55c5476	TC-2026-89786	97		CeD220bdAaCfaDf	Lynn	Atkinson	"Ware	 Burns and Oneal"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.796	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5dbed34f-d70a-4ec9-8061-5e80ac77ae76	TC-2026-89791	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.8	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0588fa6b-821b-45a1-97f4-9eaed245be25	TC-2026-89796	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.805	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
622fa9c8-7f32-47ff-851d-f9365bc075d6	TC-2026-89801	100		2354a0E336A91A1	Clarence	Haynes	"Le	 Nash and Cross"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:21:29.81	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
761c0cc9-743a-44c7-8b49-d6f9acb92e82	TC-2026-82250	Untitled Test Case		General	Medium	Major	Functional	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:24:42.253	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
35f6c851-42d8-45ca-a704-b0a0e477735f	TC-2026-26767	1		DD37Cf93aecA6Dc	Sheryl	Baxter	Rasmussen Group	East Leonard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.769	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d2e049e9-b210-4171-9640-a541de15e37a	TC-2026-26783	2		1Ef7b82A4CAAD10	Preston	Lozano	Vega-Gentry	East Jimmychester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.785	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
54717657-1394-442c-94c2-078029881a89	TC-2026-26788	3		6F94879bDAfE5a6	Roy	Berry	Murillo-Perry	Isabelborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.79	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
659a704b-690d-4167-a68f-22666d881271	TC-2026-26791	4		5Cef8BFA16c5e3c	Linda	Olsen	"Dominguez	 Mcmillan and Donovan"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.794	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e0a0108d-53a7-4d3c-8ff5-fb1baad1ff1e	TC-2026-26795	5		053d585Ab6b3159	Joanna	Bender	"Martin	 Lang and Andrade"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.797	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1c31ac4f-9c3c-4dfb-92f6-0c80495ebb09	TC-2026-26798	6		2d08FB17EE273F4	Aimee	Downs	Steele Group	Chavezborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.801	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ad9b7ead-f0f8-46a1-b513-f1f76fbfd7b9	TC-2026-26803	7		EA4d384DfDbBf77	Darren	Peck	"Lester	 Woodard and Mitchell"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.805	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
adb12e0b-6ab8-4585-9667-7fdad98574a9	TC-2026-26807	8		0e04AFde9f225dE	Brett	Mullen	"Sanford	 Davenport and Giles"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.81	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4ae35502-0ad9-4f6d-8160-511b2a7f0c36	TC-2026-26813	9		C2dE4dEEc489ae0	Sheryl	Meyers	Browning-Simon	Robersonstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.815	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0ce141c8-9c78-41ce-8257-b4e424db9b2c	TC-2026-26817	10		8C2811a503C7c5a	Michelle	Gallagher	Beck-Hendrix	Elaineberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.819	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
98055156-f30e-44ac-85b0-5cb3110f3a4b	TC-2026-26820	11		216E205d6eBb815	Carl	Schroeder	"Oconnell	 Meza and Everett"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.822	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4491f375-21dd-450c-87c4-a8c2be28d184	TC-2026-26824	12		CEDec94deE6d69B	Jenna	Dodson	"Hoffman	 Reed and Mcclain"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.826	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9f9e4f80-4203-4172-845a-e52ebcd7264d	TC-2026-26828	13		e35426EbDEceaFF	Tracey	Mata	Graham-Francis	South Joannamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.83	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f3f0d6e8-ee8c-4e64-b84d-7c19233dbc33	TC-2026-26833	14		A08A8aF8BE9FaD4	Kristine	Cox	Carpenter-Cook	Jodyberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.835	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f81b6438-61c7-4267-b497-85b3cee67722	TC-2026-26838	15		6fEaA1b7cab7B6C	Faith	Lutz	Carter-Hancock	Burchbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.84	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
00f54431-400a-4bde-a66d-35f9fcb1359c	TC-2026-26843	16		8cad0b4CBceaeec	Miranda	Beasley	Singleton and Sons	Desireeshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.845	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b619fee3-1733-46c8-86e2-8451a9955b97	TC-2026-26846	17		a5DC21AE3a21eaA	Caroline	Foley	Winters-Mendoza	West Adriennestad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.848	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
564e72a4-1097-4800-ab95-54b36babfc13	TC-2026-26850	18		F8Aa9d6DfcBeeF8	Greg	Mata	Valentine LLC	Lake Leslie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.852	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
58c2e469-b4da-4570-8c35-f8c0c476e834	TC-2026-26854	19		F160f5Db3EfE973	Clifford	Jacobson	Simon LLC	Harmonview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.856	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
f0410e6c-1dd0-4b44-91d7-887631e7fa8d	TC-2026-26858	20		0F60FF3DdCd7aB0	Joanna	Kirk	Mays-Mccormick	Jamesshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.86	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
06f6339a-925f-4de0-9c3a-a24ce9631ac5	TC-2026-26861	21		9F9AdB7B8A6f7F2	Maxwell	Frye	Patterson Inc	East Carly	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.863	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d344688e-1776-48a2-9dfe-18c31fcc0df4	TC-2026-26865	22		FBd0Ded4F02a742	Kiara	Houston	"Manning	 Hester and Arroyo"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.867	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41f0e602-00bf-44a3-9d02-b1f4d2cf21a2	TC-2026-26868	23		2FB0FAA1d429421	Colleen	Howard	Greer and Sons	Brittanyview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.87	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b9dbe234-8687-4050-a2bf-d90fefd9bb96	TC-2026-26873	24		010468dAA11382c	Janet	Valenzuela	Watts-Donaldson	Veronicamouth	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.875	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2c79c25c-1ba0-4eae-84a4-c8f8ddb77f53	TC-2026-26878	25		eC1927Ca84E033e	Shane	Wilcox	Tucker LLC	Bryanville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.88	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1e4bebfa-a694-4fe6-b402-8fe2c4747537	TC-2026-26881	26		09D7D7C8Fe09aea	Marcus	Moody	Giles Ltd	Kaitlyntown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.884	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
83ea779e-0245-459d-b09e-ce989d4ef456	TC-2026-26885	27		aBdfcF2c50b0bfD	Dakota	Poole	Simmons Group	Michealshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.887	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9be184d4-aa06-4d03-a477-e41d09759362	TC-2026-26889	28		b92EBfdF8a3f0E6	Frederick	Harper	"Hinton	 Chaney and Stokes"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.891	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
11a679c1-edbf-4e43-9532-d5814f6bf934	TC-2026-26893	29		3B5dAAFA41AFa22	Stefanie	Fitzpatrick	Santana-Duran	Acevedoville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.895	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4840eb58-7021-4325-b48b-a32a11a299c3	TC-2026-26896	30		EDA69ca7a6e96a2	Kent	Bradshaw	Sawyer PLC	North Harold	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.898	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6e96323d-8cba-4434-84ad-ca821bb80a04	TC-2026-26901	31		64DCcDFaB9DFd4e	Jack	Tate	"Acosta	 Petersen and Morrow"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.903	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
818f2c5d-deac-4b18-a5ac-28f64e721611	TC-2026-26906	32		679c6c83DD872d6	Tom	Trujillo	Mcgee Group	Cunninghamborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.908	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6cc58725-7419-43d5-961d-597622ba0ac8	TC-2026-26911	33		7Ce381e4Afa4ba9	Gabriel	Mejia	Adkins-Salinas	Port Annatown	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.913	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8c8b87f9-ceed-44ad-ba5f-8e1bcc99ce6d	TC-2026-26914	34		A09AEc6E3bF70eE	Kaitlyn	Santana	Herrera Group	New Kaitlyn	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.916	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
eb110554-b4c9-4a80-91a4-dfe1fce7f3bc	TC-2026-26918	35		aA9BAFfBc3710fe	Faith	Moon	"Waters	 Chase and Aguilar"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.92	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
357c9053-5c44-4d09-a373-4a9a079d09a1	TC-2026-26921	36		E11dfb2DB8C9f72	Tammie	Haley	"Palmer	 Barnes and Houston"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.923	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
053c0a66-f142-4447-b6d0-df047a4db6e5	TC-2026-26926	37		889eCf90f68c5Da	Nicholas	Sosa	Jordan Ltd	South Hunter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.928	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
374563ff-96a9-43d3-ac71-6ba0909f6147	TC-2026-26930	38		7a1Ee69F4fF4B4D	Jordan	Gay	Glover and Sons	South Walter	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.932	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6dc53295-2133-4f0b-be6b-ef0a55dac641	TC-2026-26934	39		dca4f1D0A0fc5c9	Bruce	Esparza	Huerta-Mclean	Poolefurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.936	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
83819b16-cc37-4286-a98a-fd072bda4497	TC-2026-26938	40		17aD8e2dB3df03D	Sherry	Garza	Anderson Ltd	West John	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.941	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
71c35645-eed8-478a-b415-80fbe066fff2	TC-2026-26943	41		2f79Cd309624Abb	Natalie	Gentry	Monroe PLC	West Darius	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.945	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5e10f53c-2fa9-4a34-96a5-359e97da8a47	TC-2026-26947	42		6e5ad5a5e2bB5Ca	Bryan	Dunn	Kaufman and Sons	North Jimstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.949	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
54472fae-7035-4f01-a900-5f891eeba84c	TC-2026-26950	43		7E441b6B228DBcA	Wayne	Simpson	Perkins-Trevino	East Rebekahborough	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.953	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
adc6499e-6f46-485b-ad67-cbbb47f0391c	TC-2026-26956	44		D3fC11A9C235Dc6	Luis	Greer	Cross PLC	North Drew	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.958	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8973c3ef-516c-4218-a4a7-4dad58cd5d97	TC-2026-26960	45		30Dfa48fe5Ede78	Rhonda	Frost	"Herrera	 Shepherd and Underwood"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.962	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8f668031-40e8-4643-9bb9-e9781ebc0736	TC-2026-26964	46		fD780ED8dbEae7B	Joanne	Montes	"Price	 Sexton and Mcdaniel"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.966	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d4793df9-41c9-4915-82fd-f9ef7d764849	TC-2026-26969	47		300A40d3ce24bBA	Geoffrey	Guzman	Short-Wiggins	Zimmermanland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.971	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9301d0f8-9605-4242-8a9c-b3b0dcf56acd	TC-2026-26974	48		283DFCD0Dba40aF	Gloria	Mccall	"Brennan	 Acosta and Ramos"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.976	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
848bdd5c-708f-4407-94d9-3d09d6c45cd7	TC-2026-26978	49		F4Fc91fEAEad286	Brady	Cohen	Osborne-Erickson	North Eileenville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.981	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5a894485-c371-45fb-9b49-bb8cf4cffd2a	TC-2026-26983	50		80F33Fd2AcebF05	Latoya	Mccann	"Hobbs	 Garrett and Sanford"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.985	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d71f09aa-b918-4751-a4a4-48ed980c4a72	TC-2026-26988	51		Aa20BDe68eAb0e9	Gerald	Hawkins	"Phelps	 Forbes and Koch"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.99	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6bfbff42-6a30-42d2-8b2c-82836c044d60	TC-2026-26992	52		e898eEB1B9FE22b	Samuel	Crawford	"May	 Goodwin and Martin"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.995	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ecf6611d-77b7-4e05-aad8-79016af57ed0	TC-2026-26997	53		faCEF517ae7D8eB	Patricia	Goodwin	"Christian	 Winters and Ellis"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:26.999	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
50c844cb-2ee1-4949-b3b1-76f479effcd4	TC-2026-27000	54		c09952De6Cda8aA	Stacie	Richard	Byrd Inc	New Deborah	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.002	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a741936b-f057-4384-8338-4591e74e2b68	TC-2026-27004	55		f3BEf3Be028166f	Robin	West	"Nixon	 Blackwell and Sosa"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.006	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0586836c-6355-4a83-ac70-07593e1e8137	TC-2026-27008	56		C6F2Fc6a7948a4e	Ralph	Haas	Montes PLC	Lake Ellenchester	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.01	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a21bbe45-a437-4393-8898-8d90350847ed	TC-2026-27012	57		c8FE57cBBdCDcb2	Phyllis	Maldonado	Costa PLC	Lake Whitney	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.014	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0507a18d-65f9-4d82-9251-c2a338652a11	TC-2026-27017	58		B5acdFC982124F2	Danny	Parrish	Novak LLC	East Jaredbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.019	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d06d47f5-ff6b-4861-9c2a-a06285f3ae3d	TC-2026-27021	59		8c7DdF10798bCC3	Kathy	Hill	"Moore	 Mccoy and Glass"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.023	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d36748b7-5194-4696-9bac-c926c761fefa	TC-2026-27025	60		C681dDd0cc422f7	Kelli	Hardy	Petty Ltd	Huangfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.027	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b96a29c0-8c2c-449a-b5e7-83348ac3066f	TC-2026-27037	63		aEcbe5365BbC67D	Eddie	Jimenez	Caldwell Group	West Kristine	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.039	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cda87070-5749-4851-8768-d31e75a11cdc	TC-2026-27042	64		FCBdfCEAe20A8Dc	Chloe	Hutchinson	Simon LLC	South Julia	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.044	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
74df8781-cff2-4a8a-9593-f8bac32f7b81	TC-2026-27046	65		636cBF0835E10ff	Eileen	Lynch	"Knight	 Abbott and Hubbard"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.048	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
54887659-399a-4079-a298-fa4d8743f778	TC-2026-27049	66		fF1b6c9E8Fbf1ff	Fernando	Lambert	Church-Banks	Lake Nancy	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.051	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
41a2db8c-ae4c-4019-a0e2-f7e725e3e970	TC-2026-27053	67		2A13F74EAa7DA6c	Makayla	Cannon	Henderson Inc	Georgeport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.055	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6acc27da-bb55-4cc6-a2f1-fcd98a6014a8	TC-2026-27058	68		a014Ec1b9FccC1E	Tom	Alvarado	Donaldson-Dougherty	South Sophiaberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.06	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ca201365-59da-401f-9b2f-39063d4aa60c	TC-2026-27063	69		421a109cABDf5fa	Virginia	Dudley	Warren Ltd	Hartbury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.065	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
32355ec3-483a-406b-af7d-5cae796e5926	TC-2026-27068	70		CC68FD1D3Bbbf22	Riley	Good	Wade PLC	Erikaville	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.07	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6de05c82-c410-4aba-93ba-0b05d95d2099	TC-2026-27073	71		CBCd2Ac8E3eBDF9	Alexandria	Buck	Keller-Coffey	Nicolasfort	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.075	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6b7397fd-9302-4f56-b596-7777520491e6	TC-2026-27077	72		Ef859092FbEcC07	Richard	Roth	Conway-Mcbride	New Jasmineshire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.079	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
62506ac0-c85e-4929-a349-7758fb66f083	TC-2026-27081	73		F560f2d3cDFb618	Candice	Keller	Huynh and Sons	East Summerstad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.083	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
896a9e5e-8d3a-4991-99e5-b6d4e02a6a53	TC-2026-27085	74		A3F76Be153Df4a3	Anita	Benson	Parrish Ltd	Skinnerport	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.087	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b780f25f-0385-4724-bcec-9dee000afaa3	TC-2026-27088	75		D01Af0AF7cBbFeA	Regina	Stein	Guzman-Brown	Raystad	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.09	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
67d01815-8c30-4d20-99ed-7619f572d81f	TC-2026-27092	76		d40e89dCade7b2F	Debra	Riddle	"Chang	 Aguirre and Leblanc"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.094	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2bddb499-0bb0-4826-bf5c-6a941092aec6	TC-2026-27096	77		BF6a1f9bd1bf8DE	Brittany	Zuniga	Mason-Hester	West Reginald	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.097	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8b384eee-d0a5-48c1-acc0-afa406f20d0c	TC-2026-27101	78		FfaeFFbbbf280db	Cassidy	Mcmahon	"Mcguire	 Huynh and Hopkins"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.103	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
783a8d9d-9a18-42e4-9703-13be2c2e1647	TC-2026-27104	79		CbAE1d1e9a8dCb1	Laurie	Pennington	"Sanchez	 Marsh and Hale"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.106	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
02e81350-b3bb-4b68-8fb5-8405d12fac03	TC-2026-27109	80		A7F85c1DE4dB87f	Alejandro	Blair	"Combs	 Waller and Durham"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.111	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b89521e0-fd8b-4251-bdbe-fc7755d93f99	TC-2026-27114	81		D6CEAfb3BDbaa1A	Leslie	Jennings	Blankenship-Arias	Coreybury	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.116	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3d1a149b-4cd6-4603-8822-119dfef02c07	TC-2026-27119	82		Ebdb6F6F7c90b69	Kathleen	Mckay	"Coffey	 Lamb and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.121	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9c13caea-73bd-4cb5-98be-39e75367457b	TC-2026-27123	83		E8E7e8Cfe516ef0	Hunter	Moreno	Fitzpatrick-Lawrence	East Clinton	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.125	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7749ac3d-0149-4e68-9d0a-92dedcd24ea5	TC-2026-27128	84		78C06E9b6B3DF20	Chad	Davidson	Garcia-Jimenez	South Joshuashire	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.13	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0f462e95-1a75-467a-b804-53f5d98bf336	TC-2026-27170	93		aAb6AFc7AfD0fF3	Collin	Ayers	Lamb-Peterson	South Lonnie	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.172	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
54b9dba7-f281-42fd-9105-2cd5d8b6840b	TC-2026-27174	94		54B5B5Fe9F1B6C5	Sherry	Young	"Lee	 Lucero and Johnson"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.176	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9d98d336-fae7-4207-a5e3-36fa5be2d6aa	TC-2026-27183	96		cb8E23e48d22Eae	Karl	Greer	Carey LLC	East Richard	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.185	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3f8b9628-b185-4d9c-b921-437431b3e68e	TC-2026-27150	89		efeb73245CDf1fF	Vernon	Kane	Carter-Strickland	Thomasfurt	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.152	2026-03-05 17:27:41.788	\N	\N	\N	c14b572f-9207-499c-a674-638df7957046	5a372245-d15d-4439-aeaa-fde1eb24e9b4
61af06dc-58fe-4f27-9ef9-82808c450a9d	TC-2026-27136	86		C6763c99d0bd16D	Emma	Cunningham	Stephens Inc	North Jillianview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.138	2026-03-05 18:05:18.28	\N	\N	\N	9b8ff434-25c4-4da2-9463-ea25451de8a0	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1d3ca6ea-24c8-4b13-b8cc-bb796b02cd6b	TC-2026-27141	87		ebe77E5Bf9476CE	Duane	Woods	Montoya-Miller	Lyonsberg	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.143	2026-03-05 18:05:18.294	\N	\N	\N	9b8ff434-25c4-4da2-9463-ea25451de8a0	5a372245-d15d-4439-aeaa-fde1eb24e9b4
66da6fce-9126-4fa1-99d7-734a63bc1065	TC-2026-27131	85		03A1E62ADdeb31c	Corey	Holt	"Mcdonald	 Bird and Ramirez"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.133	2026-03-05 18:05:18.303	\N	\N	\N	9b8ff434-25c4-4da2-9463-ea25451de8a0	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0165cb9f-f3cf-4dec-a229-a72280ae67c5	TC-2026-11734	100 (Clone) (Clone) (Copy) (Copy)		2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 16:45:11.737	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8ca3a631-d622-4662-9095-1917ec0ddf6a	TC-2026-12744	100 (Clone) (Clone) (Copy) (Copy)		2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 16:48:32.749	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ba0cb355-f77e-475d-93cd-e275eecf95e1	TC-2026-04509	100 (Clone) (Clone) (Copy)		2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 16:48:24.514	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
075f277a-1313-49dc-b306-7ade4d9fbfc9	TC-2026-64984	100 (Clone)	asdd	2354a0E336A91A1	High	Haynes	"Le	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-19 16:12:26.932	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4e84dcaa-e150-4250-87b8-5ba3fb645fb8	TC-2026-43329	TC-2026-64983	xdf	Untitled Test Case	General	Medium	Major	Functional		\N	\N		\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	4	{}	t	2026-02-20 08:44:03.336	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7cc9fbe3-efa0-4dc2-be2c-b4f6571a3265	TC-2026-34203	TC-2026-27204 (Copy)		Untitled Test Case	General	Medium	Major	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-20 12:52:14.205	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c19357f0-1963-4372-b4f2-3dfd0d037374	TC-2026-00044	44		D3fC11A9C235Dc6	Luis	Greer	Cross PLC	North Drew	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.031	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bcf38a75-431c-489a-bd99-fdb0b3c825c9	TC-2026-00045	45		30Dfa48fe5Ede78	Rhonda	Frost	"Herrera	 Shepherd and Underwood"	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-17 11:16:39.036	2026-02-28 18:10:22.334	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0d68a8a4-d84a-4509-aa51-78adf6f59bc5	TC-2026-43325	TC-2026-27204	login	Untitled Test Case	High	Medium	Major	Approved		\N	\N		\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-20 08:44:03.331	2026-02-28 18:10:22.334	\N	\N	\N	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
adcfa343-8a05-4bce-8bf4-53f465857b07	TC-2026-43325-COPY	TC-2026-27204	login	Untitled Test Case	High	Medium	Major	Approved		\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-23 17:46:23.607	2026-02-28 18:10:22.334	\N	\N	\N	855f50b5-779e-46b2-990c-9ec8e783228c	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2feb7741-682d-4592-bf05-e2e9d1387b4f	TC-2026-47483	100 (Clone)	sabhb	2354a0E336A91A1	Clarence	Haynes	"Le	Approved		\N	\N		\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-20 08:43:03.65	2026-03-05 16:17:36.813	\N	\N	2	ec2778d3-bb6a-4844-bfec-8dbaeb6e88fe	5a372245-d15d-4439-aeaa-fde1eb24e9b4
540577de-27c1-48e6-ae8d-cb3e58a73744	TC-2026-35628	Untitled Test Case (Copy)		Authentication	Medium	Major	Functional	Draft	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 16:45:35.63	2026-03-05 16:17:36.846	\N	\N	\N	ec2778d3-bb6a-4844-bfec-8dbaeb6e88fe	5a372245-d15d-4439-aeaa-fde1eb24e9b4
19dcc8bf-568b-45e4-b264-19390a039665	TC-2026-43326	Login verification	login details	Auth	High	Critical	Regression	Approved	a	\N		a		f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-27 12:58:18.254	2026-03-01 06:36:24.234			\N	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
95ebeff1-8c99-4d5a-a409-6c62f79ed531	TC-2026-43310-COPY	TC-2026-27200	scbbhj	100	2354a0E336A91A1	Clarence	Haynes	Approved		\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-23 17:46:23.598	2026-03-01 06:36:24.245	\N	\N	\N	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
101bf5ef-9e55-42ce-9a03-77e3c5c01833	TC-1772734342573-7979	98		28CDbC0dFe4b1Db	Fred	Guerra	Schmitt-Jones	Ortegaland	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:12:22.576	2026-03-05 18:12:22.576	\N	\N	\N	8f066eae-bc06-49a3-96ca-ede0d8e8aaa9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1045360c-a11d-43a4-b1c7-d31e4a78a654	TC-2026-44904	Login verification	login details	Auth	High	Critical	Regression	Approved	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-27 14:05:28.595	2026-03-05 10:36:34.694	\N	\N	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9b12273f-19a9-40af-bd63-f4bc45959d5d	TC-2026-44903	TC-2026-27204		Untitled Test Case	General	Medium	Major	Approved	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-27 13:01:05.274	2026-03-05 10:36:34.694	\N	\N	\N	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
811d6be1-ce4d-49ab-94d1-d42851cf64c9	TC-2026-43310	TC-2026-27200	scbbhj	100	2354a0E336A91A1	Clarence	Haynes	Approved		\N	\N		\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	2	{}	f	2026-02-20 08:44:03.317	2026-03-05 16:17:36.866	\N	\N	1	ec2778d3-bb6a-4844-bfec-8dbaeb6e88fe	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9bb88a7f-e948-42b2-adcf-53f9c8494930	TC-1772734342549-1967	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-03-05 18:12:22.551	2026-03-05 18:12:29.516	\N	\N	2	8f066eae-bc06-49a3-96ca-ede0d8e8aaa9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9021021d-9e58-4cb4-aa7b-0e437cb810d8	TC-2026-27194	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-02-19 12:25:27.197	2026-03-05 17:36:23.118	\N	\N	2	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3c9d403e-7ce0-45fd-87c7-d5dadbe7a82c	TC-2026-47482	TC-2026-64983		Untitled Test Case	General	Medium	Major	Functional	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	t	2026-02-19 19:04:07.485	2026-03-05 15:45:24.904	\N	\N	4	6a33adf1-73b0-47d7-9c30-6847228b1b41	5a372245-d15d-4439-aeaa-fde1eb24e9b4
7162bf74-8a51-43d9-be7e-f321458604a9	TC-1772734342552-4351	99		c23d1D9EE8DEB0A	Yvonne	Farmer	Fitzgerald-Harrell	Lake Elijahview	\N	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:12:22.554	2026-03-05 18:12:22.554	\N	\N	2	8f066eae-bc06-49a3-96ca-ede0d8e8aaa9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8eecc2c8-ed72-4627-9f58-dd11ec387dbb	TC-1772734342554-2967	Login verification	login details	Auth	High	Critical	Regression	Approved	a	\N	\N	\N	\N	f682f61d-6909-4ae9-aa01-3ee808f057a6	\N	1	{}	f	2026-03-05 18:12:22.557	2026-03-05 18:12:22.557	\N	\N	\N	8f066eae-bc06-49a3-96ca-ede0d8e8aaa9	5a372245-d15d-4439-aeaa-fde1eb24e9b4
\.


--
-- Data for Name: TestCaseCustomValue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestCaseCustomValue" (id, value, "testCaseId", "fieldId") FROM stdin;
8715eb2f-574c-4de8-9d31-0ad4dcaa89ae	chrome	7ffba524-498d-4e2c-ac34-509dd5344bc3	dc792218-b4a7-4e30-95f8-76eb31d9ea33
93c0788a-714b-454f-b77b-0e5191d538bc	chrome	f26164d6-cb63-4e67-b16b-16d13fcb88be	dc792218-b4a7-4e30-95f8-76eb31d9ea33
c203c576-9479-42a8-b605-1a043b48b398	chrome	90ab1fa8-65f4-4ee8-81e0-f647cb4cbb1f	dc792218-b4a7-4e30-95f8-76eb31d9ea33
\.


--
-- Data for Name: TestCaseTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestCaseTemplate" (id, name, description, module, priority, severity, type, "createdById", "createdAt", category, "isGlobal") FROM stdin;
73a661ed-8d2c-4405-bbdc-23ee1bd22b77	100 (Clone)		2354a0E336A91A1	Clarence	Haynes	"Le	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-19 16:12:40.91	General	t
afa2f736-01e6-4e3d-bb9e-6cc1bfd865be	100 (Clone)		2354a0E336A91A1	Clarence	Haynes	"Le	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-19 16:28:44.429	API Tests	t
94d19793-bbb9-42e3-88e3-d2af2f97cc54	100 (Clone)		2354a0E336A91A1	Clarence	Haynes	"Le	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 11:17:53.481	CRUD Operations	t
bf27cea0-bc5e-4287-a353-365241fc1ffd	TC-2026-64983		Untitled Test Case	General	Medium	Major	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-20 08:42:33.419	General	t
74ebde5d-8d64-43b1-8abf-8986e02eba25	TC-2026-64983		Untitled Test Case	General	Medium	Major	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-20 12:33:36.869	General	t
d7ee89ce-edf4-4690-8216-b5cb3c6f70fb	TC-2026-27204		Untitled Test Case	General	Medium	Major	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-20 12:46:41.972	API Tests	t
9b30328a-5d61-4894-99c8-0a21084fc804	Login verification	login details	Auth	High	Critical	Regression	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-27 12:59:19.589	Login Tests	t
d4dbe0ff-5bc0-4757-92f9-488b9eb7f2ea	asaaa	a	Authentication	Medium	Major	Functional	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 10:15:48.251	General	t
97266b04-9cf3-427b-a077-2b27258f1aff	auth	authentication	Authentication	Medium	Major	Functional	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-05 15:40:01.057	API Tests	t
2559f1a3-f5f0-4963-aefa-ed6a67c23cd2	as	as	auth	Medium	Major	Functional	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:37:25.747	Login Tests	t
\.


--
-- Data for Name: TestCaseVersion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestCaseVersion" (id, "testCaseId", version, "changeLog", snapshot, "createdAt") FROM stdin;
28dbad2a-3c63-458e-89dd-029e414cc8f8	79818a20-00bc-435f-b4e5-322eee831864	1	Test case updated	{"id": "79818a20-00bc-435f-b4e5-322eee831864", "tags": [], "type": "\\"Ware", "steps": [], "title": "97", "module": "CeD220bdAaCfaDf", "status": " Burns and Oneal\\"", "suiteId": "1c3df506-f111-4725-a57a-93985fa62099", "version": 1, "priority": "Lynn", "severity": "Atkinson", "testData": null, "createdAt": "2026-02-17T11:16:39.353Z", "isDeleted": false, "updatedAt": "2026-02-17T13:48:49.159Z", "testCaseId": "TC-2026-00097", "createdById": "f682f61d-6909-4ae9-aa01-3ee808f057a6", "description": "", "environment": null, "cleanupSteps": null, "preconditions": null, "postconditions": null, "assignedTesterId": null}	2026-02-18 16:13:42.412
66834071-cc90-4820-bc24-f3086471456f	d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44	1	Test case updated	{"id": "d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44", "tags": [], "type": "\\"Lee", "steps": [], "title": "94", "module": "54B5B5Fe9F1B6C5", "status": " Lucero and Johnson\\"", "suiteId": null, "version": 1, "priority": "Sherry", "severity": "Young", "testData": null, "createdAt": "2026-02-17T11:16:39.339Z", "isDeleted": false, "updatedAt": "2026-02-17T11:16:39.339Z", "testCaseId": "TC-2026-00094", "createdById": "f682f61d-6909-4ae9-aa01-3ee808f057a6", "description": "", "environment": null, "cleanupSteps": null, "preconditions": null, "postconditions": null, "assignedTesterId": null}	2026-02-19 11:15:12.521
a4e64e9f-692a-4ce1-807a-2e752f24297e	d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44	2	Test case updated	{"id": "d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44", "tags": [], "type": "Smoke", "steps": [{"id": "cbc3353b-2e60-408b-955d-9f7fb2f7c55d", "action": "a", "expected": "d", "testData": "v", "stepNumber": 1, "testCaseId": "d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44"}], "title": "94", "module": "54B5B5Fe9F1B6C5", "status": " Lucero and Johnson\\"", "suiteId": null, "version": 2, "priority": "High", "severity": "Major", "testData": null, "createdAt": "2026-02-17T11:16:39.339Z", "isDeleted": false, "updatedAt": "2026-02-19T11:15:12.547Z", "testCaseId": "TC-2026-00094", "createdById": "f682f61d-6909-4ae9-aa01-3ee808f057a6", "description": "ewrew", "environment": null, "cleanupSteps": null, "preconditions": null, "postconditions": null, "assignedTesterId": null}	2026-02-19 11:15:22.857
5dae9eae-a2c9-49b4-bfce-254bc07dc518	cf26bc27-d288-4f4f-a326-9aed9b54c80d	1	Test case updated	{"id": "cf26bc27-d288-4f4f-a326-9aed9b54c80d", "tags": [], "type": "Decker-Mcknight", "steps": [], "title": "90", "module": "37Ec4B395641c1E", "status": "North Joeburgh", "suiteId": null, "version": 1, "priority": "Lori", "severity": "Flowers", "testData": null, "createdAt": "2026-02-17T11:16:39.316Z", "isDeleted": false, "updatedAt": "2026-02-17T11:16:39.316Z", "testCaseId": "TC-2026-00090", "createdById": "f682f61d-6909-4ae9-aa01-3ee808f057a6", "description": "", "environment": null, "cleanupSteps": null, "preconditions": null, "postconditions": null, "assignedTesterId": null}	2026-02-19 11:16:56.923
c0232e4e-a67f-42db-a46d-29bd5d125686	075f277a-1313-49dc-b306-7ade4d9fbfc9	1	Updated details	{"type": "\\"Le", "steps": [], "title": "100 (Clone)", "module": "2354a0E336A91A1", "status": "Draft", "version": 1, "priority": "High", "severity": "Haynes", "description": ""}	2026-02-19 17:55:25.378
9058c43c-0cee-4b2e-a6bf-b807f7dd08ac	4e84dcaa-e150-4250-87b8-5ba3fb645fb8	1	updated	{"type": "Major", "steps": [], "title": "TC-2026-64983", "module": "Untitled Test Case", "status": "Functional", "version": 1, "priority": "General", "severity": "Medium", "description": ""}	2026-02-20 12:39:02.771
5856a298-786b-414e-83ad-5033ceceba49	4e84dcaa-e150-4250-87b8-5ba3fb645fb8	2	updated	{"type": "Major", "steps": [{"id": "a9ddc48a-a2a5-4d36-8b2f-0c4fee0b7eea", "action": "a", "expected": "c", "testData": "b", "stepNumber": 1, "testCaseId": "4e84dcaa-e150-4250-87b8-5ba3fb645fb8"}], "title": "TC-2026-64983", "module": "Untitled Test Case", "status": "Functional", "version": 2, "priority": "General", "severity": "Medium", "description": "xdf"}	2026-02-20 12:40:09.941
174d808b-a187-40d5-a2a4-563c6ddd0d7c	4e84dcaa-e150-4250-87b8-5ba3fb645fb8	3	updated	{"type": "Major", "steps": [{"id": "8d113b5a-9a06-4cc3-bf8d-d9cede316ece", "action": "a", "expected": "c", "testData": "b", "stepNumber": 1, "testCaseId": "4e84dcaa-e150-4250-87b8-5ba3fb645fb8"}], "title": "TC-2026-64983", "module": "Untitled Test Case", "status": "Functional", "version": 3, "priority": "General", "severity": "Medium", "description": "xdf"}	2026-02-20 12:40:45.024
e82cd6ce-2642-46a8-aee3-24a61b81035a	0d68a8a4-d84a-4509-aa51-78adf6f59bc5	1	update	{"type": "Major", "steps": [], "title": "TC-2026-27204", "module": "Untitled Test Case", "status": "Functional", "version": 1, "priority": "General", "severity": "Medium", "description": ""}	2026-02-20 18:17:40.052
2ed77726-6658-4d60-8950-e62676925ca3	811d6be1-ce4d-49ab-94d1-d42851cf64c9	1	gvhs	{"type": "Haynes", "steps": [], "title": "TC-2026-27200", "module": "100", "status": "\\"Le", "version": 1, "priority": "2354a0E336A91A1", "severity": "Clarence", "description": ""}	2026-02-20 18:18:42.808
9c0e64b3-80e1-435e-9ab3-7a9a255d1394	2feb7741-682d-4592-bf05-e2e9d1387b4f	1	svdha	{"type": "\\"Le", "steps": [], "title": "100 (Clone)", "module": "2354a0E336A91A1", "status": "Draft", "version": 1, "priority": "Clarence", "severity": "Haynes", "description": ""}	2026-02-20 18:44:27.753
9132451d-30ed-4bc9-823f-7b4afd87ed69	19dcc8bf-568b-45e4-b264-19390a039665	1	change status	{"type": "Regression", "steps": [{"id": "d2963f33-fa5d-43a4-ac02-fb9a54f443ce", "action": "a", "expected": "c", "testData": "b", "stepNumber": 1, "testCaseId": "19dcc8bf-568b-45e4-b264-19390a039665"}], "title": "Login verification", "module": "Auth", "status": "Draft", "version": 1, "priority": "High", "severity": "Critical", "description": "login details"}	2026-02-27 12:58:53.944
4fe32305-d30a-4b74-8dea-67c23275361c	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	1	status change	{"type": "Functional", "steps": [{"id": "239eca74-1aec-45cb-b3fb-39049f680fc7", "action": "a", "expected": "c", "testData": "b", "stepNumber": 1, "testCaseId": "3ac589cf-311f-4c93-b4c1-a57ab9b5503e"}], "title": "Sprint", "module": "Autg", "status": "Draft", "version": 1, "priority": "Medium", "severity": "Major", "description": "cycle"}	2026-03-01 06:34:44.868
9aef7e43-1604-4c62-8733-ee508e6ff1e8	b05aff7b-8cac-483f-b5c0-7173285a9d93	1	Status changed	{"type": "Functional", "steps": [{"id": "c146f1a9-8d78-40df-86e8-cf6f12e62211", "action": "a", "expected": "a", "testData": "a", "stepNumber": 1, "testCaseId": "b05aff7b-8cac-483f-b5c0-7173285a9d93"}], "title": "asaaa", "module": "Authentication", "status": "Draft", "version": 1, "priority": "Medium", "severity": "Major", "description": "a"}	2026-03-05 10:15:13.305
afb7de5d-81b4-4e7d-be2c-084fd34faff8	b05aff7b-8cac-483f-b5c0-7173285a9d93	2	Status changed	{"type": "Functional", "steps": [{"id": "a223054c-8abf-4ab2-a6b2-fd75f6b626dd", "action": "a", "expected": "a", "testData": "a", "stepNumber": 1, "testCaseId": "b05aff7b-8cac-483f-b5c0-7173285a9d93"}], "title": "asaaa", "module": "Authentication", "status": "Approved", "version": 2, "priority": "Medium", "severity": "Major", "description": "a"}	2026-03-05 15:39:32.906
1dae1696-e840-4b31-a267-4db680c6f026	41ce5fe0-3023-43fa-97d9-f9b6a1fdea09	1	changed	{"type": "Functional", "steps": [{"id": "a7de76ef-f1a4-4409-bbcf-79052d0ccba4", "action": "", "expected": "", "testData": "", "stepNumber": 1, "testCaseId": "41ce5fe0-3023-43fa-97d9-f9b6a1fdea09"}], "title": "", "module": "", "status": "Draft", "version": 1, "priority": "Medium", "severity": "Major", "description": ""}	2026-03-05 18:37:08.381
a789b9e7-aa65-47ad-9d7b-4046a149c83b	a5a0040a-73be-46cd-afe1-259af0ff9d92	1	changed	{"type": "Functional", "steps": [{"id": "e88359bb-0adc-4107-9b49-99bae743b04c", "action": "1", "expected": "3", "testData": "2", "stepNumber": 1, "testCaseId": "a5a0040a-73be-46cd-afe1-259af0ff9d92"}], "title": "log", "module": "Authentication", "status": "Draft", "version": 1, "priority": "Medium", "severity": "Major", "description": "log"}	2026-03-05 18:54:58.283
\.


--
-- Data for Name: TestExecution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestExecution" (id, "testCaseId", "executedById", "startedAt", "completedAt", status, "testRunId") FROM stdin;
dea9e8ff-f26f-466b-95f3-2b9ca276ad75	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-24 12:46:38.24	\N	InProgress	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
92515896-2629-4945-9ff1-ac884f1ef39d	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 15:14:09.633	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
f5b4a2f7-b110-4217-87ff-fefd62d5b530	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-24 17:09:54.942	\N	InProgress	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
4df3b289-a82b-4d18-ba51-98ca5c326c8f	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 15:15:01.122	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
84cc42d5-0bd1-4a0c-8b8c-60aa2fe9f089	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-27 13:05:49.481	2026-02-27 13:06:03.355	Passed	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
efebda15-0c63-4f96-9102-a67a02c4311f	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 15:16:56.578	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
8356f9de-11cf-4a50-9e6c-ed36b97faf91	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-27 14:07:10.412	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
07aeafe1-4511-41bb-858e-25753e7e3b80	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 15:23:45.758	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
2eca9ff2-004d-45ec-990b-5274588e8f44	1045360c-a11d-43a4-b1c7-d31e4a78a654	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 21:36:49.625	\N	InProgress	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05
2031210e-5279-4a43-9cab-b9c0d7295dc8	7ffba524-498d-4e2c-ac34-509dd5344bc3	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:07:17.329	2026-03-01 10:07:28.974	Passed	f74d8837-978b-4374-802c-78c40015ee7c
d7304409-44dd-4483-8fa6-6019d08413df	bee7080b-6c79-4d52-b4ee-978fdad9a767	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:16:50.211	2026-03-01 10:17:07.17	Passed	f74d8837-978b-4374-802c-78c40015ee7c
02b9aaea-5bbd-49aa-8543-79d25a25f90d	bbe692f7-3d6f-4906-aa32-5c9ef78040da	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:28:52.272	2026-03-01 10:29:01.423	Passed	ddb2e85b-09a0-4206-942e-4e55478e7af4
5efdf09d-c4b1-4f7e-bbb3-6a46de5c3f90	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:29:34.651	2026-03-01 10:29:43.159	Passed	ddb2e85b-09a0-4206-942e-4e55478e7af4
35f6c9c5-107f-4c73-a897-9078d40cd824	7ffba524-498d-4e2c-ac34-509dd5344bc3	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:34:38.686	2026-03-01 10:34:46.452	Passed	860ac55c-f31d-4cca-ba03-6d0d7c4e184e
a3be36ef-c2d4-4179-a385-bdc44cad0e1c	bee7080b-6c79-4d52-b4ee-978fdad9a767	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:38:30.306	2026-03-01 10:38:39.879	Passed	860ac55c-f31d-4cca-ba03-6d0d7c4e184e
be950855-e1e1-4cbb-8885-6139dbb93bba	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:41:31.438	2026-03-01 10:41:39.165	Passed	860ac55c-f31d-4cca-ba03-6d0d7c4e184e
6773c315-373d-4232-a30a-b3bf8c902515	735dd1be-c143-4d82-aaa7-1825f2f1d596	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:44:18.346	\N	InProgress	f74d8837-978b-4374-802c-78c40015ee7c
7f357162-ea2f-4597-9717-85d76a4f77be	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:44:38.552	2026-03-01 10:44:49.207	Failed	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
93d12b56-f9ae-46d0-ba43-e6aab94e7220	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:45:10.949	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
3ce6156e-4a66-4cd6-98e1-60b9205fc000	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:50:19.878	2026-03-01 10:50:28.654	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
ccba03c2-062f-4c59-b6f4-72f43d417a55	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 10:59:08.627	\N	InProgress	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
ad6c4215-7a28-47eb-afca-c2d6ceeb6f79	1045360c-a11d-43a4-b1c7-d31e4a78a654	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 11:03:12.183	2026-03-01 11:03:20.467	Passed	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05
a2b5c634-d1cc-4255-b0bf-958fa7a4a626	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 11:45:46.622	2026-03-02 11:46:07.141	Failed	716b53a5-cb54-4b01-9e50-5b99aec2f0b5
1cba58b8-18d6-4ada-8aed-38be9d142a19	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 11:47:18.45	\N	InProgress	716b53a5-cb54-4b01-9e50-5b99aec2f0b5
23fdf5a5-955e-4037-803b-dfb49b63c778	bbe692f7-3d6f-4906-aa32-5c9ef78040da	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 11:53:56.182	2026-03-02 11:54:24.152	Passed	716b53a5-cb54-4b01-9e50-5b99aec2f0b5
50bedfca-cb14-4aee-b2bb-d016b685dc9f	bbe692f7-3d6f-4906-aa32-5c9ef78040da	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 11:55:30.435	\N	InProgress	716b53a5-cb54-4b01-9e50-5b99aec2f0b5
9ac820b3-ac49-48e5-a926-d99d95d0ea67	bbe692f7-3d6f-4906-aa32-5c9ef78040da	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 11:56:14.698	\N	InProgress	716b53a5-cb54-4b01-9e50-5b99aec2f0b5
a9fd56e6-89ad-42cc-b6a3-a14d3a549817	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-03 03:29:47.764	\N	InProgress	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
53562c9a-fba1-46dd-aec5-4acbc83f99ac	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-03 03:35:01.72	\N	InProgress	78da32c4-27d7-4d66-916b-7d4a85ce5d92
d7b34fde-15ab-4263-81ae-77ac22cabca9	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-03 06:16:42.196	\N	InProgress	78da32c4-27d7-4d66-916b-7d4a85ce5d92
69308ebe-8b1a-4ed6-827f-3a0b0f3ab15e	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 19:16:31.135	2026-03-05 19:16:39.993	Passed	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
71581ab8-a62f-4cfb-94a4-17c4cf9536e1	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:23:10.937	2026-02-22 15:23:20.097	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
26f1a1a2-fed6-4990-ad92-0b580b1e5a2f	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:23:26.438	2026-02-22 15:23:37.474	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
083bdddc-c328-4f70-8aff-cb5cfb4353d6	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:32:13.628	2026-02-22 15:32:23.223	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
60deffb2-0daa-41d6-8952-d75e2f92aa05	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:32:33.093	2026-02-22 15:32:41.912	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
daf65465-fce8-49d1-ba21-92eeeb1ccc4f	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:37:20.508	2026-02-22 15:37:29.412	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
61ee3681-7962-45e3-a982-3696cb7bfded	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:37:35.532	2026-02-22 15:37:43.873	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
6bf88419-bbb5-4119-8771-801727e54d0b	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:45:39.097	2026-02-22 15:45:52.144	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
447a438f-a53b-4954-a816-37dd45e56ddb	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:45:59.82	2026-02-22 15:46:10.256	Passed	8807a216-bb2b-47de-bda6-b762d038fe0e
da664ba8-710c-4b95-91a8-6774c7c79a92	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 15:56:07.032	2026-02-22 15:56:15.795	Passed	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
547ae5ee-c5af-48f3-832b-6abf88e591f5	2feb7741-682d-4592-bf05-e2e9d1387b4f	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:11:16.823	2026-02-22 16:11:25.416	Passed	78da32c4-27d7-4d66-916b-7d4a85ce5d92
1f6314b4-4458-442f-9a78-4d323973f105	811d6be1-ce4d-49ab-94d1-d42851cf64c9	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:35:06.258	2026-02-22 16:35:15.521	Passed	78da32c4-27d7-4d66-916b-7d4a85ce5d92
5f843fdc-c253-4663-a435-efed1805e1ef	811d6be1-ce4d-49ab-94d1-d42851cf64c9	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:35:42.614	2026-02-22 16:35:50.465	Passed	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
49b82114-b3ad-429b-b917-66c722972f16	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:38:18.821	2026-02-22 16:38:26.291	Failed	78da32c4-27d7-4d66-916b-7d4a85ce5d92
7c5d9847-9dd5-461c-8027-d2840de5e3aa	0d68a8a4-d84a-4509-aa51-78adf6f59bc5	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:43:02.732	2026-02-22 16:43:24.783	Passed	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
e523b583-18ce-4002-81c2-38da6993b23c	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 16:43:38.282	2026-02-22 16:43:46.436	Failed	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
1af1bbf1-ebdc-4015-88e2-586195bcc4af	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 20:08:10.391	\N	InProgress	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
50ed9a3a-ce24-4722-b1c7-5cc0a0e11cb0	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 20:10:37.849	\N	InProgress	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
8adfcce8-2ba1-47c7-84b1-25efb4567ecc	79818a20-00bc-435f-b4e5-322eee831864	e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	2026-02-22 20:11:36.573	\N	InProgress	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
f34f05d5-b352-496f-8a66-4293fcafa003	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-22 20:33:04.318	\N	InProgress	6e9e3b3e-ceb7-4230-bbff-7ba44747a032
682cb52c-b8ba-4049-8cb5-ff1281dcd4fe	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 12:43:11.985	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
b0924cad-783f-4330-9808-a377853f9582	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 13:04:27.842	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
2fabf708-9fec-40da-a857-44bfcfc938d4	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 13:35:04.309	\N	InProgress	8807a216-bb2b-47de-bda6-b762d038fe0e
3215df92-e2b3-4941-b387-7525935b9e78	79818a20-00bc-435f-b4e5-322eee831864	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 14:14:51.592	\N	InProgress	ae75aeb8-a0ef-4848-881d-ff96f9df4a70
\.


--
-- Data for Name: TestRun; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestRun" (id, name, description, "startDate", "endDate", status, "createdAt", "projectId", "milestoneId") FROM stdin;
ae75aeb8-a0ef-4848-881d-ff96f9df4a70	login	login details	2026-02-06 00:00:00	2026-02-09 00:00:00	Planned	2026-02-21 17:41:28.028	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
78da32c4-27d7-4d66-916b-7d4a85ce5d92	Auth	authentication	2026-02-21 00:00:00	2026-02-25 00:00:00	Planned	2026-02-21 17:33:56.176	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
6e9e3b3e-ceb7-4230-bbff-7ba44747a032	Register	registration	2026-02-24 00:00:00	2026-02-27 00:00:00	Planned	2026-02-22 16:42:43.516	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
d532a2ca-9fbc-44b5-a56d-204b0ec2f606	authentication Execution	Execution of suite: authentication	2026-02-23 12:36:32.434	2026-02-24 12:36:32.434	InProgress	2026-02-23 12:36:32.443	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	Sprint	sprint cycle	2026-03-17 00:00:00	2026-03-17 00:00:00	Planned	2026-02-28 21:35:45.744	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
f74d8837-978b-4374-802c-78c40015ee7c	Sprint Regression	sprinting	2026-03-13 00:00:00	2026-03-18 00:00:00	Planned	2026-03-01 09:58:43.247	5a372245-d15d-4439-aeaa-fde1eb24e9b4	0021973e-1102-42e3-a4a8-4aa43b39e28d
ddb2e85b-09a0-4206-942e-4e55478e7af4	Sample run	sample	2026-03-10 00:00:00	2026-03-12 00:00:00	Planned	2026-03-01 10:28:23.674	5a372245-d15d-4439-aeaa-fde1eb24e9b4	0021973e-1102-42e3-a4a8-4aa43b39e28d
860ac55c-f31d-4cca-ba03-6d0d7c4e184e	Sample2	smaple2	2026-03-04 00:00:00	2026-03-04 00:00:00	Planned	2026-03-01 10:34:26.61	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
716b53a5-cb54-4b01-9e50-5b99aec2f0b5	Sprint	sprint	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-02 11:41:04.256	5a372245-d15d-4439-aeaa-fde1eb24e9b4	0021973e-1102-42e3-a4a8-4aa43b39e28d
8807a216-bb2b-47de-bda6-b762d038fe0e	regression	details	2026-02-04 00:00:00	2026-02-12 00:00:00	Planned	2026-02-21 17:38:37.002	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
badcd8b6-b726-4732-be99-4849a4498451	Smoke2	smoking	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-03 10:41:57.64	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
034cfb13-9c34-4231-b757-2be3fa94c50a	Smoke2	smoking	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-03 10:42:14.738	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
43533a98-f78d-4e49-aad7-cd070c9f9dd5	Smoke2	smoking	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-03 10:42:26.482	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
2e86ec61-a20f-4402-98a0-1c6f8e4529f7	Smoke2	smoking	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-03 10:42:37.57	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
0bea87ab-0332-44fc-80a0-a1248d9dffaa	Smoke2	smoking	2026-03-03 00:00:00	2026-03-11 00:00:00	Planned	2026-03-03 10:43:05.707	5a372245-d15d-4439-aeaa-fde1eb24e9b4	f719529a-b556-422f-abe5-0a3f7b974aae
dc9be45b-1276-4720-8f15-cfc704ece935	a	a	2026-03-03 00:00:00	2026-03-12 00:00:00	Planned	2026-03-03 10:45:25.253	5a372245-d15d-4439-aeaa-fde1eb24e9b4	\N
\.


--
-- Data for Name: TestRunAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestRunAssignment" (id, "testRunId", "testerId") FROM stdin;
b9ceecf4-6771-42b7-ab44-58ffeebb30e5	ae75aeb8-a0ef-4848-881d-ff96f9df4a70	f682f61d-6909-4ae9-aa01-3ee808f057a6
3f72a944-44b2-44cc-9700-30c56a383c2c	78da32c4-27d7-4d66-916b-7d4a85ce5d92	f682f61d-6909-4ae9-aa01-3ee808f057a6
a9042cf6-5ca3-41b8-a9d4-67118cbb109a	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	f682f61d-6909-4ae9-aa01-3ee808f057a6
1ff89f18-2b00-4431-9229-a891f570f050	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	f682f61d-6909-4ae9-aa01-3ee808f057a6
9df08b63-8d93-483a-8b7e-6a6bbf7ea02e	f74d8837-978b-4374-802c-78c40015ee7c	f682f61d-6909-4ae9-aa01-3ee808f057a6
54573e04-ad6a-4936-bbf4-0e0378b571be	f74d8837-978b-4374-802c-78c40015ee7c	7bdfe490-d994-402c-bfa4-905fe928cb9e
6dd04d81-a68c-48cc-9ad4-7bd4f318291f	ddb2e85b-09a0-4206-942e-4e55478e7af4	f682f61d-6909-4ae9-aa01-3ee808f057a6
d6db6d70-e5d4-4594-b261-20513c079a64	860ac55c-f31d-4cca-ba03-6d0d7c4e184e	f682f61d-6909-4ae9-aa01-3ee808f057a6
d0752be1-8eab-49cd-b68e-ef473fcaa6f9	716b53a5-cb54-4b01-9e50-5b99aec2f0b5	b6704d5d-dc39-4c55-a262-89b5cfdc644c
6d83574a-7482-4a43-97a0-79fe9dcd01f0	8807a216-bb2b-47de-bda6-b762d038fe0e	f682f61d-6909-4ae9-aa01-3ee808f057a6
c4e0dc50-7e07-4cf5-ad7d-01ad70997be7	8807a216-bb2b-47de-bda6-b762d038fe0e	ad873da6-1099-4e10-b50c-04693884e2c4
1c76d5bc-958a-4a5a-a4d8-05916b4554f4	badcd8b6-b726-4732-be99-4849a4498451	f682f61d-6909-4ae9-aa01-3ee808f057a6
01ee1760-2fc6-4a3e-a569-c7ab57c21186	badcd8b6-b726-4732-be99-4849a4498451	7bdfe490-d994-402c-bfa4-905fe928cb9e
4379fb2b-5aaa-4038-9463-02fec12b8590	034cfb13-9c34-4231-b757-2be3fa94c50a	f682f61d-6909-4ae9-aa01-3ee808f057a6
2df03e9b-7a5b-4160-95a5-56175f65d55c	034cfb13-9c34-4231-b757-2be3fa94c50a	7bdfe490-d994-402c-bfa4-905fe928cb9e
ece9e143-6fb6-4192-9853-d6787ff690d4	43533a98-f78d-4e49-aad7-cd070c9f9dd5	f682f61d-6909-4ae9-aa01-3ee808f057a6
eb385901-25f5-424e-b0cc-98c7de279c10	2e86ec61-a20f-4402-98a0-1c6f8e4529f7	f682f61d-6909-4ae9-aa01-3ee808f057a6
0cfb9178-9d50-4080-b697-08ad46cf7fbd	0bea87ab-0332-44fc-80a0-a1248d9dffaa	f682f61d-6909-4ae9-aa01-3ee808f057a6
154ac9e4-3b46-43c0-84d9-4289285c7d01	dc9be45b-1276-4720-8f15-cfc704ece935	f682f61d-6909-4ae9-aa01-3ee808f057a6
e40f0a11-66f0-407d-b970-84214c24989b	dc9be45b-1276-4720-8f15-cfc704ece935	c8e80221-f3ce-45f8-b5e2-303146417d07
\.


--
-- Data for Name: TestRunCase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestRunCase" (id, "testRunId", "testCaseId") FROM stdin;
ef7c8668-8d45-4493-ab81-9d0ff9bed923	ae75aeb8-a0ef-4848-881d-ff96f9df4a70	79818a20-00bc-435f-b4e5-322eee831864
c541ee3a-e55e-467e-8c42-5cc8b3f8b5c2	ae75aeb8-a0ef-4848-881d-ff96f9df4a70	811d6be1-ce4d-49ab-94d1-d42851cf64c9
766e07b5-b13b-43f6-8828-9e3eb85994e7	78da32c4-27d7-4d66-916b-7d4a85ce5d92	2feb7741-682d-4592-bf05-e2e9d1387b4f
42884619-5bc5-4b4c-a4c4-3e745f033560	78da32c4-27d7-4d66-916b-7d4a85ce5d92	811d6be1-ce4d-49ab-94d1-d42851cf64c9
3851eaff-1b94-45a2-82d0-a300b42a4609	78da32c4-27d7-4d66-916b-7d4a85ce5d92	79818a20-00bc-435f-b4e5-322eee831864
dd4d12d0-e78a-41b5-91f9-35ac1e09f799	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	0d68a8a4-d84a-4509-aa51-78adf6f59bc5
31fe3932-4551-42d5-8cd4-470e26240dad	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	79818a20-00bc-435f-b4e5-322eee831864
d385b322-b034-4759-9bba-55a7cf1703a2	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	811d6be1-ce4d-49ab-94d1-d42851cf64c9
7d7bdb9d-f538-43de-a700-5a13e5c612c8	6e9e3b3e-ceb7-4230-bbff-7ba44747a032	2feb7741-682d-4592-bf05-e2e9d1387b4f
d0b045dc-5aa3-422c-baa6-98717340b112	d532a2ca-9fbc-44b5-a56d-204b0ec2f606	6527b640-5359-4a3c-b08f-0f0e571a8c80
ae9c98a7-07e0-425c-8aea-09eb770a3deb	d532a2ca-9fbc-44b5-a56d-204b0ec2f606	bcf38a75-431c-489a-bd99-fdb0b3c825c9
1b666e8e-13b6-403c-9a55-eff5320c1f5f	d532a2ca-9fbc-44b5-a56d-204b0ec2f606	c19357f0-1963-4372-b4f2-3dfd0d037374
1979352a-22ad-47d7-bd57-7a59ec02c9cf	d532a2ca-9fbc-44b5-a56d-204b0ec2f606	9c03d5ac-a05f-4483-bd6b-41a3026bb980
7da0cfae-0662-4373-a8ff-b479822e43d3	d532a2ca-9fbc-44b5-a56d-204b0ec2f606	9021021d-9e58-4cb4-aa7b-0e437cb810d8
39cfc9ab-ea1f-473e-ac42-0796d6463ccb	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	1045360c-a11d-43a4-b1c7-d31e4a78a654
d51ee5ac-f505-4492-bea9-20b0b241454e	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	9b12273f-19a9-40af-bd63-f4bc45959d5d
c214897f-5887-47ab-ba41-815b6404ba9b	3ee8f7ce-449c-4aad-84fc-b4e2fc879d05	19dcc8bf-568b-45e4-b264-19390a039665
1ec4dc5d-33ce-4703-bece-fe0a4ce9ec9e	f74d8837-978b-4374-802c-78c40015ee7c	7ffba524-498d-4e2c-ac34-509dd5344bc3
74e16a2d-8a5e-4257-9b88-9c19a5bf3e39	f74d8837-978b-4374-802c-78c40015ee7c	bee7080b-6c79-4d52-b4ee-978fdad9a767
dd49d9df-3699-411d-9ce4-b009394a6934	f74d8837-978b-4374-802c-78c40015ee7c	735dd1be-c143-4d82-aaa7-1825f2f1d596
734fd536-de8f-49ab-8064-ba8f9ef3e432	ddb2e85b-09a0-4206-942e-4e55478e7af4	bbe692f7-3d6f-4906-aa32-5c9ef78040da
a7d60fa7-c152-4087-8dd0-f10cf45aa9bf	ddb2e85b-09a0-4206-942e-4e55478e7af4	3ac589cf-311f-4c93-b4c1-a57ab9b5503e
f39e2f4b-0b96-4cc4-be03-83580aacedc7	860ac55c-f31d-4cca-ba03-6d0d7c4e184e	7ffba524-498d-4e2c-ac34-509dd5344bc3
592da25f-48b6-41f8-9e62-1bff890e85a8	860ac55c-f31d-4cca-ba03-6d0d7c4e184e	bee7080b-6c79-4d52-b4ee-978fdad9a767
ac776e3c-4dd2-48d5-b175-28e5f11290e7	860ac55c-f31d-4cca-ba03-6d0d7c4e184e	3ac589cf-311f-4c93-b4c1-a57ab9b5503e
f107c160-fa8a-4d0f-98be-f81b60ccc743	716b53a5-cb54-4b01-9e50-5b99aec2f0b5	3ac589cf-311f-4c93-b4c1-a57ab9b5503e
6a50c1c9-dd6f-422e-a771-34eeb3bd3c7b	716b53a5-cb54-4b01-9e50-5b99aec2f0b5	bbe692f7-3d6f-4906-aa32-5c9ef78040da
d6263f1d-f53e-4b6d-a5e4-0547b688e5dc	716b53a5-cb54-4b01-9e50-5b99aec2f0b5	bee7080b-6c79-4d52-b4ee-978fdad9a767
89966010-5cb3-46f4-8a0a-7e290c5813a1	8807a216-bb2b-47de-bda6-b762d038fe0e	79818a20-00bc-435f-b4e5-322eee831864
eb1394ee-bd33-485d-a8e8-0dd0e763d587	8807a216-bb2b-47de-bda6-b762d038fe0e	2feb7741-682d-4592-bf05-e2e9d1387b4f
1501b18f-0b7c-48cd-bbdd-f33a3553b13e	badcd8b6-b726-4732-be99-4849a4498451	1045360c-a11d-43a4-b1c7-d31e4a78a654
bddf7ff0-c10f-4ee2-a07d-b6e0df076b19	badcd8b6-b726-4732-be99-4849a4498451	9b12273f-19a9-40af-bd63-f4bc45959d5d
5e5c0697-9725-4a6c-b775-a57368650666	badcd8b6-b726-4732-be99-4849a4498451	19dcc8bf-568b-45e4-b264-19390a039665
9545fcf1-02ec-4ff3-98d6-6f46d90f161d	badcd8b6-b726-4732-be99-4849a4498451	95ebeff1-8c99-4d5a-a409-6c62f79ed531
2197e99f-0e91-4e01-9fde-091a666fe7dd	034cfb13-9c34-4231-b757-2be3fa94c50a	1045360c-a11d-43a4-b1c7-d31e4a78a654
989c8e7b-eb68-4319-ac35-5f0ab43d1158	034cfb13-9c34-4231-b757-2be3fa94c50a	9b12273f-19a9-40af-bd63-f4bc45959d5d
d0f6f4a8-e7ff-43a0-8cb3-f1907701c153	034cfb13-9c34-4231-b757-2be3fa94c50a	19dcc8bf-568b-45e4-b264-19390a039665
b9cb8905-2626-4030-b3f1-f76f21fff582	034cfb13-9c34-4231-b757-2be3fa94c50a	95ebeff1-8c99-4d5a-a409-6c62f79ed531
07765de7-04a1-464a-900e-93d06a7b7dfa	43533a98-f78d-4e49-aad7-cd070c9f9dd5	1045360c-a11d-43a4-b1c7-d31e4a78a654
9ee9b47d-14dd-464a-99b7-bb15f8224bfa	43533a98-f78d-4e49-aad7-cd070c9f9dd5	9b12273f-19a9-40af-bd63-f4bc45959d5d
9ac4648a-5d6d-46b6-a417-d12f316666b0	43533a98-f78d-4e49-aad7-cd070c9f9dd5	19dcc8bf-568b-45e4-b264-19390a039665
03fdbff4-714d-4231-b9e7-e5266af97371	43533a98-f78d-4e49-aad7-cd070c9f9dd5	95ebeff1-8c99-4d5a-a409-6c62f79ed531
3e014860-524e-4096-a988-39cbe60d0ef1	2e86ec61-a20f-4402-98a0-1c6f8e4529f7	1045360c-a11d-43a4-b1c7-d31e4a78a654
cfd75f73-7a68-4970-a44a-c03b27e26419	2e86ec61-a20f-4402-98a0-1c6f8e4529f7	9b12273f-19a9-40af-bd63-f4bc45959d5d
5372bb15-0527-4825-a13e-301e8af80963	2e86ec61-a20f-4402-98a0-1c6f8e4529f7	19dcc8bf-568b-45e4-b264-19390a039665
5bd8db91-667d-401e-9b98-f8676fc606b5	2e86ec61-a20f-4402-98a0-1c6f8e4529f7	95ebeff1-8c99-4d5a-a409-6c62f79ed531
a1236628-70a7-4b83-86a3-f9cc0e967ef3	0bea87ab-0332-44fc-80a0-a1248d9dffaa	1045360c-a11d-43a4-b1c7-d31e4a78a654
a7c67cba-7e28-442e-934a-7901a47dbd58	0bea87ab-0332-44fc-80a0-a1248d9dffaa	9b12273f-19a9-40af-bd63-f4bc45959d5d
d696b4ff-f92c-4ac4-9ecb-a6457fd0a522	0bea87ab-0332-44fc-80a0-a1248d9dffaa	19dcc8bf-568b-45e4-b264-19390a039665
860aff06-7b49-411a-8b97-aecc2ef4c49a	0bea87ab-0332-44fc-80a0-a1248d9dffaa	95ebeff1-8c99-4d5a-a409-6c62f79ed531
eac23bf2-7db1-414a-891c-9e1023baceb0	dc9be45b-1276-4720-8f15-cfc704ece935	66da6fce-9126-4fa1-99d7-734a63bc1065
d60c5581-533b-410f-bb2c-91db4c277bec	dc9be45b-1276-4720-8f15-cfc704ece935	7749ac3d-0149-4e68-9d0a-92dedcd24ea5
edc03a54-ed77-49e1-856d-049840268c1e	dc9be45b-1276-4720-8f15-cfc704ece935	9c13caea-73bd-4cb5-98be-39e75367457b
\.


--
-- Data for Name: TestStep; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestStep" (id, "testCaseId", "stepNumber", action, "testData", expected) FROM stdin;
4d9a1606-b10a-415d-a102-9ee5732f3473	79818a20-00bc-435f-b4e5-322eee831864	1	a	b	c
d014f8c7-0a64-4b29-be50-ab88ddf48445	d5fd55d5-19cf-43cd-ac44-fcdaa04b6e44	1	a	v	d
a90770e5-10cc-45fb-aa07-42dd7f152154	cf26bc27-d288-4f4f-a326-9aed9b54c80d	1	a	c	s
a28b8cd7-587c-4b3c-814f-b3428a908fc1	a29127d3-87f4-4640-831d-7b35a25fd116	1	a	b	c
31d2499d-d96b-41a5-a0b4-cafdc74847d8	075f277a-1313-49dc-b306-7ade4d9fbfc9	1	a	b	c
73e594b4-08e8-41db-a21d-8232fd82c539	4e84dcaa-e150-4250-87b8-5ba3fb645fb8	1	a	b	c
13f229a2-2969-4a63-a335-74ea36d795de	0d68a8a4-d84a-4509-aa51-78adf6f59bc5	1	a	b	c
87e3bb0a-ba41-47d1-8b80-450846263afe	0d68a8a4-d84a-4509-aa51-78adf6f59bc5	2	d	e	f
f3a00fcd-7f81-47ab-b267-6b5730c7b449	811d6be1-ce4d-49ab-94d1-d42851cf64c9	1	a1	a2	a3
b2dd2267-7a8e-4ce9-bba0-37dd6ac5d189	2feb7741-682d-4592-bf05-e2e9d1387b4f	1	1	2	3
acbb12d8-4c8d-4132-8362-3f7a136536ec	95ebeff1-8c99-4d5a-a409-6c62f79ed531	1	a1	a2	a3
7fdeef03-7f7b-404f-a255-8d7043ff6fa7	adcfa343-8a05-4bce-8bf4-53f465857b07	1	a	b	c
1ff5f883-1cee-49db-824e-d4952a913ae2	adcfa343-8a05-4bce-8bf4-53f465857b07	2	d	e	f
17e3efdf-5845-48af-81a2-a9cb9727babd	19dcc8bf-568b-45e4-b264-19390a039665	1	a	b	c
2ee39a49-e8fa-4601-9b24-28aa7aa7f180	f25c4eea-dfde-47e5-8786-0dca483753f6	1	a	b	c
579bbd55-4c22-4345-8fce-8dcc163d1eda	1045360c-a11d-43a4-b1c7-d31e4a78a654	1	a	b	c
23ec443e-a154-4008-aa46-4f152d70f8f7	bbe692f7-3d6f-4906-aa32-5c9ef78040da	1	a	c	s
4109de4d-3d83-4d20-a64f-ede4353fa465	3ac589cf-311f-4c93-b4c1-a57ab9b5503e	1	a	b	c
2c2dd3f7-3509-4234-8799-cd9384529748	bee7080b-6c79-4d52-b4ee-978fdad9a767	1	a	b	c
a35873bb-0591-4116-afcd-78e5f5f18f31	7ffba524-498d-4e2c-ac34-509dd5344bc3	1	11	12	13
3020dbca-a6b1-466c-9383-92285dea7ba3	cae068ef-cc9a-44e3-b83c-82842c7ca303	1	a	as	as
d0811b87-8b4e-460f-89ec-1d5a44d51e22	b05aff7b-8cac-483f-b5c0-7173285a9d93	1	a	a1	a2
b0104165-0e76-49a1-8724-761bcee65cc9	f26164d6-cb63-4e67-b16b-16d13fcb88be	1	a1	b1	c1
c9862043-e6e1-4019-8789-da99d42b6117	90ab1fa8-65f4-4ee8-81e0-f647cb4cbb1f	1			
d50de913-a159-409e-87bd-8e677f9919c6	03646605-5b25-47f3-9505-f551b9c773c3	1	a	b	c
aca99f80-40af-475c-9835-7bcd301748d0	0cffd878-f63a-4b94-aa7c-c25dc6da8c2f	1	a1	a2	a3
636c3f15-5002-4738-a868-e034b7a7065f	8eecc2c8-ed72-4627-9f58-dd11ec387dbb	1	a	b	c
f8735c69-21b0-42f7-98a7-e883a9491656	fce9e351-37e1-4c71-a284-0e82a441811e	1	a	c	s
d73294fd-5dbc-4f3c-9301-ab4dff8a16fd	cf1b6a21-baf0-4504-81d0-448ea986b124	1	a	c	s
f5670a53-ec4a-4cb9-88ff-73dc8cabf56d	4df8d841-fa46-4a16-85fd-b459a296c043	1	a	a	a
1258607b-42c6-4a5d-b208-66444ea30d35	41ce5fe0-3023-43fa-97d9-f9b6a1fdea09	1	a	c	s
92cd497e-7a79-42d5-984a-2236d980d655	87b57bda-92e1-4dc5-8efd-2cf40a4838e5	1	1	2	3
8cd080c8-1422-4fd4-abc0-287cb3f34f6c	a5a0040a-73be-46cd-afe1-259af0ff9d92	1	1	2	3
1a9323b0-20a2-494e-b8d8-99107022e6f4	bd27ae58-23ea-4111-903d-64a6d9b529dd	1	1	2	3
a732a96f-7cab-4b96-a1e3-1163b0f1d662	785262e3-0eba-4d85-802b-b3da7c2626a0	1	a	w	q
58a12fab-a9d7-4a0f-95b0-49cf01c97eb4	42165c04-a176-49b8-9ffd-2fef00a0ed09	1	a	b	c
\.


--
-- Data for Name: TestSuite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestSuite" (id, name, description, "createdById", "createdAt", "isDeleted", "isArchived", module, "parentId", "projectId") FROM stdin;
1c3df506-f111-4725-a57a-93985fa62099	Registration	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 12:59:00.458	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
135f2d1a-4af8-4b3f-bccf-4f7b8dc11bdb	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:29:52.591	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ec2778d3-bb6a-4844-bfec-8dbaeb6e88fe	Smoke	smoking	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 16:07:52.944	f	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ba6dd4a9-971d-40ac-b66a-6f83db6f31ff	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:31:58.596	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6a33adf1-73b0-47d7-9c30-6847228b1b41	login-auth	login credentials	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-05 15:44:20.392	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
84074d50-60e7-4238-8966-1e17baf2b3d6	Sprint3 (Copy) (Copy)	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:31:49.906	t	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c558d8bf-e83b-41dc-9a74-390b98f80677	Sprint3	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-01 06:35:50.938	f	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d17ec32a-427b-4b18-a3ab-eaeb71e0d9b3	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:17:45.003	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b8529055-3cc0-4bb9-a948-5180c2fff88d	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:24:09.878	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fcf37142-78d5-418f-8c97-49029cf5875e	Login (Copy)	credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:10:57.598	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2445e9e9-7135-4e8b-84a6-e89379b2e738	Login (Copy)	credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:25:16.201	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
11f64f07-cff1-4f0e-bb73-8799c998ef45	Authentication2	login	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 11:44:06.028	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6aa924d8-f5b8-484d-8616-454c301593da			f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 11:49:54.049	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8295a511-939f-4ecd-8db3-da626e40931e	Register	registration	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 11:38:38.764	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1fa10faa-f125-4346-a8a7-c9fbcf0d098d	Login details	Login suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 12:59:18.216	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
19aff26b-b43d-4a94-be78-8a59d9a0bb32	Login	credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 11:51:38.321	f	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
fc404c81-9701-4480-a221-f2f5e721596b	authentication (Copy)	Login details	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 17:19:31.246	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1d80fcc4-b8c9-4d0d-854b-4576fdf777b9	Validate	validation	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 12:08:04.384	f	t	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
855f50b5-779e-46b2-990c-9ec8e783228c	Login (Copy)	credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 17:46:23.579	f	t	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e5004a73-8265-4926-aa8c-4f95448885f7	authentication	Login details	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-17 13:29:37.738	f	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
96c2e2b1-cb1a-4175-b926-32647d4ac7fb	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-27 13:01:50.611	f	t	smokes	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5a20e1f4-ab47-4bc8-a68e-beca56c7efda	Smoke	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-23 12:20:13.588	f	t	smokes	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2d9a8d09-1234-43de-aac7-a52492a4fa39	Sprint3 (Copy) (Copy)	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:28:03.871	t	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bef8b432-6809-47b1-a94f-e3fd3814e659	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:32:48.947	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0b1dbf4d-480a-4e80-82d3-ac33f812c6f1	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:33:03.917	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b1201b50-f227-4a61-a9e9-38af0495113e	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:33:52.813	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c9e5f057-11ea-4cad-92cb-ebc405b0fcef	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:38:27.897	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4003d5b6-a0cf-4e51-8e14-6fc5eb9ae2d8	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:39:46.486	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9a06aa63-7045-4de0-baea-43f739a109df	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:39:16.914	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b993c2cd-6f6e-4738-a1b0-867d549942c2	Season (Copy)	season2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:43:42.481	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
62dd5e9b-36d5-4a5e-90af-9331db9af59d	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:54:55.996	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
34473230-a0e4-4896-8ebb-ee1ab03bee96	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:57:32.187	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ed4c7992-d003-4c4f-a64b-5d103ec8ed1f	login-auth (Copy) (Copy)	login credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:02:58.886	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
116923f1-37cc-42fc-9b36-16c647b1fb8b	login-auth (Copy)	login credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:02:34.224	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
dea66b66-63f2-447a-af94-22fd7f9c31e0	Season	season2	b6704d5d-dc39-4c55-a262-89b5cfdc644c	2026-03-02 16:10:11.229	f	t	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
701ec30b-3473-483c-b5c7-7dc517ea80ed	Sprint3 (Copy)	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 16:12:25.945	t	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
66d38518-bfeb-4f63-a136-0f712029a620	auth	gsfs	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-02-28 21:21:08.029	t	f	soft	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
bf882db5-9a16-4668-a791-a4a754918d98	authentication (Copy)	Login details	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:04:09.889	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e15d9744-6204-46c9-ad94-5e8fbb6436f0	authentication (Copy)	Login details	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:04:05.872	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4b6afb56-e5f5-4c25-8817-77162129ef20	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:03:51.762	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a82752fd-b5d0-4494-88aa-91188eb14b3e	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:03:40.902	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
488fa671-588b-468c-a342-31966e7418fe	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:03:30.395	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
028a5877-75ff-4b2f-a454-79b4e2cb1ee9	login-auth (Copy)	login credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:07:39.585	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8e507414-1dc1-4559-a9c9-8560f827e147	Registration (Copy)	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:28:58.775	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
716045b1-adb2-470f-8fac-94a09a16a4a5	login-auth (Copy)	login credentials	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:12:28.125	f	t	Auth1	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5ffb66c1-2c2c-4dff-9ddc-4094e47176d4	Sprint3 (Copy) (Copy)	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:18:17.281	t	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
5fe4defc-a92a-4cf6-be78-348c2d32d724	Sprint3 (Copy) (Copy)	cycle sprint 2	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:13:57.962	t	f	Auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
68af5514-d105-4a23-9e6c-0b2cd602d742	Smoke (Copy)	smoking	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:18:44.05	t	f	Auth	c558d8bf-e83b-41dc-9a74-390b98f80677	5a372245-d15d-4439-aeaa-fde1eb24e9b4
6b45eb61-22e3-424f-9985-8e4ac2738408	Registration (Copy)	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:28:46.333	t	f	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
2f868ad0-d76b-4a8d-a0db-6356f5bce33a	auth (Copy) (Copy)	gsfs	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:28:22.321	t	f	soft	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
ab389d00-e8c6-4f96-9db3-33a32434deb9	auth (Copy) (Copy)	gsfs	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:27:02.51	t	f	soft	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0b96b516-5ae2-457d-a8c1-80813e3dedef	auth (Copy)	gsfs	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:26:25.079	t	f	soft	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
201d7f3c-fc4d-4e90-a163-8f230078fdce	sample (Copy)	smapling	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:35:10.491	t	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a58a88bf-3490-450b-88cb-bba00db0c8ab	sample	smapling	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:35:03.065	t	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4c326b25-0831-4413-9a10-8a3f12f784a7	s2 (Copy)	ss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:37:43.214	t	f	auth	b56b08cd-48df-43a5-b251-287accf84344	5a372245-d15d-4439-aeaa-fde1eb24e9b4
3cfc4f66-75b3-46d1-84a9-352fa483eccb	s2	ss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:37:38.505	t	f	auth	b56b08cd-48df-43a5-b251-287accf84344	5a372245-d15d-4439-aeaa-fde1eb24e9b4
cba22962-2325-4c6a-97ab-d006b100b44f	s1 (Copy)	aq	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:36:59.22	t	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
4052663b-50ee-4541-bff7-219729888fb7	ss (Copy)	sss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:11:58.192	t	f	s	b56b08cd-48df-43a5-b251-287accf84344	5a372245-d15d-4439-aeaa-fde1eb24e9b4
60770767-a19b-4a36-aa50-5ceccf1565a1	ss (Copy)	sss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:11:31.7	t	f	s	b56b08cd-48df-43a5-b251-287accf84344	5a372245-d15d-4439-aeaa-fde1eb24e9b4
0eb44e47-ce3b-46fa-ae21-cddac6602026	s1 (Copy) (Copy)	aq	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:09:50.814	t	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9d82bcec-b416-4dce-a89a-7038307f1a56	ss (Copy)	sss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:11:31.668	t	f	s	b56b08cd-48df-43a5-b251-287accf84344	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b6926d9c-92dc-4c6b-bd02-da7b9a3d2731	s1 (Copy)	aq	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:04:46.433	t	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
338687fb-25a2-4321-9202-61a373d698c9	Registration (Copy)	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:30:15.819	f	t	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
39d1702a-4e98-4542-9903-4981ff9a37e1	sample2	sampling	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:36:05.796	f	f	auth	ec2778d3-bb6a-4844-bfec-8dbaeb6e88fe	5a372245-d15d-4439-aeaa-fde1eb24e9b4
9b8ff434-25c4-4da2-9463-ea25451de8a0	ss	sss	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:05:00.737	f	f	s	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
c14b572f-9207-499c-a674-638df7957046	log	login	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:27:25.801	f	f	auth	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
1502c188-fa27-4fe2-8af4-c0b93b7e66d9	sample (Copy) (Copy)	sampling	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 19:23:49.244	f	f	auth	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
8f066eae-bc06-49a3-96ca-ede0d8e8aaa9	sample (Copy)	sampling	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:12:22.545	f	f	auth	39d1702a-4e98-4542-9903-4981ff9a37e1	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e1ea921f-8c4e-45ea-bfa8-5223f2be1325	Registration (Copy)	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:29:32.642	f	t	\N	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
e80efb5b-3d5b-44c2-af70-ff8da6fc933a	Registration (Copy) (Copy)	Registration suite	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:33:23.133	f	t		\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
d73666b7-2fff-46f5-a93c-7949036f1735	sample4	simple	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:55:29.126	f	f	auth	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
a154f15e-fd3e-4c77-b6bd-25302ffc9669	sample4 copy	simple	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 18:55:50.792	f	f	auth	19aff26b-b43d-4a94-be78-8a59d9a0bb32	5a372245-d15d-4439-aeaa-fde1eb24e9b4
b56b08cd-48df-43a5-b251-287accf84344	s1	aq	f682f61d-6909-4ae9-aa01-3ee808f057a6	2026-03-05 17:36:53.926	f	t	auth2	\N	5a372245-d15d-4439-aeaa-fde1eb24e9b4
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "createdAt", "resetExpiry", "resetToken", "failedAttempts", "isVerified", "lockUntil", "passwordHistory", "refreshToken", "verifyToken", active, "roleId") FROM stdin;
e3843bc6-284e-4cbe-8b1a-50ddcacbb5a6	Yashu	yashu@gmail.com	$2b$10$J/wIhytpjUICOpra.8BcmeufGw2CNU/SKttzLmItntfKa5se1Gv9S	admin	2026-02-20 05:53:56.538	\N	\N	0	t	\N	{$2b$10$J/wIhytpjUICOpra.8BcmeufGw2CNU/SKttzLmItntfKa5se1Gv9S}	\N	\N	t	\N
b6704d5d-dc39-4c55-a262-89b5cfdc644c	Tejaswini	thejashwinilg@gmail.com	$2b$10$lG3wEuV4z/6L4.jfm7BT8epGv9Wp4F/01QMatOZsWor2HG/ku0zHG	tester	2026-03-01 18:01:26.523	2026-03-02 11:21:24.869	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoZWphc2h3aW5pbGdAZ21haWwuY29tIiwiaWF0IjoxNzcyNDQ2ODg0LCJleHAiOjE3NzI0NTA0ODR9.-1qX_KIpgdoJZDqhdr-t3l0NT5-yc_DpFX8h4pNkJRY	0	f	\N	{$2b$10$LpXMB0RhjF5PeGgUxT4zj.wIiA3.yAG5KL9SqdSOUFjD5VUkWUp8m,$2b$10$2Ixa6CFRPIwF137Qo5gcoeYHYWcUadY0SKNLFAGRahcqpMkOt/y/C}	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoZWphc2h3aW5pbGdAZ21haWwuY29tIiwiaWF0IjoxNzcyMzg4MDg2LCJleHAiOjE3NzIzOTE2ODZ9.t5pG1wiZQtGpuB6x-cqr2IFkKcJn5xQE0YVc9sYLoSY	t	\N
dadb6a81-dce0-4a20-b926-bc56405b774f	Anusha	anusha@gmail.com	Anu@123	developer	2026-02-28 11:12:22.682	\N	\N	0	f	\N	\N	\N	\N	f	\N
ad873da6-1099-4e10-b50c-04693884e2c4	Spoorthi	farm2homemini@gmail.com	$2b$10$voPdNLXcGFrscHseixs/2u2f89iDUT/DfxrW.JS9w7KkmOJQehgTG	tester	2026-03-01 18:19:49.335	\N	\N	0	f	\N	{$2b$10$voPdNLXcGFrscHseixs/2u2f89iDUT/DfxrW.JS9w7KkmOJQehgTG}	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhcm0yaG9tZW1pbmlAZ21haWwuY29tIiwiaWF0IjoxNzcyMzg5MTg5LCJleHAiOjE3NzIzOTI3ODl9.LdresLcaoqKI_Yhsv9pA4iyuN0ltzNEdvUzS33zen88	t	\N
406490fc-82c4-44ba-8928-0ac7f1562e77	Theju	tejaswini2004lg@gmail.com	$2b$10$21WAmXVwS0g/m0WXMMYWz.WfSG3LJV0e0Z/AtOgpTQROxiHrnXoEi	tester	2026-03-01 18:26:09.559	\N	\N	0	f	\N	{$2b$10$21WAmXVwS0g/m0WXMMYWz.WfSG3LJV0e0Z/AtOgpTQROxiHrnXoEi}	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlamFzd2luaTIwMDRsZ0BnbWFpbC5jb20iLCJpYXQiOjE3NzIzODk1NjksImV4cCI6MTc3MjM5MzE2OX0.XgLzBaiXd4iPnevfg-MFaLmVOSx8WtU5IhGguPzsdl4	t	\N
e6f35e12-393d-48f0-9993-dd4e75fc3d89	Sinchana	sinchanasin06@gmail.com	$2b$10$n3oJHzm0x5utZ20ncrmFFeIyPFWv0AwrcLHvCE9qME.P9qyXNnwYG	tester	2026-03-01 18:39:21.147	\N	\N	0	f	\N	{$2b$10$n3oJHzm0x5utZ20ncrmFFeIyPFWv0AwrcLHvCE9qME.P9qyXNnwYG}	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpbmNoYW5hc2luMDZAZ21haWwuY29tIiwiaWF0IjoxNzcyMzkwMzYxLCJleHAiOjE3NzIzOTM5NjF9.bBIFxBADLG4WlOuG2X8hwFM_pvlEWLGU4_Vu0VkEJpM	t	\N
c8e80221-f3ce-45f8-b5e2-303146417d07	Tejashwini	tejugowda2610@gmail.com	$2b$10$BUvWC5O6N5Z8GMAB1aTvN.lV0/4paHVf9dj1RoiFk7CFPNNAn0Yxm	tester	2026-03-01 18:12:18.783	\N	\N	0	t	\N	{$2b$10$BUvWC5O6N5Z8GMAB1aTvN.lV0/4paHVf9dj1RoiFk7CFPNNAn0Yxm}	\N	\N	t	\N
403eef28-8359-41ff-b4de-18d83a77b157	Sahana	aimlsolveit@gmail.com	$2b$10$QmXoZ0mM5yd6d3H5ezVar.iwzCgj0EAE9Zprbgqk/hJyJEdzXmGoa	admin	2026-03-01 18:34:23.045	\N	\N	0	t	\N	{$2b$10$QmXoZ0mM5yd6d3H5ezVar.iwzCgj0EAE9Zprbgqk/hJyJEdzXmGoa}	\N	\N	t	\N
7bdfe490-d994-402c-bfa4-905fe928cb9e	ankitha	ank@gmail.com	Ank@123	tester	2026-02-25 19:07:28.638	\N	\N	0	f	\N	\N	\N	\N	t	\N
5d7dceac-43a2-472f-8d39-212fbb369ba6	Spoorthi	spoo@gmail.com	Spoo@123	developer	2026-02-25 18:37:03.275	\N	\N	0	f	\N	\N	\N	\N	t	\N
34124ee8-0242-4699-88e5-f6c7d5c95550	Theju	theju@gmail.com	Teju@123	developer	2026-02-25 18:37:27.597	\N	\N	0	f	\N	\N	\N	\N	t	\N
6fa87983-9f89-4966-a143-421951234a3d	Ashwini	ash@gmail.com	$2b$10$WOMeHXeO.DICN0nqaW752.XEQHoBqCTF/KGNiQPA/52LW0vwXIQC.	developer	2026-02-20 05:59:51.595	\N	\N	0	t	\N	{$2b$10$WOMeHXeO.DICN0nqaW752.XEQHoBqCTF/KGNiQPA/52LW0vwXIQC.}	\N	\N	t	\N
f682f61d-6909-4ae9-aa01-3ee808f057a6	Teju	teju@gmail.com	$2b$10$4syngTc4x2nKtnix9IdScuPB7yZKFxSrJ8Xrpb2MCdiHX81CCDhiO	tester	2026-02-17 11:15:45.876	\N	\N	0	t	\N	{$2b$10$4syngTc4x2nKtnix9IdScuPB7yZKFxSrJ8Xrpb2MCdiHX81CCDhiO}	\N	\N	t	\N
8c279212-efda-4da5-948e-7883af7e6eb4	Venky	ven@gmail.com	Ven@123	tester	2026-02-25 19:07:56.141	\N	\N	0	f	\N	\N	\N	\N	t	\N
981d64dc-f8ce-4e74-91d0-3ac861069361	Anu	anu@gmail.com	Anu@123	developer	2026-02-25 18:48:29.81	\N	\N	0	f	\N	\N	\N	\N	t	\N
c221c249-d575-4a79-90f8-5eb415527218	anusha	anushakg@gmail.com	Anusha@123	developer	2026-02-28 11:18:48.266	\N	\N	0	f	\N	\N	\N	\N	f	\N
83b2a4d3-aa55-4899-b4d7-ee13da6506b0	yashwanth	yashwanth@gmail.com	Yashu@234	tester	2026-02-28 11:40:11.833	\N	\N	0	f	\N	\N	\N	\N	t	\N
686dd7e6-7da1-49a1-9d54-559ffc2b58fd	Savi	savi@gmail.com	Savi@123	tester	2026-02-28 11:19:20.273	\N	\N	0	f	\N	\N	\N	\N	t	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
06ccc8c3-2b1f-4200-967f-7cbab8bac495	5be2b71d37df3c16afbd740dc48b340310b9e6c7f7345046b62603b6dcd03b2b	2026-02-17 16:44:16.000532+05:30	20260217111414_init	\N	\N	2026-02-17 16:44:15.949811+05:30	1
d87dd7a3-6cf6-4081-aaaa-5b7ee8fdd102	5cba2dc9d54deaebf23ce42e0a7e256ca9d2b3622397b2b85af050bf6eec408a	2026-03-03 22:52:16.366947+05:30	20260303172215_add_report_schedule	\N	\N	2026-03-03 22:52:16.29342+05:30	1
71597496-72c1-42c6-8582-9878999af7d3	7e135d9c82702a150ae785e027a84729162dc8f1e6ec18b25ad71e833832caa8	2026-02-17 18:18:01.736256+05:30	20260217124800_add_soft_delete_to_suite	\N	\N	2026-02-17 18:18:01.685845+05:30	1
02b3d5ff-478a-46c4-a35f-68afc21d7d43	0ca5f277f53b96339d18002be5f5b679399c238b38c18c396e923fc12ed5a64f	2026-02-19 21:37:25.171805+05:30	20260219160724_add_template_category	\N	\N	2026-02-19 21:37:25.082069+05:30	1
6b86f4e8-48be-4aee-828b-b7c4f7558efb	022bc16d63c38cabb6a6f3c7231fe71229dd8bba6c5c0c6d6577760246c48a6a	2026-03-04 00:22:52.995268+05:30	20260303185252_add_schedule_history	\N	\N	2026-03-04 00:22:52.978814+05:30	1
a1a39660-32cd-499d-86b0-6ffb54ce2bea	b6e9564bfcc3609e38ac670366cb834ac558c028ee217229c7872e3df3c921f9	2026-02-20 22:38:51.627638+05:30	20260220170851_test_execution_and_execution_step	\N	\N	2026-02-20 22:38:51.544759+05:30	1
4c5cde52-4b72-4081-9809-3a9139b6e554	5a6d533f5e4070e69baa295345ec23303c0dc13f1cb8a4ddeedde1748c22c6bd	2026-02-21 00:55:01.158954+05:30	20260220192500_evidence	\N	\N	2026-02-21 00:55:01.092926+05:30	1
d3eb8802-1173-4af1-aedc-be5e16aa9094	964468d9482c86cb03c6631275cc0139e4df63bd11c73b06fb7e76a3f0368ebb	2026-03-04 20:46:01.746234+05:30	20260304151601_api_keys	\N	\N	2026-03-04 20:46:01.671285+05:30	1
fa8abd68-871c-4d8c-9ade-a6e1a5df6faf	522b3b283c01073f457a4ad81160e41f618cfa61958a6a6fdb9684e0bef3d4ed	2026-02-21 01:17:42.112679+05:30	20260220194741_result	\N	\N	2026-02-21 01:17:42.106533+05:30	1
88ee4ab0-0e26-4092-a4eb-6d323cbb6391	8645c8ea681721778ac5c7917619edfd35f771323009257abd61374d7ebdeb03	2026-02-21 21:59:37.798524+05:30	20260221162937_testrun	\N	\N	2026-02-21 21:59:37.712915+05:30	1
420974b1-77ee-41ec-b212-ebaf25bd04ca	e4e11387ea843a4daa175fadf85e948eb7fab280f53c6fd9a04b7ceb27a66a49	2026-03-04 21:56:53.418069+05:30	20260304162652_commit	\N	\N	2026-03-04 21:56:53.406408+05:30	1
6318fa68-356f-4e20-8e80-c199cc064c19	b5ed0d774a129adb3ae719cc564227651019290c1df9857f1e81d9ada19869d2	2026-02-22 00:45:04.710708+05:30	20260221191504_testrunid	\N	\N	2026-02-22 00:45:04.68449+05:30	1
2fdd4f86-fff1-4ba6-b8ed-de0df1d68b11	9c8ddab5a4d9ddd1766d84fbdd30850c2bbaecd32647d778ff08d44d856a9947	2026-02-22 23:35:22.509145+05:30	20260222180521_add_bug_evidence	\N	\N	2026-02-22 23:35:22.426976+05:30	1
a9a7fef9-69b1-40bc-8e4c-3e6268114639	a88bee48d051b29a2dd6dd3278a2700a5536e6b2454cc7322a5d34f4d48c9e79	2026-03-04 22:50:16.846381+05:30	20260304172016_branch	\N	\N	2026-03-04 22:50:16.838161+05:30	1
1cba500e-a3ff-4d80-b526-935631d60e39	5abe6f820189b04a0ba35fb3a9a94d9796b0cb849fe36f7e923d057ca4dd6bd7	2026-02-22 23:43:51.03934+05:30	20260222181350_add_bug_evidence	\N	\N	2026-02-22 23:43:51.027163+05:30	1
7664a10c-8ce2-4fd6-b728-09afd91d6cd7	9ccca1d0c344027840a3bc50f3afb0f4e2f9c87ff22b1146d55d26f0b148eb5f	2026-02-23 00:24:12.214006+05:30	20260222185411_add_bug_evidence	\N	\N	2026-02-23 00:24:12.184745+05:30	1
4c2880b6-84c4-427c-888e-78619e441c50	a8f1d18d487b7ac0675fc9d502e722d6d99c89d7b9677233defe6ddfe75cf1f6	2026-02-23 16:55:49.944325+05:30	20260223112549_suite_upgrade	\N	\N	2026-02-23 16:55:49.898009+05:30	1
35d78da3-9ac7-47b3-97d0-344cba20be30	eda615970e6955cde8a48c2bb2b614a95f6f9e8a8082310287a325c4efdfd434	\N	20260223150931_add_execution_user_relation	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260223150931_add_execution_user_relation\n\nDatabase error code: 23503\n\nDatabase error:\nERROR: insert or update on table "TestExecution" violates foreign key constraint "TestExecution_executedById_fkey"\nDETAIL: Key (executedById)=(user1) is not present in table "User".\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23503), message: "insert or update on table \\"TestExecution\\" violates foreign key constraint \\"TestExecution_executedById_fkey\\"", detail: Some("Key (executedById)=(user1) is not present in table \\"User\\"."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("TestExecution"), column: None, datatype: None, constraint: Some("TestExecution_executedById_fkey"), file: Some("ri_triggers.c"), line: Some(2783), routine: Some("ri_ReportViolation") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260223150931_add_execution_user_relation"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260223150931_add_execution_user_relation"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:225	2026-02-23 20:57:45.091619+05:30	2026-02-23 20:39:31.90247+05:30	0
ff9be1dc-987b-4315-a048-7b9b7560ad00	eda615970e6955cde8a48c2bb2b614a95f6f9e8a8082310287a325c4efdfd434	2026-02-23 20:57:45.093151+05:30	20260223150931_add_execution_user_relation		\N	2026-02-23 20:57:45.093151+05:30	0
bd46f21a-b481-44c1-9432-c37000002360	72fcf93bf0767ddb06304faabfe12f590338632d2d2ab2fd49aee7d975096729	2026-02-24 20:07:08.368442+05:30	20260224143707_bug_resolution_fields	\N	\N	2026-02-24 20:07:08.364471+05:30	1
d33dfac0-42b0-4959-a7be-06499b33b64a	a4b465c186a6547b5e4219fabc41279c6431cca24f40dcdcb93e2bfa3c92701d	2026-02-23 21:50:46.973846+05:30	20260223162046_add_suite_order	\N	\N	2026-02-23 21:50:46.955089+05:30	1
a48dabfc-e1b9-45ca-8d9f-3298da872b67	76821061e7a794a23e06e5fe00f2e24b63e8a852c597b0353555b1df79c773b2	2026-02-23 22:58:09.253101+05:30	20260223172808_add_suite_testcase_relation	\N	\N	2026-02-23 22:58:09.166608+05:30	1
bcb94336-9b74-42c5-be1a-84fa5bdce4c5	41ef9b7fd44e92d1802f5df841bb804295e221dc7066c58b5eaa1d31938926fe	2026-02-23 23:11:35.585867+05:30	20260223174135_updated	\N	\N	2026-02-23 23:11:35.576689+05:30	1
722f47e1-6936-4c24-8af8-80ceacce2e99	eb44e1c789dce988f60177445e01feb8ac9f43b1b488ed548b08fed1ddbd82a8	2026-02-24 20:52:27.253986+05:30	20260224152226_add_started_at	\N	\N	2026-02-24 20:52:27.251324+05:30	1
0e8a3c01-a654-4f6b-87be-76f48f421d63	a83998e9cdbcdcd0adc6b8f66c3ccdb6f0f50cff626af90f6edf6c682fd81cb6	2026-02-24 00:25:12.326813+05:30	20260223185511_add_bug_assignment	\N	\N	2026-02-24 00:25:12.306733+05:30	1
bd17e20d-28c7-4bc9-b207-72a2e2da63ee	a9e0d32ea89b9d503b12f3c89b25536f582f0d13a2af0b53a2cca73b5b327461	2026-02-24 18:01:01.656659+05:30	20260224123101_bug_fields_added	\N	\N	2026-02-24 18:01:01.594384+05:30	1
33c7fbab-c3cb-4c2c-817b-48a00243450d	4a4fff8868c04613361301d05b3064688433b61eed69d9b688944cc746e9ee5d	2026-02-27 16:02:35.662785+05:30	20260227103235_auditlog	\N	\N	2026-02-27 16:02:35.645944+05:30	1
1189f609-f85b-44f0-8dfe-2914e48ac18c	da77ba0cef3fb2df20d3e3d7392138ccd7dadf21162159910ff84125bd37e2bc	2026-02-24 18:21:38.558728+05:30	20260224125137_add_bug_type	\N	\N	2026-02-24 18:21:38.555222+05:30	1
12a4934b-c18f-4c8b-be22-566a4c7bd8de	1d6da64de1e883bf124baadc41d50c6ccfd32bb3b798c04d7cd48d14fa3e0898	2026-02-24 23:00:17.273857+05:30	20260224173016_add_bug_comments	\N	\N	2026-02-24 23:00:17.173928+05:30	1
188925ec-2af5-4713-8c7e-6e48e622b40e	e2de6722442b3888ecde205a7825a91e3bcd302c49a8a3765ee37d57dc74d8fd	2026-03-01 14:46:51.236564+05:30	20260301091650_milestone	\N	\N	2026-03-01 14:46:51.193748+05:30	1
f77bf1ca-568c-4dde-9c66-f903e8a84f0f	e44a738d8b44146bdbb65e97e83a2cd2fb96d23fd2c263af7a211014d7050cf5	2026-02-25 23:58:53.957272+05:30	20260225182853_add_user_active_flag	\N	\N	2026-02-25 23:58:53.908496+05:30	1
90c2fb0a-8112-43c4-a4fd-af4ccd3e36ae	9c760f4e8f97fcfd893c3f6e729c9a5fed7f0ab41206316f1b228667150ea357	2026-02-27 16:06:00.972531+05:30	20260227103600_auditlogupdate	\N	\N	2026-02-27 16:06:00.967304+05:30	1
6442b286-8a78-405a-b123-e3e2180c3a64	e9b0ff8ba1420a465f3c491bb2854d3b6a153ad45d847d73ab69ff000c82a948	2026-02-26 11:42:56.576802+05:30	20260226061255_role	\N	\N	2026-02-26 11:42:56.500905+05:30	1
e39e05a3-99f9-4d94-953f-f5129fe76bc7	72d838189d9db6b165201b7c91123db4093395a0d8a67ff57111cd1480eda270	2026-02-26 23:06:48.538048+05:30	20260226173647_widget	\N	\N	2026-02-26 23:06:48.449525+05:30	1
eb420729-09b5-4d51-be2b-ec645f482b74	de4b57dd9a3396150ae97678d9d0aaf476239a92e1f70226a7d66fc3a4302785	2026-02-28 23:42:35.087654+05:30	20260228181234_add_project_relations	\N	\N	2026-02-28 23:42:35.074863+05:30	1
34e6afe6-71f1-445e-9d58-2746c531eb76	50bc41701dcf0d0c8f6cdac82e204833b2f2bc50c82916006f256ac7b3a74797	2026-02-27 00:31:01.706721+05:30	20260226190101_widget	\N	\N	2026-02-27 00:31:01.661452+05:30	1
e3936d26-6d5c-4dc8-b588-bbc1747903a9	4190bff070e57b19d073eda654c637fb87698759808ca09bfff9e19e54f9ecae	2026-02-27 17:53:20.369131+05:30	20260227122319_log	\N	\N	2026-02-27 17:53:20.364578+05:30	1
6422b578-38f4-4326-b46b-aa11b1ebcc70	9c3657732b3a64a0367631480b39e9bb745ee7ba0bdb7201d4f2ff7d62fb4dec	2026-02-27 15:53:17.767785+05:30	20260227102317_add_projects	\N	\N	2026-02-27 15:53:17.691476+05:30	1
9bbd328d-00e2-4a89-b9d7-e28ed5642a69	e4f9ae549a06127c26174940f8231297b540767522651ed1e2cbeb9c1794a34e	2026-02-28 18:19:51.96094+05:30	20260228124951_setting	\N	\N	2026-02-28 18:19:51.882379+05:30	1
bec74e72-5c0f-4747-86e4-ae8136dfeb28	50fb0865f4af0cc27981395c522ee5c97ecb4379fcaf8f0b1a7c4f9d117e6e70	2026-03-01 13:30:06.707568+05:30	20260301080006_workflow	\N	\N	2026-03-01 13:30:06.667335+05:30	1
23a54f18-d1a6-403b-840e-0be537b53ce6	58437e35e72cb67e9cdad7a986f7bdce844b3d25eb7acd93a5022ad7ff110cc1	2026-02-28 23:30:09.588658+05:30	20260228180008_add_project_relations	\N	\N	2026-02-28 23:30:09.529243+05:30	1
171cb195-26e7-4fd8-bf5c-4d83f6edbc38	a8c50c34aeafb82a0cc0b082c79d260f67228ba3eef9931ed9eba349465c1ab1	2026-03-01 01:40:22.713743+05:30	20260228201021_add_project_member	\N	\N	2026-03-01 01:40:22.624423+05:30	1
81bfc2e2-3774-47fe-993e-5c6f4bbccd8c	0d307140e714e137aacb7a0aef47404aeaf4aee90173310063e1d218cf140c08	2026-03-01 12:18:21.071751+05:30	20260301064820_add_project_custom_fields	\N	\N	2026-03-01 12:18:20.98756+05:30	1
7767b698-70cf-48e6-8b0e-d9855a2f4777	fb819f97a857e44c512407fa04e60cf932d775e1cb691f423c631643be68279c	2026-03-01 14:26:21.331826+05:30	20260301085620_environment	\N	\N	2026-03-01 14:26:21.323021+05:30	1
6e8248f6-db67-4e17-afef-cc88d05ac693	2320fe3e5be6372bafbd3299ec9349609cb097f16ad31063905f9a733e862635	2026-03-01 14:01:58.764994+05:30	20260301083158_module	\N	\N	2026-03-01 14:01:58.725854+05:30	1
6d794221-944e-4f78-a0ee-1d271ecd0ce2	d81a838247101b68057f800eda9ddf29f786ba69858df65d30e3d1f2ee4097c7	2026-03-01 16:19:15.342486+05:30	20260301104914_step	\N	\N	2026-03-01 16:19:15.334478+05:30	1
c55b5fb1-107e-4bd7-8e58-2eac33df16aa	b3134760d4aaeb973bfd71535904a183f5d9a11f503fc315ae86aa15b0469e54	2026-03-01 16:39:40.210278+05:30	20260301110939_search	\N	\N	2026-03-01 16:39:40.201081+05:30	1
60387370-b0f5-42ce-8105-f0706c1b93e5	22a1a2186acc6eb6dc574f77d4aa2f297c0553f43bc0fc6a90992c10e9cdd1c6	2026-03-01 17:16:12.968406+05:30	20260301114612_filter	\N	\N	2026-03-01 17:16:12.963237+05:30	1
7b80cab9-7473-48d1-a822-3fa02087b425	5c76e33e9574ff994c8526dae599a284e41ac8ee7aac413c63c4894d466a35a9	2026-03-02 21:45:06.725584+05:30	20260302161506_add_notifications	\N	\N	2026-03-02 21:45:06.647716+05:30	1
e87d0e2e-212b-4cba-8ec6-ccbac74b8275	59c6868e7314923bd106f2ceebbca82ec8cfaa389636310c3bba3750ea878a3c	2026-03-03 00:00:28.936394+05:30	20260302183028_add_reference_id_to_notifications	\N	\N	2026-03-03 00:00:28.915214+05:30	1
\.


--
-- Name: ApiKey ApiKey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiKey"
    ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY (id);


--
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BugComment BugComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BugComment"
    ADD CONSTRAINT "BugComment_pkey" PRIMARY KEY (id);


--
-- Name: Bug Bug_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bug"
    ADD CONSTRAINT "Bug_pkey" PRIMARY KEY (id);


--
-- Name: Commit Commit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Commit"
    ADD CONSTRAINT "Commit_pkey" PRIMARY KEY (id);


--
-- Name: DashboardWidget DashboardWidget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DashboardWidget"
    ADD CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY (id);


--
-- Name: ExecutionEvidence ExecutionEvidence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExecutionEvidence"
    ADD CONSTRAINT "ExecutionEvidence_pkey" PRIMARY KEY (id);


--
-- Name: ExecutionResult ExecutionResult_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExecutionResult"
    ADD CONSTRAINT "ExecutionResult_pkey" PRIMARY KEY (id);


--
-- Name: ExecutionStep ExecutionStep_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExecutionStep"
    ADD CONSTRAINT "ExecutionStep_pkey" PRIMARY KEY (id);


--
-- Name: FilterPreset FilterPreset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FilterPreset"
    ADD CONSTRAINT "FilterPreset_pkey" PRIMARY KEY (id);


--
-- Name: NotificationPreference NotificationPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: ProjectCustomField ProjectCustomField_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectCustomField"
    ADD CONSTRAINT "ProjectCustomField_pkey" PRIMARY KEY (id);


--
-- Name: ProjectEnvironment ProjectEnvironment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectEnvironment"
    ADD CONSTRAINT "ProjectEnvironment_pkey" PRIMARY KEY (id);


--
-- Name: ProjectMember ProjectMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_pkey" PRIMARY KEY (id);


--
-- Name: ProjectMilestone ProjectMilestone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMilestone"
    ADD CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY (id);


--
-- Name: ProjectModule ProjectModule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectModule"
    ADD CONSTRAINT "ProjectModule_pkey" PRIMARY KEY (id);


--
-- Name: ProjectWorkflow ProjectWorkflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectWorkflow"
    ADD CONSTRAINT "ProjectWorkflow_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: ReportScheduleHistory ReportScheduleHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportScheduleHistory"
    ADD CONSTRAINT "ReportScheduleHistory_pkey" PRIMARY KEY (id);


--
-- Name: ReportSchedule ReportSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportSchedule"
    ADD CONSTRAINT "ReportSchedule_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SystemConfig SystemConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY (id);


--
-- Name: TemplateStep TemplateStep_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TemplateStep"
    ADD CONSTRAINT "TemplateStep_pkey" PRIMARY KEY (id);


--
-- Name: TestCaseCustomValue TestCaseCustomValue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseCustomValue"
    ADD CONSTRAINT "TestCaseCustomValue_pkey" PRIMARY KEY (id);


--
-- Name: TestCaseTemplate TestCaseTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseTemplate"
    ADD CONSTRAINT "TestCaseTemplate_pkey" PRIMARY KEY (id);


--
-- Name: TestCaseVersion TestCaseVersion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseVersion"
    ADD CONSTRAINT "TestCaseVersion_pkey" PRIMARY KEY (id);


--
-- Name: TestCase TestCase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCase"
    ADD CONSTRAINT "TestCase_pkey" PRIMARY KEY (id);


--
-- Name: TestExecution TestExecution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestExecution"
    ADD CONSTRAINT "TestExecution_pkey" PRIMARY KEY (id);


--
-- Name: TestRunAssignment TestRunAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRunAssignment"
    ADD CONSTRAINT "TestRunAssignment_pkey" PRIMARY KEY (id);


--
-- Name: TestRunCase TestRunCase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRunCase"
    ADD CONSTRAINT "TestRunCase_pkey" PRIMARY KEY (id);


--
-- Name: TestRun TestRun_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRun"
    ADD CONSTRAINT "TestRun_pkey" PRIMARY KEY (id);


--
-- Name: TestStep TestStep_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestStep"
    ADD CONSTRAINT "TestStep_pkey" PRIMARY KEY (id);


--
-- Name: TestSuite TestSuite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestSuite"
    ADD CONSTRAINT "TestSuite_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ApiKey_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ApiKey_key_key" ON public."ApiKey" USING btree (key);


--
-- Name: Bug_bugId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Bug_bugId_key" ON public."Bug" USING btree ("bugId");


--
-- Name: ExecutionStep_executionId_stepNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExecutionStep_executionId_stepNumber_key" ON public."ExecutionStep" USING btree ("executionId", "stepNumber");


--
-- Name: NotificationPreference_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON public."NotificationPreference" USING btree ("userId");


--
-- Name: ProjectMember_userId_projectId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectMember_userId_projectId_key" ON public."ProjectMember" USING btree ("userId", "projectId");


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: TestCase_testCaseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TestCase_testCaseId_key" ON public."TestCase" USING btree ("testCaseId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ApiKey ApiKey_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiKey"
    ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attachment Attachment_testCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES public."TestCase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attachment Attachment_testStepId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_testStepId_fkey" FOREIGN KEY ("testStepId") REFERENCES public."TestStep"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attachment Attachment_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BugComment BugComment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BugComment"
    ADD CONSTRAINT "BugComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BugComment BugComment_bugId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BugComment"
    ADD CONSTRAINT "BugComment_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES public."Bug"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BugComment BugComment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BugComment"
    ADD CONSTRAINT "BugComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."BugComment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Bug Bug_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bug"
    ADD CONSTRAINT "Bug_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Bug Bug_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bug"
    ADD CONSTRAINT "Bug_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Bug Bug_reportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bug"
    ADD CONSTRAINT "Bug_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DashboardWidget DashboardWidget_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DashboardWidget"
    ADD CONSTRAINT "DashboardWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExecutionStep ExecutionStep_executionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExecutionStep"
    ADD CONSTRAINT "ExecutionStep_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES public."TestExecution"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FilterPreset FilterPreset_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FilterPreset"
    ADD CONSTRAINT "FilterPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NotificationPreference NotificationPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Permission Permission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectCustomField ProjectCustomField_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectCustomField"
    ADD CONSTRAINT "ProjectCustomField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectEnvironment ProjectEnvironment_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectEnvironment"
    ADD CONSTRAINT "ProjectEnvironment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMember ProjectMember_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMember ProjectMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMilestone ProjectMilestone_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMilestone"
    ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectModule ProjectModule_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectModule"
    ADD CONSTRAINT "ProjectModule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectWorkflow ProjectWorkflow_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectWorkflow"
    ADD CONSTRAINT "ProjectWorkflow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ReportScheduleHistory ReportScheduleHistory_scheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportScheduleHistory"
    ADD CONSTRAINT "ReportScheduleHistory_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public."ReportSchedule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReportSchedule ReportSchedule_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReportSchedule"
    ADD CONSTRAINT "ReportSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TemplateStep TemplateStep_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TemplateStep"
    ADD CONSTRAINT "TemplateStep_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."TestCaseTemplate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCaseCustomValue TestCaseCustomValue_fieldId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseCustomValue"
    ADD CONSTRAINT "TestCaseCustomValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES public."ProjectCustomField"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCaseCustomValue TestCaseCustomValue_testCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseCustomValue"
    ADD CONSTRAINT "TestCaseCustomValue_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES public."TestCase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCaseTemplate TestCaseTemplate_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseTemplate"
    ADD CONSTRAINT "TestCaseTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCaseVersion TestCaseVersion_testCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCaseVersion"
    ADD CONSTRAINT "TestCaseVersion_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES public."TestCase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCase TestCase_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCase"
    ADD CONSTRAINT "TestCase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCase TestCase_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCase"
    ADD CONSTRAINT "TestCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestCase TestCase_suiteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestCase"
    ADD CONSTRAINT "TestCase_suiteId_fkey" FOREIGN KEY ("suiteId") REFERENCES public."TestSuite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TestExecution TestExecution_executedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestExecution"
    ADD CONSTRAINT "TestExecution_executedById_fkey" FOREIGN KEY ("executedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestExecution TestExecution_testRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestExecution"
    ADD CONSTRAINT "TestExecution_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES public."TestRun"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TestRunAssignment TestRunAssignment_testRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRunAssignment"
    ADD CONSTRAINT "TestRunAssignment_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES public."TestRun"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestRunAssignment TestRunAssignment_testerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRunAssignment"
    ADD CONSTRAINT "TestRunAssignment_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestRunCase TestRunCase_testRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRunCase"
    ADD CONSTRAINT "TestRunCase_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES public."TestRun"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestRun TestRun_milestoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRun"
    ADD CONSTRAINT "TestRun_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES public."ProjectMilestone"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TestRun TestRun_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestRun"
    ADD CONSTRAINT "TestRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestStep TestStep_testCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestStep"
    ADD CONSTRAINT "TestStep_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES public."TestCase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestSuite TestSuite_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestSuite"
    ADD CONSTRAINT "TestSuite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestSuite TestSuite_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestSuite"
    ADD CONSTRAINT "TestSuite_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."TestSuite"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TestSuite TestSuite_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestSuite"
    ADD CONSTRAINT "TestSuite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict WlE8DPU623tl5GKj3Nlt9sCGvZec0s2fj4VzhJY7n5Z4boBTF5dFbkIfN6GCkKF

