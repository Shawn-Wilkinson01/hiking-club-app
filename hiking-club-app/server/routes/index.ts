import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import trailsRouter from "./trails.js";
import eventsRouter from "./events.js";
import membersRouter from "./members.js";
import announcementsRouter from "./announcements.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trailsRouter);
router.use(eventsRouter);
router.use(membersRouter);
router.use(announcementsRouter);
router.use(dashboardRouter);

export default router;
