import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, trailsTable } from "../db/index.js";
import {
  ListTrailsQueryParams,
  ListTrailsResponse,
  CreateTrailBody,
  GetTrailParams,
  GetTrailResponse,
  UpdateTrailParams,
  UpdateTrailBody,
  UpdateTrailResponse,
  DeleteTrailParams,
} from "../lib/zod-schemas.js";

const router: IRouter = Router();

router.get("/trails", async (req, res): Promise<void> => {
  const query = ListTrailsQueryParams.safeParse(req.query);
  let rows = await db.select().from(trailsTable).orderBy(trailsTable.createdAt);
  if (query.success && query.data.difficulty) {
    rows = rows.filter((t) => t.difficulty === query.data.difficulty);
  }
  res.json(
    ListTrailsResponse.parse(
      rows.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() })),
    ),
  );
});

router.post("/trails", async (req, res): Promise<void> => {
  const parsed = CreateTrailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [trail] = await db.insert(trailsTable).values(parsed.data).returning();
  res.status(201).json(
    GetTrailResponse.parse({ ...trail, createdAt: trail.createdAt.toISOString() }),
  );
});

router.get("/trails/:id", async (req, res): Promise<void> => {
  const params = GetTrailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [trail] = await db
    .select()
    .from(trailsTable)
    .where(eq(trailsTable.id, params.data.id));
  if (!trail) {
    res.status(404).json({ error: "Trail not found" });
    return;
  }
  res.json(GetTrailResponse.parse({ ...trail, createdAt: trail.createdAt.toISOString() }));
});

router.patch("/trails/:id", async (req, res): Promise<void> => {
  const params = UpdateTrailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTrailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [trail] = await db
    .update(trailsTable)
    .set(parsed.data)
    .where(eq(trailsTable.id, params.data.id))
    .returning();
  if (!trail) {
    res.status(404).json({ error: "Trail not found" });
    return;
  }
  res.json(UpdateTrailResponse.parse({ ...trail, createdAt: trail.createdAt.toISOString() }));
});

router.delete("/trails/:id", async (req, res): Promise<void> => {
  const params = DeleteTrailParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [trail] = await db
    .delete(trailsTable)
    .where(eq(trailsTable.id, params.data.id))
    .returning();
  if (!trail) {
    res.status(404).json({ error: "Trail not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
