import { Router, type IRouter } from "express";
import { gte, desc } from "drizzle-orm";
import { db, trailsTable, eventsTable, membersTable, announcementsTable } from "../db/index.js";
import { GetDashboardSummaryResponse } from "../lib/zod-schemas.js";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const now = new Date();

  const [trails, events, members, announcements] = await Promise.all([
    db.select().from(trailsTable),
    db.select().from(eventsTable).where(gte(eventsTable.date, now)),
    db.select().from(membersTable),
    db
      .select()
      .from(announcementsTable)
      .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt))
      .limit(3),
  ]);

  const trailsByDifficulty = { easy: 0, moderate: 0, hard: 0, expert: 0 };
  let totalDistanceMiles = 0;
  for (const t of trails) {
    totalDistanceMiles += t.distanceMiles;
    const d = t.difficulty as keyof typeof trailsByDifficulty;
    if (d in trailsByDifficulty) trailsByDifficulty[d]++;
  }

  res.json(
    GetDashboardSummaryResponse.parse({
      totalTrails: trails.length,
      totalMembers: members.length,
      upcomingEvents: events.length,
      totalDistanceMiles: Math.round(totalDistanceMiles * 10) / 10,
      trailsByDifficulty,
      recentAnnouncements: announcements.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
    }),
  );
});

export default router;
