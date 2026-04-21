-- Migration: Convert local image URLs from .png to .webp
-- Run this in Supabase SQL Editor

UPDATE products
SET image_url = REPLACE(image_url, '.png', '.webp')
WHERE image_url LIKE '/assets/img/%.png';
