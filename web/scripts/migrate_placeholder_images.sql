-- Migration: Replace external placehold.co URLs with local placeholder
-- Run this in Supabase SQL Editor

UPDATE products
SET image_url = '/assets/img/placeholder_product.webp'
WHERE image_url LIKE 'https://placehold.co/%';
