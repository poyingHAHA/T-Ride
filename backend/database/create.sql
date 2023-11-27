CREATE TABLE "session" (
  "token" varchar PRIMARY KEY,
  "expire" integer,
  "user_id" integer
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" varchar,
  "password_salt" varchar,
  "password_hash" varchar,
  "driver_data_id" integer,
  "total_order_count" integer,
  "abandon_order_count" integer
);

CREATE TABLE "driver_datas" (
  "id" serial PRIMARY KEY,
  "vehicle_name" varchar,
  "vehicle_plate" varchar,
  "passenger_count" integer
);

CREATE TABLE "driver_orders" (
  "id" serial PRIMARY KEY,
  "user_id" integer,
  "time" integer,
  "start_point" varchar,
  "start_name" varchar,
  "end_point" varchar,
  "end_name" varchar,
  "passenger_count" integer,
  "finished" bool
);

CREATE TABLE "passenger_orders" (
  "id" serial PRIMARY KEY,
  "user_id" integer,
  "time1" integer,
  "time2" integer,
  "people" integer,
  "start_point" varchar,
  "start_name" varchar,
  "end_point" varchar,
  "end_name" varchar,
  "fee" integer,
  "spot_id" integer,
  "finished" bool
);

CREATE TABLE "matches" (
  "id" serial PRIMARY KEY,
  "driver_order_id" integer,
  "passenger_order_id" integer,
  "accepted" bool
);

CREATE TABLE "spots" (
  "id" serial PRIMARY KEY,
  "point" varchar,
  "name" varchar
);

ALTER TABLE "session" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("driver_data_id") REFERENCES "driver_datas" ("id");

ALTER TABLE "driver_orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "passenger_orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "passenger_orders" ADD FOREIGN KEY ("spot_id") REFERENCES "spots" ("id");

ALTER TABLE "matches" ADD FOREIGN KEY ("driver_order_id") REFERENCES "driver_orders" ("id");

ALTER TABLE "matches" ADD FOREIGN KEY ("passenger_order_id") REFERENCES "passenger_orders" ("id");
