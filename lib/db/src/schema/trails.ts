import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trailsTable = pgTable("trails", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  difficulty: text("difficulty").notNull(),
  distanceMiles: real("distance_miles").notNull(),
  elevationFt: integer("elevation_ft"),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrailSchema = createInsertSchema(trailsTable).omit({ id: true, createdAt: true });
export type InsertTrail = z.infer<typeof insertTrailSchema>;
export type Trail = typeof trailsTable.$inferSelect;
