CREATE TABLE IF NOT EXISTS "unicorns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "unicorns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company" varchar(255) NOT NULL,
	"valuation" numeric(10, 1) NOT NULL,
	"date" timestamp NOT NULL,
	"country" varchar(255) NOT NULL,
	"city" varchar(255),
	"industry" varchar(255) NOT NULL,
	"investors" text NOT NULL
);
