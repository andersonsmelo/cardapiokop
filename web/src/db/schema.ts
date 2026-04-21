import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').unique().notNull(),
    name: text('name').notNull(),
    order: integer('order').notNull(),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: text('price').notNull(),
    imageUrl: text('image_url'),
    categoryId: uuid('category_id').references(() => categories.id).notNull(),
    featured: boolean('featured').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
