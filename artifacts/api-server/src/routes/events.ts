import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, eventsTable, trailsTable } from "@workspace/db";
import {
  ListEventsResponse,
  CreateEventBody,
  GetEventParams,
  GetEventResponse,
  UpdateEventParams,
  UpdateEventBody,
  UpdateEventResponse,
  DeleteEventParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function enrichEvent(event: typeof eventsTable.$inferSelect) {
  let trailName: string | null = null;
  if (event.trailId) {
    const [trail] = await db.select().from(trailsTable).where(eq(trailsTable.id, event.trailId));
    trailName = trail?.name ?? null;
  }
  return {
    ...event,
    date: event.date.toISOString(),
    createdAt: event.createdAt.toISOString(),
    trailName,
  };
}

router.get("/events", async (_req, res): Promise<void> => {
  const rows = await db.select().from(eventsTable).orderBy(eventsTable.date);
  const enriched = await Promise.all(rows.map(enrichEvent));
  res.json(ListEventsResponse.parse(enriched));
});

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = { ...parsed.data, date: new Date(parsed.data.date) };
  const [event] = await db.insert(eventsTable).values(data).returning();
  res.status(201).json(GetEventResponse.parse(await enrichEvent(event)));
});

router.get("/events/:id", async (req, res): Promise<void> => {
  const params = GetEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(GetEventResponse.parse(await enrichEvent(event)));
});

router.patch("/events/:id", async (req, res): Promise<void> => {
  const params = UpdateEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.date) data.date = new Date(parsed.data.date);
  const [event] = await db.update(eventsTable).set(data).where(eq(eventsTable.id, params.data.id)).returning();
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(UpdateEventResponse.parse(await enrichEvent(event)));
});

router.delete("/events/:id", async (req, res): Promise<void> => {
  const params = DeleteEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [event] = await db.delete(eventsTable).where(eq(eventsTable.id, params.data.id)).returning();
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
