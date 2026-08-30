-- SQL Schema for Sabta Trading Co. LLC Website CMS
-- Paste this script into the Supabase SQL Editor to set up your database.

-- 1. Create categories table
create table if not exists categories (
  slug text primary key,
  name text not null,
  short_description text not null,
  description text not null,
  icon text not null,
  color text not null,
  brand_note text,
  page_range_start integer not null,
  page_range_end integer not null,
  "order" integer default 0,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create products table
create table if not exists products (
  id text primary key,
  category_slug text references categories(slug) on delete cascade not null,
  slug text not null,
  name text not null,
  grade text,
  standard text,
  description text not null,
  image text,
  images text[] default '{}',
  featured boolean default false not null,
  hero_carousel boolean default false not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2b. Migration: add new columns if this script is re-run on an existing
-- database (safe/idempotent — does nothing if the columns already exist).
alter table categories add column if not exists image text;
alter table products add column if not exists hero_carousel boolean default false not null;

-- 3. Create site_settings table
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table site_settings enable row level security;

-- 5. Create Policies for public read access
drop policy if exists "Allow public read access to categories" on categories;
create policy "Allow public read access to categories" on categories for select using (true);

drop policy if exists "Allow public read access to products" on products;
create policy "Allow public read access to products" on products for select using (true);

drop policy if exists "Allow public read access to site_settings" on site_settings;
create policy "Allow public read access to site_settings" on site_settings for select using (true);

-- 6. Create Policies for authenticated admin write access
drop policy if exists "Allow admin write access to categories" on categories;
create policy "Allow admin write access to categories" on categories for all to authenticated using (true);

drop policy if exists "Allow admin write access to products" on products;
create policy "Allow admin write access to products" on products for all to authenticated using (true);

drop policy if exists "Allow admin write access to site_settings" on site_settings;
create policy "Allow admin write access to site_settings" on site_settings for all to authenticated using (true);
