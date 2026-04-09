-- ============================================================
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- 1. Create the albums table
create table if not exists public.albums (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  owner_id   uuid references auth.users(id) on delete cascade,
  cover_url  text,
  created_at timestamptz default now() not null
);

alter table public.albums enable row level security;

create policy "Users can read own albums"
  on public.albums for select using (auth.uid() = owner_id);

create policy "Users can insert own albums"
  on public.albums for insert with check (auth.uid() = owner_id);

create policy "Users can update own albums"
  on public.albums for update using (auth.uid() = owner_id);

create policy "Users can delete own albums"
  on public.albums for delete using (auth.uid() = owner_id);

-- 2. Create the album_photos table
create table if not exists public.album_photos (
  id            uuid default gen_random_uuid() primary key,
  album_id      uuid references public.albums(id) on delete cascade not null,
  url           text not null,
  uploader_id   uuid references auth.users(id) on delete set null,
  uploader_name text,
  date_taken    timestamptz,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz default now() not null
);

-- 2. Row-level security
alter table public.album_photos enable row level security;

create policy "Anyone can read photos"
  on public.album_photos for select using (true);

create policy "Authenticated users can insert"
  on public.album_photos for insert
  with check (auth.uid() is not null);

create policy "Users can delete own photos"
  on public.album_photos for delete
  using (auth.uid() = uploader_id);

-- 3. Index for fast album lookups
create index if not exists idx_album_photos_album_id
  on public.album_photos(album_id);

-- ============================================================
-- Storage bucket — run in Supabase Dashboard → Storage
-- Create a bucket named "photos" and set it to Public
-- Then add these storage policies in Storage → Policies:
-- ============================================================

-- Allow authenticated users to upload
-- (Storage → photos bucket → New policy → For INSERT)
-- Policy: auth.role() = 'authenticated'

-- Allow public read
-- (Storage → photos bucket → New policy → For SELECT)
-- Policy: true
