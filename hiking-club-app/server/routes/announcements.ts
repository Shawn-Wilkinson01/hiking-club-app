import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, announcementsTable } from "../db/index.js";
import {
  ListAnnouncementsResponse,
  CreateAnnouncementBody,
  GetAnnouncementParams,
  GetAnnouncementResponse,
  DeleteAnnouncementParams,
} from "../lib/zod-schemas.js";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt));
  res.json(
    ListAnnouncementsResponse.parse(
      rows.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
    ),
  );
});

router.post("/announcements", async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ann] = await db.insert(announcementsTable).values(parsed.data).returning();
  res.status(201).json(
    GetAnnouncementResponse.parse({ ...ann, createdAt: ann.createdAt.toISOString() }),
  );
});

router.get("/announcements/:id", async (req, res): Promise<void> => {
  const params = GetAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [ann] = await db
    .select()
    .from(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id));
  if (!ann) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }
  res.json(GetAnnouncementResponse.parse({ ...ann, createdAt: ann.createdAt.toISOString() }));
});

router.delete("/announcements/:id", async (req, res): Promise<void> => {
  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [ann] = await db
    .delete(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();
  if (!ann) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
