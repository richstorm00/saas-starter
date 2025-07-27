import { pgTable, uuid, varchar, timestamp, text, boolean, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Organizations table
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Organization memberships
export const organizationMemberships = pgTable('organization_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique().notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique().notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  priceId: varchar('price_id', { length: 255 }).notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Plans
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  interval: varchar('interval', { length: 20 }).notNull(),
  features: text('features').array(),
  maxUsers: integer('max_users').notNull(),
  maxProjects: integer('max_projects').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMemberships),
  subscriptions: many(subscriptions),
}));

export const organizationMembershipsRelations = relations(organizationMemberships, ({ one }) => ({
  user: one(users),
  organization: one(organizations),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrganizationMembership = typeof organizationMemberships.$inferSelect;
export type NewOrganizationMembership = typeof organizationMemberships.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;