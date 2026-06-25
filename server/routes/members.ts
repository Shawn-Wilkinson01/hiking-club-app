import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, membersTable } from "../db/index.js";
import {
  ListMembersResponse,
  CreateMemberBody,
  GetMemberParams,
  GetMemberResponse,
} from "../lib/zod-schemas.js";

const router: IRouter = Router();

router.get("/members", async (_req, res): Promise<void> => {
  const rows = await db.select().from(membersTable).orderBy(membersTable.joinedAt);
  res.json(
    ListMembersResponse.parse(
      rows.map((m) => ({ ...m, joinedAt: m.joinedAt.toISOString() })),
    ),
  );
});

router.post("/members", async (req, res): Promise<void> => {
  const parsed = CreateMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.insert(membersTable).values(parsed.data).returning();
  res.status(201).json(
    GetMemberResponse.parse({ ...member, joinedAt: member.joinedAt.toISOString() }),
  );
});

router.get("/members/:id", async (req, res): Promise<void> => {
  const params = GetMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [member] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.id, params.data.id));
  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  res.json(GetMemberResponse.parse({ ...member, joinedAt: member.joinedAt.toISOString() }));
});

export default router;
