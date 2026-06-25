import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  role: text("role"),
  trailsCompleted: integer("trails_completed").notNull().default(0),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type Member = typeof membersTable.$inferSelect;
export type InsertMember = typeof membersTable.$inferInsert;
