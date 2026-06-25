import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  trailsTable,
  eventsTable,
  membersTable,
  announcementsTable,
  usersTable,
} from "../server/db/schema/index.js";
import { hashPassword } from "../server/lib/auth.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  await db.insert(trailsTable).values([
    {
      name: "Eagle Peak Summit",
      difficulty: "hard",
      distanceMiles: 8.4,
      elevationFt: 3200,
      location: "Sierra Nevada, CA",
      description:
        "A demanding climb through pine forests and granite outcroppings to a stunning 360-degree summit view.",
    },
    {
      name: "Willow Creek Loop",
      difficulty: "easy",
      distanceMiles: 3.2,
      elevationFt: 340,
      location: "Marin County, CA",
      description:
        "A peaceful loop through coastal redwoods following a babbling creek. Perfect for families and beginners.",
    },
    {
      name: "Devil's Backbone Ridge",
      difficulty: "expert",
      distanceMiles: 14.1,
      elevationFt: 5100,
      location: "Rocky Mountain NP, CO",
      description:
        "One of the most technical routes in the region, traversing a narrow exposed ridge with sheer drop-offs on both sides.",
    },
    {
      name: "Meadow Springs Loop",
      difficulty: "moderate",
      distanceMiles: 6.7,
      elevationFt: 1100,
      location: "Blue Ridge Mountains, VA",
      description:
        "A versatile moderate trail winding through open meadows and seasonal wildflower blooms.",
    },
    {
      name: "Fernwood Canyon",
      difficulty: "easy",
      distanceMiles: 2.8,
      elevationFt: 210,
      location: "Big Sur, CA",
      description:
        "A short, beautiful hike through a lush fern-draped canyon ending at a 60-foot waterfall.",
    },
    {
      name: "Thunder Basin Traverse",
      difficulty: "moderate",
      distanceMiles: 9.3,
      elevationFt: 1850,
      location: "Cascade Range, WA",
      description:
        "A spectacular point-to-point trail crossing a volcanic plateau with views of three major peaks.",
    },
  ]);
  console.log("  Trails seeded");

  await db.insert(membersTable).values([
    {
      name: "Sarah Chen",
      bio: "Ultramarathoner and trail guide with 15 years of backcountry experience across four continents.",
      role: "Club President",
      trailsCompleted: 142,
    },
    {
      name: "Marcus Rivera",
      bio: "Weekend hiker turned mountain enthusiast. Loves summit photography and sharing trail beta with newcomers.",
      role: "Events Coordinator",
      trailsCompleted: 87,
    },
    {
      name: "Priya Nair",
      bio: "Botanist by day, ridge-walker by weekend. Specializes in identifying native plants along the trail.",
      role: "Member",
      trailsCompleted: 63,
    },
    {
      name: "Tom Briggs",
      bio: "Retired park ranger with encyclopedic knowledge of Pacific Crest Trail conditions and history.",
      role: "Trail Steward",
      trailsCompleted: 218,
    },
    {
      name: "Devon Okafor",
      bio: "First-generation hiker passionate about making outdoor spaces welcoming for everyone.",
      role: "Community Lead",
      trailsCompleted: 51,
    },
  ]);
  console.log("  Members seeded");

  await db.insert(eventsTable).values([
    {
      title: "Eagle Peak Summer Ascent",
      date: new Date("2026-06-20T07:00:00Z"),
      location: "Sierra Nevada, CA",
      description:
        "Our most anticipated event of the season — a full-day guided ascent of Eagle Peak.",
      trailId: 1,
      attendeeCount: 14,
    },
    {
      title: "Willow Creek Family Hike",
      date: new Date("2026-06-28T09:00:00Z"),
      location: "Marin County, CA",
      description:
        "A welcoming outing for families, first-timers, and anyone who wants a gentle morning among the redwoods.",
      trailId: 2,
      attendeeCount: 22,
    },
    {
      title: "Club Meetup & Gear Swap",
      date: new Date("2026-07-05T11:00:00Z"),
      location: "Riverside Park Pavilion",
      description:
        "No hike this week — just community! Bring used gear to swap or sell, share trail reports, and welcome new members.",
      attendeeCount: 35,
    },
  ]);
  console.log("  Events seeded");

  await db.insert(announcementsTable).values([
    {
      title: "Summer Season Kickoff — New Trail Ratings Published",
      content:
        "We have updated trail difficulty ratings across our entire catalog based on feedback from spring outings.",
      pinned: true,
    },
    {
      title: "Welcome to Our Newest Members",
      content:
        "Please give a warm welcome to the 12 new members who joined us this spring! We look forward to sharing the trails with you.",
      pinned: false,
    },
  ]);
  console.log("  Announcements seeded");

  await db
    .insert(usersTable)
    .values({
      username: "admin",
      email: "admin@hikingclub.com",
      passwordHash: await hashPassword("admin123"),
      role: "admin",
    })
    .onConflictDoNothing();
  console.log("  Admin user seeded (username: admin / password: admin123)");

  await pool.end();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
