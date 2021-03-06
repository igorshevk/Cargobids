PGDMP     ,        
            x        	   cargobids     12.3 (Ubuntu 12.3-1.pgdg18.04+1)     12.3 (Ubuntu 12.3-1.pgdg18.04+1) �    t           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            u           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            v           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            w           1262    17359 	   cargobids    DATABASE     {   CREATE DATABASE cargobids WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
    DROP DATABASE cargobids;
                postgres    false            x           0    0    DATABASE cargobids    ACL     *   GRANT ALL ON DATABASE cargobids TO rufus;
                   postgres    false    3191            �            1259    17435    Users    TABLE     �  CREATE TABLE public."Users" (
    id integer NOT NULL,
    last_login timestamp with time zone,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    firstname character varying(25),
    lastname character varying(25),
    email character varying(191) NOT NULL,
    companyname character varying(191),
    email_verified integer NOT NULL,
    is_airline boolean NOT NULL,
    is_agent boolean NOT NULL,
    is_active integer NOT NULL,
    authcode integer NOT NULL,
    new_pass_key uuid NOT NULL,
    address character varying(100),
    address2 character varying(100),
    city character varying(100),
    zip_code character varying(100),
    is_superuser boolean,
    is_staff boolean,
    remember_token character varying(100),
    deleted_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    password character varying(191) NOT NULL,
    new_password integer NOT NULL,
    trial integer NOT NULL,
    subscription_id character varying(191),
    customer_id character varying(250),
    agent_company_id integer,
    airline_company_id integer,
    trial_key uuid
);
    DROP TABLE public."Users";
       public         heap    postgres    false            �            1259    17516    Users_groups    TABLE     ~   CREATE TABLE public."Users_groups" (
    id integer NOT NULL,
    users_id integer NOT NULL,
    group_id integer NOT NULL
);
 "   DROP TABLE public."Users_groups";
       public         heap    postgres    false            �            1259    17514    Users_groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_groups_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."Users_groups_id_seq";
       public          postgres    false    225            y           0    0    Users_groups_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."Users_groups_id_seq" OWNED BY public."Users_groups".id;
          public          postgres    false    224            �            1259    17433    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public          postgres    false    213            z           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public          postgres    false    212            �            1259    17524    Users_user_permissions    TABLE     �   CREATE TABLE public."Users_user_permissions" (
    id integer NOT NULL,
    users_id integer NOT NULL,
    permission_id integer NOT NULL
);
 ,   DROP TABLE public."Users_user_permissions";
       public         heap    postgres    false            �            1259    17522    Users_user_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_user_permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."Users_user_permissions_id_seq";
       public          postgres    false    227            {           0    0    Users_user_permissions_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public."Users_user_permissions_id_seq" OWNED BY public."Users_user_permissions".id;
          public          postgres    false    226            �            1259    17496    activations    TABLE     �   CREATE TABLE public.activations (
    id integer NOT NULL,
    key uuid NOT NULL,
    is_active integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    user_id integer NOT NULL
);
    DROP TABLE public.activations;
       public         heap    postgres    false            �            1259    17494    activations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.activations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.activations_id_seq;
       public          postgres    false    223            |           0    0    activations_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.activations_id_seq OWNED BY public.activations.id;
          public          postgres    false    222            �            1259    17450    agent    TABLE     Y  CREATE TABLE public.agent (
    id integer NOT NULL,
    agent_company_name character varying(100) NOT NULL,
    iata character varying(11),
    branch character varying(30),
    address_1 character varying(191),
    address_2 character varying(191),
    zip_code character varying(10),
    city character varying(80),
    p_iva character varying(11),
    cf character varying(16),
    pec character varying(254),
    sdi character varying(7),
    is_active integer NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.agent;
       public         heap    postgres    false            �            1259    17448    agent_id_seq    SEQUENCE     �   CREATE SEQUENCE public.agent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.agent_id_seq;
       public          postgres    false    215            }           0    0    agent_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.agent_id_seq OWNED BY public.agent.id;
          public          postgres    false    214            �            1259    17461    airline    TABLE     b  CREATE TABLE public.airline (
    id integer NOT NULL,
    mode character varying(7) NOT NULL,
    airline_company_name character varying(100) NOT NULL,
    branch character varying(30),
    address_1 character varying(50),
    address_2 character varying(50),
    zip_code character varying(5),
    city character varying(20),
    p_iva character varying(11),
    cf character varying(16),
    pec character varying(254),
    sdi character varying(7),
    is_active integer NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.airline;
       public         heap    postgres    false            �            1259    17459    airline_id_seq    SEQUENCE     �   CREATE SEQUENCE public.airline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.airline_id_seq;
       public          postgres    false    217            ~           0    0    airline_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.airline_id_seq OWNED BY public.airline.id;
          public          postgres    false    216            �            1259    17391 
   auth_group    TABLE     f   CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);
    DROP TABLE public.auth_group;
       public         heap    postgres    false            �            1259    17389    auth_group_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.auth_group_id_seq;
       public          postgres    false    209                       0    0    auth_group_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;
          public          postgres    false    208            �            1259    17401    auth_group_permissions    TABLE     �   CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);
 *   DROP TABLE public.auth_group_permissions;
       public         heap    postgres    false            �            1259    17399    auth_group_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.auth_group_permissions_id_seq;
       public          postgres    false    211            �           0    0    auth_group_permissions_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;
          public          postgres    false    210            �            1259    17383    auth_permission    TABLE     �   CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);
 #   DROP TABLE public.auth_permission;
       public         heap    postgres    false            �            1259    17381    auth_permission_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.auth_permission_id_seq;
       public          postgres    false    207            �           0    0    auth_permission_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;
          public          postgres    false    206            �            1259    17610    authtoken_token    TABLE     �   CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);
 #   DROP TABLE public.authtoken_token;
       public         heap    postgres    false            �            1259    17485    bids    TABLE     �  CREATE TABLE public.bids (
    id integer NOT NULL,
    carrier character varying(2) NOT NULL,
    rate numeric(4,2) NOT NULL,
    all_in character varying(5) NOT NULL,
    surcharges numeric(4,2),
    cw_required numeric(6,2),
    origin character varying(5) NOT NULL,
    conditions character varying(6) NOT NULL,
    remarks text,
    status character varying(7) NOT NULL,
    publish date,
    "timestamp" timestamp with time zone NOT NULL,
    author_id integer,
    quote_id integer NOT NULL
);
    DROP TABLE public.bids;
       public         heap    postgres    false            �            1259    17483    bids_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.bids_id_seq;
       public          postgres    false    221            �           0    0    bids_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.bids_id_seq OWNED BY public.bids.id;
          public          postgres    false    220            �            1259    17588    django_admin_log    TABLE     �  CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);
 $   DROP TABLE public.django_admin_log;
       public         heap    postgres    false            �            1259    17586    django_admin_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.django_admin_log_id_seq;
       public          postgres    false    229            �           0    0    django_admin_log_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;
          public          postgres    false    228            �            1259    17373    django_content_type    TABLE     �   CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);
 '   DROP TABLE public.django_content_type;
       public         heap    postgres    false            �            1259    17371    django_content_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.django_content_type_id_seq;
       public          postgres    false    205            �           0    0    django_content_type_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;
          public          postgres    false    204            �            1259    17362    django_migrations    TABLE     �   CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);
 %   DROP TABLE public.django_migrations;
       public         heap    postgres    false            �            1259    17360    django_migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.django_migrations_id_seq;
       public          postgres    false    203            �           0    0    django_migrations_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;
          public          postgres    false    202            �            1259    17680    django_session    TABLE     �   CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);
 "   DROP TABLE public.django_session;
       public         heap    postgres    false            �            1259    17630    memberships_membershipplan    TABLE     ]  CREATE TABLE public.memberships_membershipplan (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    cost_per_month numeric(6,2) NOT NULL,
    cost_per_3_months numeric(6,2) NOT NULL,
    cost_per_6_months numeric(6,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
 .   DROP TABLE public.memberships_membershipplan;
       public         heap    postgres    false            �            1259    17628 !   memberships_membershipplan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.memberships_membershipplan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.memberships_membershipplan_id_seq;
       public          postgres    false    232            �           0    0 !   memberships_membershipplan_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.memberships_membershipplan_id_seq OWNED BY public.memberships_membershipplan.id;
          public          postgres    false    231            �            1259    17638    memberships_subscriptions    TABLE     �  CREATE TABLE public.memberships_subscriptions (
    id integer NOT NULL,
    status character varying(20) NOT NULL,
    current_period_end timestamp with time zone,
    current_period_start timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    membership_id integer NOT NULL,
    cost_per_month numeric(6,2),
    total_cost numeric(6,2),
    user_id integer NOT NULL,
    amount_due numeric(6,2),
    amount_paid numeric(8,2),
    cancel_at timestamp with time zone,
    customer_id character varying(191),
    subscription_id character varying(191),
    trial_period integer NOT NULL,
    canceled_by_user boolean NOT NULL,
    "interval" character varying(191),
    interval_count integer,
    payment_type character varying(14),
    payment_received_on timestamp with time zone,
    invoice_sent_on timestamp with time zone,
    bank_transfer_no character varying(191),
    is_confirmed boolean NOT NULL
);
 -   DROP TABLE public.memberships_subscriptions;
       public         heap    postgres    false            �            1259    17636     memberships_subscriptions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.memberships_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.memberships_subscriptions_id_seq;
       public          postgres    false    234            �           0    0     memberships_subscriptions_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.memberships_subscriptions_id_seq OWNED BY public.memberships_subscriptions.id;
          public          postgres    false    233            �            1259    17472    quotes    TABLE     �  CREATE TABLE public.quotes (
    id integer NOT NULL,
    slug character varying(50),
    types character varying(20) NOT NULL,
    title character varying(120) NOT NULL,
    origin character varying(20) NOT NULL,
    destination character varying(3) NOT NULL,
    area character varying(20) NOT NULL,
    pieces integer NOT NULL,
    kilos numeric(7,2) NOT NULL,
    volume numeric(5,2) NOT NULL,
    gencargo boolean NOT NULL,
    dgr boolean NOT NULL,
    perishable boolean NOT NULL,
    stackable boolean NOT NULL,
    tiltable boolean NOT NULL,
    special_cargo boolean NOT NULL,
    rfc date,
    deadline date,
    note text NOT NULL,
    publish date,
    updated timestamp with time zone NOT NULL,
    status character varying(6) NOT NULL,
    views_count integer NOT NULL,
    weight numeric(8,2),
    dimensions text,
    "timestamp" timestamp with time zone NOT NULL,
    author_id integer
);
    DROP TABLE public.quotes;
       public         heap    postgres    false            �            1259    17470    quotes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.quotes_id_seq;
       public          postgres    false    219            �           0    0    quotes_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;
          public          postgres    false    218            c           2604    17438    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    213    213            i           2604    17519    Users_groups id    DEFAULT     v   ALTER TABLE ONLY public."Users_groups" ALTER COLUMN id SET DEFAULT nextval('public."Users_groups_id_seq"'::regclass);
 @   ALTER TABLE public."Users_groups" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            j           2604    17527    Users_user_permissions id    DEFAULT     �   ALTER TABLE ONLY public."Users_user_permissions" ALTER COLUMN id SET DEFAULT nextval('public."Users_user_permissions_id_seq"'::regclass);
 J   ALTER TABLE public."Users_user_permissions" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    227    227            h           2604    17499    activations id    DEFAULT     p   ALTER TABLE ONLY public.activations ALTER COLUMN id SET DEFAULT nextval('public.activations_id_seq'::regclass);
 =   ALTER TABLE public.activations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            d           2604    17453    agent id    DEFAULT     d   ALTER TABLE ONLY public.agent ALTER COLUMN id SET DEFAULT nextval('public.agent_id_seq'::regclass);
 7   ALTER TABLE public.agent ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            e           2604    17464 
   airline id    DEFAULT     h   ALTER TABLE ONLY public.airline ALTER COLUMN id SET DEFAULT nextval('public.airline_id_seq'::regclass);
 9   ALTER TABLE public.airline ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            a           2604    17394    auth_group id    DEFAULT     n   ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);
 <   ALTER TABLE public.auth_group ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    208    209            b           2604    17404    auth_group_permissions id    DEFAULT     �   ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);
 H   ALTER TABLE public.auth_group_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211            `           2604    17386    auth_permission id    DEFAULT     x   ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);
 A   ALTER TABLE public.auth_permission ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    207    207            g           2604    17488    bids id    DEFAULT     b   ALTER TABLE ONLY public.bids ALTER COLUMN id SET DEFAULT nextval('public.bids_id_seq'::regclass);
 6   ALTER TABLE public.bids ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            k           2604    17591    django_admin_log id    DEFAULT     z   ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);
 B   ALTER TABLE public.django_admin_log ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            _           2604    17376    django_content_type id    DEFAULT     �   ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);
 E   ALTER TABLE public.django_content_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    204    205    205            ^           2604    17365    django_migrations id    DEFAULT     |   ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);
 C   ALTER TABLE public.django_migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            m           2604    17633    memberships_membershipplan id    DEFAULT     �   ALTER TABLE ONLY public.memberships_membershipplan ALTER COLUMN id SET DEFAULT nextval('public.memberships_membershipplan_id_seq'::regclass);
 L   ALTER TABLE public.memberships_membershipplan ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            n           2604    17641    memberships_subscriptions id    DEFAULT     �   ALTER TABLE ONLY public.memberships_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.memberships_subscriptions_id_seq'::regclass);
 K   ALTER TABLE public.memberships_subscriptions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            f           2604    17475 	   quotes id    DEFAULT     f   ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);
 8   ALTER TABLE public.quotes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            [          0    17435    Users 
   TABLE DATA           �  COPY public."Users" (id, last_login, first_name, last_name, date_joined, firstname, lastname, email, companyname, email_verified, is_airline, is_agent, is_active, authcode, new_pass_key, address, address2, city, zip_code, is_superuser, is_staff, remember_token, deleted_at, created_at, updated_at, password, new_password, trial, subscription_id, customer_id, agent_company_id, airline_company_id, trial_key) FROM stdin;
    public          postgres    false    213   �       g          0    17516    Users_groups 
   TABLE DATA           @   COPY public."Users_groups" (id, users_id, group_id) FROM stdin;
    public          postgres    false    225   ��       i          0    17524    Users_user_permissions 
   TABLE DATA           O   COPY public."Users_user_permissions" (id, users_id, permission_id) FROM stdin;
    public          postgres    false    227   ;�       e          0    17496    activations 
   TABLE DATA           Z   COPY public.activations (id, key, is_active, created_at, updated_at, user_id) FROM stdin;
    public          postgres    false    223   X�       ]          0    17450    agent 
   TABLE DATA           �   COPY public.agent (id, agent_company_name, iata, branch, address_1, address_2, zip_code, city, p_iva, cf, pec, sdi, is_active, deleted_at, created_at, updated_at) FROM stdin;
    public          postgres    false    215   /�       _          0    17461    airline 
   TABLE DATA           �   COPY public.airline (id, mode, airline_company_name, branch, address_1, address_2, zip_code, city, p_iva, cf, pec, sdi, is_active, deleted_at, created_at, updated_at) FROM stdin;
    public          postgres    false    217   ��       W          0    17391 
   auth_group 
   TABLE DATA           .   COPY public.auth_group (id, name) FROM stdin;
    public          postgres    false    209   s�       Y          0    17401    auth_group_permissions 
   TABLE DATA           M   COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
    public          postgres    false    211   ��       U          0    17383    auth_permission 
   TABLE DATA           N   COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
    public          postgres    false    207   ��       l          0    17610    authtoken_token 
   TABLE DATA           @   COPY public.authtoken_token (key, created, user_id) FROM stdin;
    public          postgres    false    230          c          0    17485    bids 
   TABLE DATA           �   COPY public.bids (id, carrier, rate, all_in, surcharges, cw_required, origin, conditions, remarks, status, publish, "timestamp", author_id, quote_id) FROM stdin;
    public          postgres    false    221   c      k          0    17588    django_admin_log 
   TABLE DATA           �   COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
    public          postgres    false    229   :      S          0    17373    django_content_type 
   TABLE DATA           C   COPY public.django_content_type (id, app_label, model) FROM stdin;
    public          postgres    false    205   W      Q          0    17362    django_migrations 
   TABLE DATA           C   COPY public.django_migrations (id, app, name, applied) FROM stdin;
    public          postgres    false    203   
      q          0    17680    django_session 
   TABLE DATA           P   COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
    public          postgres    false    235   w      n          0    17630    memberships_membershipplan 
   TABLE DATA           �   COPY public.memberships_membershipplan (id, name, cost_per_month, cost_per_3_months, cost_per_6_months, created_at, updated_at) FROM stdin;
    public          postgres    false    232   �      p          0    17638    memberships_subscriptions 
   TABLE DATA           �  COPY public.memberships_subscriptions (id, status, current_period_end, current_period_start, created_at, updated_at, membership_id, cost_per_month, total_cost, user_id, amount_due, amount_paid, cancel_at, customer_id, subscription_id, trial_period, canceled_by_user, "interval", interval_count, payment_type, payment_received_on, invoice_sent_on, bank_transfer_no, is_confirmed) FROM stdin;
    public          postgres    false    234   �      a          0    17472    quotes 
   TABLE DATA             COPY public.quotes (id, slug, types, title, origin, destination, area, pieces, kilos, volume, gencargo, dgr, perishable, stackable, tiltable, special_cargo, rfc, deadline, note, publish, updated, status, views_count, weight, dimensions, "timestamp", author_id) FROM stdin;
    public          postgres    false    219   �
      �           0    0    Users_groups_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."Users_groups_id_seq"', 22, true);
          public          postgres    false    224            �           0    0    Users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Users_id_seq"', 13, true);
          public          postgres    false    212            �           0    0    Users_user_permissions_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."Users_user_permissions_id_seq"', 1, false);
          public          postgres    false    226            �           0    0    activations_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.activations_id_seq', 10, true);
          public          postgres    false    222            �           0    0    agent_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.agent_id_seq', 3, true);
          public          postgres    false    214            �           0    0    airline_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.airline_id_seq', 3, true);
          public          postgres    false    216            �           0    0    auth_group_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.auth_group_id_seq', 3, true);
          public          postgres    false    208            �           0    0    auth_group_permissions_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);
          public          postgres    false    210            �           0    0    auth_permission_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.auth_permission_id_seq', 56, true);
          public          postgres    false    206            �           0    0    bids_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.bids_id_seq', 20, true);
          public          postgres    false    220            �           0    0    django_admin_log_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);
          public          postgres    false    228            �           0    0    django_content_type_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.django_content_type_id_seq', 14, true);
          public          postgres    false    204            �           0    0    django_migrations_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.django_migrations_id_seq', 42, true);
          public          postgres    false    202            �           0    0 !   memberships_membershipplan_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.memberships_membershipplan_id_seq', 2, true);
          public          postgres    false    231            �           0    0     memberships_subscriptions_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.memberships_subscriptions_id_seq', 7, true);
          public          postgres    false    233            �           0    0    quotes_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.quotes_id_seq', 24, true);
          public          postgres    false    218            �           2606    17445    Users Users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
 C   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
       public            postgres    false    213            �           2606    17521    Users_groups Users_groups_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."Users_groups"
    ADD CONSTRAINT "Users_groups_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."Users_groups" DROP CONSTRAINT "Users_groups_pkey";
       public            postgres    false    225            �           2606    17559 9   Users_groups Users_groups_users_id_group_id_135dc177_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public."Users_groups"
    ADD CONSTRAINT "Users_groups_users_id_group_id_135dc177_uniq" UNIQUE (users_id, group_id);
 g   ALTER TABLE ONLY public."Users_groups" DROP CONSTRAINT "Users_groups_users_id_group_id_135dc177_uniq";
       public            postgres    false    225    225            �           2606    17447    Users Users_new_pass_key_key 
   CONSTRAINT     c   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_new_pass_key_key" UNIQUE (new_pass_key);
 J   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_new_pass_key_key";
       public            postgres    false    213            �           2606    17443    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public            postgres    false    213            �           2606    17529 2   Users_user_permissions Users_user_permissions_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."Users_user_permissions"
    ADD CONSTRAINT "Users_user_permissions_pkey" PRIMARY KEY (id);
 `   ALTER TABLE ONLY public."Users_user_permissions" DROP CONSTRAINT "Users_user_permissions_pkey";
       public            postgres    false    227            �           2606    17573 R   Users_user_permissions Users_user_permissions_users_id_permission_id_9df28dab_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public."Users_user_permissions"
    ADD CONSTRAINT "Users_user_permissions_users_id_permission_id_9df28dab_uniq" UNIQUE (users_id, permission_id);
 �   ALTER TABLE ONLY public."Users_user_permissions" DROP CONSTRAINT "Users_user_permissions_users_id_permission_id_9df28dab_uniq";
       public            postgres    false    227    227            �           2606    17503    activations activations_key_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.activations
    ADD CONSTRAINT activations_key_key UNIQUE (key);
 I   ALTER TABLE ONLY public.activations DROP CONSTRAINT activations_key_key;
       public            postgres    false    223            �           2606    17501    activations activations_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.activations
    ADD CONSTRAINT activations_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.activations DROP CONSTRAINT activations_pkey;
       public            postgres    false    223            �           2606    17458    agent agent_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.agent
    ADD CONSTRAINT agent_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.agent DROP CONSTRAINT agent_pkey;
       public            postgres    false    215            �           2606    17469    airline airline_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.airline
    ADD CONSTRAINT airline_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.airline DROP CONSTRAINT airline_pkey;
       public            postgres    false    217            |           2606    17431    auth_group auth_group_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);
 H   ALTER TABLE ONLY public.auth_group DROP CONSTRAINT auth_group_name_key;
       public            postgres    false    209            �           2606    17417 R   auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);
 |   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
       public            postgres    false    211    211            �           2606    17406 2   auth_group_permissions auth_group_permissions_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_pkey;
       public            postgres    false    211            ~           2606    17396    auth_group auth_group_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.auth_group DROP CONSTRAINT auth_group_pkey;
       public            postgres    false    209            w           2606    17408 F   auth_permission auth_permission_content_type_id_codename_01ab375a_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);
 p   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq;
       public            postgres    false    207    207            y           2606    17388 $   auth_permission auth_permission_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_pkey;
       public            postgres    false    207            �           2606    17614 $   authtoken_token authtoken_token_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);
 N   ALTER TABLE ONLY public.authtoken_token DROP CONSTRAINT authtoken_token_pkey;
       public            postgres    false    230            �           2606    17616 +   authtoken_token authtoken_token_user_id_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);
 U   ALTER TABLE ONLY public.authtoken_token DROP CONSTRAINT authtoken_token_user_id_key;
       public            postgres    false    230            �           2606    17493    bids bids_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_pkey;
       public            postgres    false    221            �           2606    17597 &   django_admin_log django_admin_log_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT django_admin_log_pkey;
       public            postgres    false    229            r           2606    17380 E   django_content_type django_content_type_app_label_model_76bd3d3b_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);
 o   ALTER TABLE ONLY public.django_content_type DROP CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq;
       public            postgres    false    205    205            t           2606    17378 ,   django_content_type django_content_type_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.django_content_type DROP CONSTRAINT django_content_type_pkey;
       public            postgres    false    205            p           2606    17370 (   django_migrations django_migrations_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.django_migrations DROP CONSTRAINT django_migrations_pkey;
       public            postgres    false    203            �           2606    17687 "   django_session django_session_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);
 L   ALTER TABLE ONLY public.django_session DROP CONSTRAINT django_session_pkey;
       public            postgres    false    235            �           2606    17635 :   memberships_membershipplan memberships_membershipplan_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.memberships_membershipplan
    ADD CONSTRAINT memberships_membershipplan_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.memberships_membershipplan DROP CONSTRAINT memberships_membershipplan_pkey;
       public            postgres    false    232            �           2606    17643 8   memberships_subscriptions memberships_subscriptions_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.memberships_subscriptions
    ADD CONSTRAINT memberships_subscriptions_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.memberships_subscriptions DROP CONSTRAINT memberships_subscriptions_pkey;
       public            postgres    false    234            �           2606    17480    quotes quotes_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.quotes DROP CONSTRAINT quotes_pkey;
       public            postgres    false    219            �           2606    17482    quotes quotes_slug_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_slug_key UNIQUE (slug);
 @   ALTER TABLE ONLY public.quotes DROP CONSTRAINT quotes_slug_key;
       public            postgres    false    219            �           1259    17556    Users_agent_company_id_31bc528c    INDEX     a   CREATE INDEX "Users_agent_company_id_31bc528c" ON public."Users" USING btree (agent_company_id);
 5   DROP INDEX public."Users_agent_company_id_31bc528c";
       public            postgres    false    213            �           1259    17557 !   Users_airline_company_id_39ba70b0    INDEX     e   CREATE INDEX "Users_airline_company_id_39ba70b0" ON public."Users" USING btree (airline_company_id);
 7   DROP INDEX public."Users_airline_company_id_39ba70b0";
       public            postgres    false    213            �           1259    17530    Users_email_93eda431_like    INDEX     d   CREATE INDEX "Users_email_93eda431_like" ON public."Users" USING btree (email varchar_pattern_ops);
 /   DROP INDEX public."Users_email_93eda431_like";
       public            postgres    false    213            �           1259    17571    Users_groups_group_id_2ddde7ed    INDEX     _   CREATE INDEX "Users_groups_group_id_2ddde7ed" ON public."Users_groups" USING btree (group_id);
 4   DROP INDEX public."Users_groups_group_id_2ddde7ed";
       public            postgres    false    225            �           1259    17570    Users_groups_users_id_f8a5cae6    INDEX     _   CREATE INDEX "Users_groups_users_id_f8a5cae6" ON public."Users_groups" USING btree (users_id);
 4   DROP INDEX public."Users_groups_users_id_f8a5cae6";
       public            postgres    false    225            �           1259    17585 -   Users_user_permissions_permission_id_7995fa19    INDEX     }   CREATE INDEX "Users_user_permissions_permission_id_7995fa19" ON public."Users_user_permissions" USING btree (permission_id);
 C   DROP INDEX public."Users_user_permissions_permission_id_7995fa19";
       public            postgres    false    227            �           1259    17584 (   Users_user_permissions_users_id_59e85ef1    INDEX     s   CREATE INDEX "Users_user_permissions_users_id_59e85ef1" ON public."Users_user_permissions" USING btree (users_id);
 >   DROP INDEX public."Users_user_permissions_users_id_59e85ef1";
       public            postgres    false    227            �           1259    17555    activations_user_id_529082a8    INDEX     W   CREATE INDEX activations_user_id_529082a8 ON public.activations USING btree (user_id);
 0   DROP INDEX public.activations_user_id_529082a8;
       public            postgres    false    223            z           1259    17432    auth_group_name_a6ea08ec_like    INDEX     h   CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);
 1   DROP INDEX public.auth_group_name_a6ea08ec_like;
       public            postgres    false    209                       1259    17428 (   auth_group_permissions_group_id_b120cbf9    INDEX     o   CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);
 <   DROP INDEX public.auth_group_permissions_group_id_b120cbf9;
       public            postgres    false    211            �           1259    17429 -   auth_group_permissions_permission_id_84c5c92e    INDEX     y   CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);
 A   DROP INDEX public.auth_group_permissions_permission_id_84c5c92e;
       public            postgres    false    211            u           1259    17414 (   auth_permission_content_type_id_2f476e4b    INDEX     o   CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);
 <   DROP INDEX public.auth_permission_content_type_id_2f476e4b;
       public            postgres    false    207            �           1259    17622 !   authtoken_token_key_10f0b77e_like    INDEX     p   CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);
 5   DROP INDEX public.authtoken_token_key_10f0b77e_like;
       public            postgres    false    230            �           1259    17548    bids_author_id_c241f165    INDEX     M   CREATE INDEX bids_author_id_c241f165 ON public.bids USING btree (author_id);
 +   DROP INDEX public.bids_author_id_c241f165;
       public            postgres    false    221            �           1259    17549    bids_quote_id_a8995dc8    INDEX     K   CREATE INDEX bids_quote_id_a8995dc8 ON public.bids USING btree (quote_id);
 *   DROP INDEX public.bids_quote_id_a8995dc8;
       public            postgres    false    221            �           1259    17608 )   django_admin_log_content_type_id_c4bce8eb    INDEX     q   CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);
 =   DROP INDEX public.django_admin_log_content_type_id_c4bce8eb;
       public            postgres    false    229            �           1259    17609 !   django_admin_log_user_id_c564eba6    INDEX     a   CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);
 5   DROP INDEX public.django_admin_log_user_id_c564eba6;
       public            postgres    false    229            �           1259    17689 #   django_session_expire_date_a5c62663    INDEX     e   CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);
 7   DROP INDEX public.django_session_expire_date_a5c62663;
       public            postgres    false    235            �           1259    17688 (   django_session_session_key_c0390e0f_like    INDEX     ~   CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);
 <   DROP INDEX public.django_session_session_key_c0390e0f_like;
       public            postgres    false    235            �           1259    17649 0   memberships_subscriptions_membership_id_821979aa    INDEX        CREATE INDEX memberships_subscriptions_membership_id_821979aa ON public.memberships_subscriptions USING btree (membership_id);
 D   DROP INDEX public.memberships_subscriptions_membership_id_821979aa;
       public            postgres    false    234            �           1259    17658 *   memberships_subscriptions_user_id_97606742    INDEX     s   CREATE INDEX memberships_subscriptions_user_id_97606742 ON public.memberships_subscriptions USING btree (user_id);
 >   DROP INDEX public.memberships_subscriptions_user_id_97606742;
       public            postgres    false    234            �           1259    17537    quotes_author_id_9153ac53    INDEX     Q   CREATE INDEX quotes_author_id_9153ac53 ON public.quotes USING btree (author_id);
 -   DROP INDEX public.quotes_author_id_9153ac53;
       public            postgres    false    219            �           1259    17536    quotes_slug_03341d4d_like    INDEX     `   CREATE INDEX quotes_slug_03341d4d_like ON public.quotes USING btree (slug varchar_pattern_ops);
 -   DROP INDEX public.quotes_slug_03341d4d_like;
       public            postgres    false    219            �           2606    17504 1   Users Users_agent_company_id_31bc528c_fk_agent_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_agent_company_id_31bc528c_fk_agent_id" FOREIGN KEY (agent_company_id) REFERENCES public.agent(id) DEFERRABLE INITIALLY DEFERRED;
 _   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_agent_company_id_31bc528c_fk_agent_id";
       public          postgres    false    215    2959    213            �           2606    17509 5   Users Users_airline_company_id_39ba70b0_fk_airline_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_airline_company_id_39ba70b0_fk_airline_id" FOREIGN KEY (airline_company_id) REFERENCES public.airline(id) DEFERRABLE INITIALLY DEFERRED;
 c   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_airline_company_id_39ba70b0_fk_airline_id";
       public          postgres    false    213    2961    217            �           2606    17565 <   Users_groups Users_groups_group_id_2ddde7ed_fk_auth_group_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users_groups"
    ADD CONSTRAINT "Users_groups_group_id_2ddde7ed_fk_auth_group_id" FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;
 j   ALTER TABLE ONLY public."Users_groups" DROP CONSTRAINT "Users_groups_group_id_2ddde7ed_fk_auth_group_id";
       public          postgres    false    225    2942    209            �           2606    17560 7   Users_groups Users_groups_users_id_f8a5cae6_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users_groups"
    ADD CONSTRAINT "Users_groups_users_id_f8a5cae6_fk_Users_id" FOREIGN KEY (users_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 e   ALTER TABLE ONLY public."Users_groups" DROP CONSTRAINT "Users_groups_users_id_f8a5cae6_fk_Users_id";
       public          postgres    false    225    213    2957            �           2606    17579 O   Users_user_permissions Users_user_permissio_permission_id_7995fa19_fk_auth_perm    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users_user_permissions"
    ADD CONSTRAINT "Users_user_permissio_permission_id_7995fa19_fk_auth_perm" FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
 }   ALTER TABLE ONLY public."Users_user_permissions" DROP CONSTRAINT "Users_user_permissio_permission_id_7995fa19_fk_auth_perm";
       public          postgres    false    207    2937    227            �           2606    17574 K   Users_user_permissions Users_user_permissions_users_id_59e85ef1_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public."Users_user_permissions"
    ADD CONSTRAINT "Users_user_permissions_users_id_59e85ef1_fk_Users_id" FOREIGN KEY (users_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 y   ALTER TABLE ONLY public."Users_user_permissions" DROP CONSTRAINT "Users_user_permissions_users_id_59e85ef1_fk_Users_id";
       public          postgres    false    2957    227    213            �           2606    17550 4   activations activations_user_id_529082a8_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.activations
    ADD CONSTRAINT "activations_user_id_529082a8_fk_Users_id" FOREIGN KEY (user_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 `   ALTER TABLE ONLY public.activations DROP CONSTRAINT "activations_user_id_529082a8_fk_Users_id";
       public          postgres    false    2957    223    213            �           2606    17423 O   auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
 y   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
       public          postgres    false    2937    211    207            �           2606    17418 P   auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;
 z   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
       public          postgres    false    2942    211    209            �           2606    17409 E   auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
 o   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co;
       public          postgres    false    205    2932    207            �           2606    17623 <   authtoken_token authtoken_token_user_id_35299eff_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT "authtoken_token_user_id_35299eff_fk_Users_id" FOREIGN KEY (user_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 h   ALTER TABLE ONLY public.authtoken_token DROP CONSTRAINT "authtoken_token_user_id_35299eff_fk_Users_id";
       public          postgres    false    2957    230    213            �           2606    17538 (   bids bids_author_id_c241f165_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT "bids_author_id_c241f165_fk_Users_id" FOREIGN KEY (author_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 T   ALTER TABLE ONLY public.bids DROP CONSTRAINT "bids_author_id_c241f165_fk_Users_id";
       public          postgres    false    2957    221    213            �           2606    17543 (   bids bids_quote_id_a8995dc8_fk_quotes_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_quote_id_a8995dc8_fk_quotes_id FOREIGN KEY (quote_id) REFERENCES public.quotes(id) DEFERRABLE INITIALLY DEFERRED;
 R   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_quote_id_a8995dc8_fk_quotes_id;
       public          postgres    false    2964    219    221            �           2606    17598 G   django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co    FK CONSTRAINT     �   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
 q   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co;
       public          postgres    false    205    229    2932            �           2606    17603 >   django_admin_log django_admin_log_user_id_c564eba6_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_Users_id" FOREIGN KEY (user_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 j   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT "django_admin_log_user_id_c564eba6_fk_Users_id";
       public          postgres    false    213    229    2957            �           2606    17644 R   memberships_subscriptions memberships_subscrip_membership_id_821979aa_fk_membershi    FK CONSTRAINT     �   ALTER TABLE ONLY public.memberships_subscriptions
    ADD CONSTRAINT memberships_subscrip_membership_id_821979aa_fk_membershi FOREIGN KEY (membership_id) REFERENCES public.memberships_membershipplan(id) DEFERRABLE INITIALLY DEFERRED;
 |   ALTER TABLE ONLY public.memberships_subscriptions DROP CONSTRAINT memberships_subscrip_membership_id_821979aa_fk_membershi;
       public          postgres    false    234    2999    232            �           2606    17653 P   memberships_subscriptions memberships_subscriptions_user_id_97606742_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.memberships_subscriptions
    ADD CONSTRAINT "memberships_subscriptions_user_id_97606742_fk_Users_id" FOREIGN KEY (user_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 |   ALTER TABLE ONLY public.memberships_subscriptions DROP CONSTRAINT "memberships_subscriptions_user_id_97606742_fk_Users_id";
       public          postgres    false    234    2957    213            �           2606    17531 ,   quotes quotes_author_id_9153ac53_fk_Users_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "quotes_author_id_9153ac53_fk_Users_id" FOREIGN KEY (author_id) REFERENCES public."Users"(id) DEFERRABLE INITIALLY DEFERRED;
 X   ALTER TABLE ONLY public.quotes DROP CONSTRAINT "quotes_author_id_9153ac53_fk_Users_id";
       public          postgres    false    2957    213    219            [   �  x���[o�8���_��P���H�4��c˩���4r�$B8��1Й��M&�f��޵��i���<CV��@A`�0���}��L�/r*
N������p�I9S&q˔s�blS�B����'�����(��qr��Y�ivi��O%�,9���b6:�rlD��f���~�0���u�^��KSVߔ�u��.ڣ���w^�u���O��A�0) ���ad��q� ��bQ�0!�I�&$F&a��	 ��n�m!Jo��Z�!���:��J��q3�`�w��1)�����*�d�^o��ni4�������B��hX9��&n=� TAS0`�A�G����8�1�{|��LN���,#��a}^��p��1n8��r2���Q������A�&�,��Rm�l���5b�-�Gr���,e�ex��W
``0�]�]Ǆ��*r2m�`Ӧ�@ĕ ��	`��kJ��1b?����
��V7A)5��j���`U�e�E��(+u�颿�6����;�KQ���?��tY���8�;��rH�������^�.���P̢�؁�PmHDj9Y�iJM�AǓD�SC�"���#C����>Z��e�!9�t�������b�/}��0��EƟ���h�͹z6>$�I��_/�jp���A&�.hĉ�g���[Q�Mg���J��j���G��jm|�	�ic������g���f:L̙0���q\bR$�I<Ghw:Am��-��gl}�<�ki��e����@q�� )P���
����t3��F�nU3َ\�m8�t�ɇ�e�e#o�t�%݄�!��k����և]�*�^�Q1i]��K��v�34�-�	�(ӊ( ���.E��~�^�^��P���#.P�dZ�@[���8V����j7
4���!���+�ҳ��TY�Q*.
NE��2���}�;��e���<?�I8�:�nҁ�R����Ek�o��~g��W�۾�!eT+crA�/}Ş/-�/4Rv������#rpp���"@F�k=B�O�$�� 
f*����J����B�"�eD	~&�>�<� Qɻ0��;"݅��li���?DY�}���׾wtwgSj����s�I��z<����iewV*�jn7�FI���Y������J}��G�0Q�Ix����_��Ξ�_���z��('~��#�&�0�l|CnT�<9��!�t-�8��*�ԥ0�� 1�
���P��i�y���F��I]l�`N)\���o��j2s�}�j����+�+�����W$���뼤�(O�����"|_��c9���w���2�e�4��`m� �+�ݏI'�eba���E����p����խ�횺�8@B8�u�>#��+ғe��E�� ����T���b���ftֆ��u�,;��3��)���[˯��z��b���Z��Z�Eڳ���c������\C���;���"��+�M�)M�*���
S�[��㋪�>���{��v��S�g&��ׁ���~�h��ȋ���u�vJ�r�$�b u�+�;��/�#t�(@�~r�pH�U��ƛ��4Jדn0��(��5P\�����)EP�tm��H7/࿒�>��cF����̨V|�}c^7Y�h{�k��?����miXoΣ7ų�Y���UG��x򟳘�:�FT�)��+����T�x      g   B   x��� !����N�^迎#[#�cm��"Iy���d��ڜV�+�`��������$���      i      x������ � �      e   �  x�u�9��0Ec��hpE�,�h��F���U=����Ѵ�^�L-$�{�ɡbn%�O�pcdT@y��j'�]L��i�����p#]�9	(�>{��-�^Ro��4�9�K$(�;��.�x�i鳀!��&�"-Q��4o�Ʃ��8,���-�4�;خ��ӭ5��1AG��^�%�\�]W+䫘C�#~��IW�g���M��T��X�"V�+���>z�i��$ {�)�,_�ҷ��s	�m�H�EFW�P� bY���f/��/�f��@!��|�g�����r��� ��yŢ�6i����3ᚣ����BϨ��o����
k,�jFp����ua�w?�Oѓ�!,"���~UJ����JZ�`J�՚g��G�ٰ ��'��N��~�>��[&M��	�F�bP�O���f^v���@=1���W�A�k�����?|�ۡ      ]   �   x���1�0��99Ew��ϱ��+;'�RU-]�}	�H�[��3�~9�����i^]�vT���%i)6��)��Dwğ�3�P1�zv��� (��$d���yTf��)R�Ht�tY��w'���.�I	ZT���g�aF�N����C�      _   �   x��ͻ
�0���~
��F�e��e��	����`:��?����-?���^�=j�m��U5�v�# ���A)�G���[è�6�|����c+$�${ɿ�_exK~��r?(�b0�ĥ�C_�S	��̄~H��Z���G      W   '   x�3�tL����2�tLO�+�2�t�,���K����� �&      Y      x������ � �      U   *  x�m��n�0E��W�����z~a��DH�Il�v:��צ.E��N"��J���tYs�d����n�]���eO[_r�h�k0T,	Xx	�0[0���j�����d6���NS�w� 5)���3 ���~���b�hHrT�1Y^��1��i��w-�}xɵ#�R�
d�v��}7/�]6�U$��Z�y�u60�_k�E��DtC��a��z
�I;���0�L�Q;
=ƊwQ���'�����ȇ־0w��pb��<���3@hK���=��&�܇�oF` DŚ2@[�ܴ��;D���I�0���I�`�J�@чI�磟�;��}i�}� 1f@Tl �%����;�
,K_�����S�d}|z�W*���w�'il�s���KF'�ǧY�|e����\4or����4�B���IiV���:���z^7�2N ��'^`T�A.�K���~Z��G;díY��<Ky��ڤ���c&�/�`�S�1D?d;"�`z����8��ʛ��͵x��Θ{�4�ϩ�Q�i"�������ר�P      l   R  x�]�;n%!�ج���k���k�(��L[�-M�Dr�^
��<WdgQww�pqd/\�z����B��o������C�.\iL��,�������Z�s��o��p3_��M@s"&�ص W	�(��F{�W�9�� {a<�.c������R�cN�zDWב3��i��ٓ��F�1O5D��V{�R��gX�j���)y,e�?H�7B��$"q��V]�x1[���L$�Q�� &��(n��LR�o���nšAǘ�}zw�J�~����ym�S�"5��n�2R�پl��<Iк��0�V�ۣ�h�_���x�܂W���Y�w�־ �ч      c   �  x���MS�@�ϓ_1w�q�{&��!eLX�]��Peܢt�ݭ�_�3	ĉ �ҕ
��o7�t�HH��<L�b��W���c����`(Q�Ju
��DBJ�6�x"���CF��X�9����j���k�P�Z���z��T_�N!�B:A�h#�X�H�Z ��c( �*PK��b2f�����q�ϟs���|���T�S����/����"1�$A�����%���$����6��g$��k���l��[&*/�`2�m�	�E�@���b�w<��ݱX��B�TƍE�6c�n&^�X7�#�E~��5��e�Y��|t1���
��%62 A�R�u�y(�4Ǎ�j�����3�]:���k"2zk,
LS�����w����C�D�P�Z�F�|�T�O��ћ�.]g�����"H�Bv(QRP�KV��m�<+ ���Z�-�wkˇ��n�w5���o2>-y�=����Ѵ��"�X���*&p���uU�������O�ѣ�	hab��) l�!?��:{\����咻f(��;�NҀ􁬼Э�s�U�Z�#�=q��W�cwa�V�u����_����|�.s�3wC����M���L`�0zG�l�u�p�������y�[i׆�����a���$ww*-G;�����r+{'��?��5�(p��w�ڐ�J���v���:�В�G�9�/�t�� ����ؾ�y&� �4�s�      k      x������ � �      S   �   x�U�K�0D��a��w6ikZ����ޞ�j�X���
�`ف�#�g<��i�@Ѳ{��F��s�z�RYMs �<���_��?ٔ�,�;�K �*�Ѱ#���}"Tǝt<�R��O��iIE������U�lW�'R��袶��N��a��8 �T�c�      Q   ]  x����r�(���Sd?����Y��Rl��]|$9u��HQ$��Fꏾ�#8��n��4}��xB���z���ŋP/B>�:Iy�x�d�/�O�-����ݻ克o\W���R�(m#J�����p#$��j�@W5���m=�uߥ][�q���ʒ J(ZQrA����mU7)l�S7�JQ[J|�t��4�(P���0+����'���:voJ�	-R��
�a�����#��Ŗ�F/�+�,��WM}��~]u�8?��Z?��՗�d�i V[�=$�S� V��֡�,X���O�u���G$sB�p��:��m��|l�Xn��M��C�U7�ݧ�X���7���u�8��"9��b0J*�b��4m����-B�f�m�"� Q�y����TWw~��sQ*�X�\�,ש����FD+S����=
�A+ځQ����e���ַ�~�����S�Ǣg�<p=�|:�oJ0�M* 1���h�E�����2�(7�_��P��$Fw�:���{�HN)�00�D�<�$\耥*B�TpE�P�;�푥�P��e8:����}��K���A(B��<��0���$��x�Z��;So�@9�ʮ�g��	�(��ӹR� r ',`@����T�OAШ�)��g���'�B�� �I�n�@������(N�O�����{Z���v�P
Q��d5���2l۽���=�7ƿ��+�H�����%
�%bup!f�!�DAf(C4���!�K4�#��*B9l������"��r��6&Al�Y���Cb�]$��
[�R����B�Q0ʹ�*߯���E��:��Կ��k �IZ̿�����tK�N      q      x������ � �      n   ?   x�3�tJ,�L�4�30@"��t�u���LL�L�qsq��f��RfL� ��      p   �  x���oo�0�_;���S��;�:�5tl�P�*M�6L@K+��s�8�&E��<:��|�p4���#"@��c��"$,d, \
!> q��-�AJ�&W��� s�b����jÅ�U%�t���d�EQ璎�ۗ5�6����Q���H���j��4����#��@[X�� �(�Vp�[.�otu �Zd ��%2��,�e�2��,����d��4�X��"s�@q�\�E��P��K�S�AB�&�y�Lj�Or��ף�a�Ͻ��`i��D^ڽ���b�C����ɼ�R����)*5��k�[.�Ƹ2״:$:�*P��b~��$&i��{}J~[b#Iu�/��_wY����=�>�Bb�*�@�Wo\,���5��Y�?eR�Y"�$���m��n��6�H�y�r�֏릹�Ud�c{��+G����Y��9]�ے��?b��t��سZJ�۫�t�|y�[]XX#u�����`���DS4�׳�Gw�D�8�^E�������D�      a   �  x��X]s�F}^��������ް�m�mf�>#@�Au�N�{�]	i"��ҊY�=��s���N&�}���]r۾"�{�$��(A6d
��W�k1��aq�Z���tR>�wI�����
"%�0N�w��h���9}Ȟ�����)y���S��m���K:���I:�o�ۇO���[�8�v���ePBP.b�,
�Ҍ�7Lq��$Yd���l�`�pG߹���w����5Q�j�^?�a�H��X�y�J��^�����Ě��!���_׳W��U=�*y
֐����e0͕1y�,���z�>/����%/t����ސ�]�\v�
1ܖ����k�jYx��C�e�l �Ե*w���~��2/{n��}�0O_s�k ��1ׁ�L�<��L����5^���r��%��v��4���p4P��`p��8�>���/@�Z<RU�b�U�<D�H�0�F2��5Y�W����&k��%�|��&��n�\��{� oC�C+���*$��t�,�	}�fY��
ad4p ����o���q�q��P^�|�V=]O`��xEH�#�t���%�l�nͲl�v�ۻ���Cz��_��|Kzm��]�<Ь@�GB�����}/�!�7��u�����G�Π��5s���e��>`���>4�4�4ډ���@95��hlA��P��m���GD��=��'�D��_"��*�J�7>�k�����/t>^㞟�.qg�y�><>}9���2�L��$ױp쵤�!4�D�W�3���ET�Y��j(�Q� y�BGyB�8O[��j�n�+7]�^w������:����
�^vJS4*�A>��S�����e�� �so������5�~���O&�!	�D�khQhE;�2�i�W�y>^-Ƙ�M�=-�-�ɦ!qQ���@��/�:S�9JF��F��B�GAhlFk���~5� ��k�<���Ǝw��BԊ���$+`��ƍ�ci¤w�I��l*�3���� 'QڗD�ǽ�e���|P��:�V]}ޮ��u�>��`�Dd�i�%��^�j�ּ��YA�	
)�'�#��3k���PM	~`����[H��`\��'��3��Z�Xm�P%5�����H2�Y$3Γ�d%�����d1�Ź?��m�x7�0{�������0!6Q]jR�{H�Q�b#���*�c�^|{��:,�&��*]�[��d���fKG�;\��P�}~���v�P�cV��B���}��-��Ǌp�{��?�s@X�uW��oQ��6!X]��a4k41���)DZ*)h4��LV��rV���B�/������+Wb��{�O4m`"��eH��v���^w�n;��_sƱ+��KDx�N�֒J���p~ T�_�Ҁ��AQ�]�f��!Z"M�p��t�?�8���.<��J�n���y�ᥔl�Jq����8���
G��}@H�?k�C��H�X��'�A�=K=w&m���/��D[S�@8+���5I�k��5�{WbϨ�����N�味c��7��d��}��ɥ �z=��pt0�Ũa��]�_��k�jx���sdȑæ�ݨ0GG��)�a�08��ZK�����GA���ő�s<�-��R����.�O<P��ө�Ґ���ݾ�;�n-�ZUL#��
_;(�oX�o�js �m�'Y}���(�)��a%sY)s��g�#s��q���q^�wF%�я���L�b ~NNN��QË     