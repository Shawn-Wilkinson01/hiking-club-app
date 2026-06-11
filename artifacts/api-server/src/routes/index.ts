import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trailsRouter from "./trails";
import eventsRouter from "./events";
import membersRouter from "./members";
import announcementsRouter from "./announcements";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trailsRouter);
router.use(eventsRouter);
router.use(membersRouter);
router.use(announcementsRouter);
router.use(dashboardRouter);

export default router;
