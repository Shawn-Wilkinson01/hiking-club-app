import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health.js";
import trailsRouter from "./trails.js";
import eventsRouter from "./events.js";
import membersRouter from "./members.js";
import announcementsRouter from "./announcements.js";
import dashboardRouter from "./dashboard.js";
import authRouter from "./auth.js";
import { requireAuth, type AuthRequest } from "../lib/auth.js";

const router: IRouter = Router();

// Auth routes (public)
router.use(authRouter);

// Protect all non-GET, non-health mutations
router.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET" || req.method === "HEAD") return next();
  requireAuth(req as AuthRequest, res, next);
});

router.use(healthRouter);
router.use(trailsRouter);
router.use(eventsRouter);
router.use(membersRouter);
router.use(announcementsRouter);
router.use(dashboardRouter);

export default router;
