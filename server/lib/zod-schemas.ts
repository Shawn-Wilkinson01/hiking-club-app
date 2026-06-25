/**
 * Zod validation schemas derived from the OpenAPI spec.
 * These validate request bodies, query params, path params, and responses.
 */
import * as zod from "zod";

export const HealthCheckResponse = zod.object({ status: zod.string() });

export const ListTrailsQueryParams = zod.object({
  difficulty: zod.coerce.string().optional(),
});

export const ListTrailsResponseItem = zod.object({
  id: zod.number(),
  name: zod.string(),
  difficulty: zod.enum(["easy", "moderate", "hard", "expert"]),
  distanceMiles: zod.number(),
  elevationFt: zod.number().nullish(),
  location: zod.string(),
  description: zod.string(),
  imageUrl: zod.string().nullish(),
  createdAt: zod.string(),
});
export const ListTrailsResponse = zod.array(ListTrailsResponseItem);

export const CreateTrailBody = zod.object({
  name: zod.string(),
  difficulty: zod.enum(["easy", "moderate", "hard", "expert"]),
  distanceMiles: zod.number(),
  elevationFt: zod.number().nullish(),
  location: zod.string(),
  description: zod.string(),
  imageUrl: zod.string().nullish(),
});

export const GetTrailParams = zod.object({ id: zod.coerce.number() });
export const GetTrailResponse = zod.object({
  id: zod.number(),
  name: zod.string(),
  difficulty: zod.enum(["easy", "moderate", "hard", "expert"]),
  distanceMiles: zod.number(),
  elevationFt: zod.number().nullish(),
  location: zod.string(),
  description: zod.string(),
  imageUrl: zod.string().nullish(),
  createdAt: zod.string(),
});

export const UpdateTrailParams = zod.object({ id: zod.coerce.number() });
export const UpdateTrailBody = zod.object({
  name: zod.string().optional(),
  difficulty: zod.enum(["easy", "moderate", "hard", "expert"]).optional(),
  distanceMiles: zod.number().optional(),
  elevationFt: zod.number().nullish(),
  location: zod.string().optional(),
  description: zod.string().optional(),
  imageUrl: zod.string().nullish(),
});
export const UpdateTrailResponse = GetTrailResponse;
export const DeleteTrailParams = zod.object({ id: zod.coerce.number() });

export const ListEventsResponseItem = zod.object({
  id: zod.number(),
  title: zod.string(),
  date: zod.string(),
  location: zod.string(),
  description: zod.string(),
  trailId: zod.number().nullish(),
  trailName: zod.string().nullish(),
  attendeeCount: zod.number(),
  imageUrl: zod.string().nullish(),
  createdAt: zod.string(),
});
export const ListEventsResponse = zod.array(ListEventsResponseItem);

export const CreateEventBody = zod.object({
  title: zod.string(),
  date: zod.string(),
  location: zod.string(),
  description: zod.string(),
  trailId: zod.number().nullish(),
  attendeeCount: zod.number().optional(),
  imageUrl: zod.string().nullish(),
});
export const GetEventParams = zod.object({ id: zod.coerce.number() });
export const GetEventResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  date: zod.string(),
  location: zod.string(),
  description: zod.string(),
  trailId: zod.number().nullish(),
  trailName: zod.string().nullish(),
  attendeeCount: zod.number(),
  imageUrl: zod.string().nullish(),
  createdAt: zod.string(),
});
export const UpdateEventParams = zod.object({ id: zod.coerce.number() });
export const UpdateEventBody = zod.object({
  title: zod.string().optional(),
  date: zod.string().optional(),
  location: zod.string().optional(),
  description: zod.string().optional(),
  trailId: zod.number().nullish(),
  attendeeCount: zod.number().optional(),
  imageUrl: zod.string().nullish(),
});
export const UpdateEventResponse = GetEventResponse;
export const DeleteEventParams = zod.object({ id: zod.coerce.number() });

export const ListMembersResponseItem = zod.object({
  id: zod.number(),
  name: zod.string(),
  bio: zod.string().nullish(),
  avatarUrl: zod.string().nullish(),
  role: zod.string().nullish(),
  trailsCompleted: zod.number().optional(),
  joinedAt: zod.string(),
});
export const ListMembersResponse = zod.array(ListMembersResponseItem);

export const CreateMemberBody = zod.object({
  name: zod.string(),
  bio: zod.string().nullish(),
  avatarUrl: zod.string().nullish(),
  role: zod.string().nullish(),
  trailsCompleted: zod.number().optional(),
});
export const GetMemberParams = zod.object({ id: zod.coerce.number() });
export const GetMemberResponse = zod.object({
  id: zod.number(),
  name: zod.string(),
  bio: zod.string().nullish(),
  avatarUrl: zod.string().nullish(),
  role: zod.string().nullish(),
  trailsCompleted: zod.number().optional(),
  joinedAt: zod.string(),
});

export const ListAnnouncementsResponseItem = zod.object({
  id: zod.number(),
  title: zod.string(),
  content: zod.string(),
  pinned: zod.boolean().optional(),
  createdAt: zod.string(),
});
export const ListAnnouncementsResponse = zod.array(ListAnnouncementsResponseItem);

export const CreateAnnouncementBody = zod.object({
  title: zod.string(),
  content: zod.string(),
  pinned: zod.boolean().optional(),
});
export const GetAnnouncementParams = zod.object({ id: zod.coerce.number() });
export const GetAnnouncementResponse = zod.object({
  id: zod.number(),
  title: zod.string(),
  content: zod.string(),
  pinned: zod.boolean().optional(),
  createdAt: zod.string(),
});
export const DeleteAnnouncementParams = zod.object({ id: zod.coerce.number() });

export const GetDashboardSummaryResponse = zod.object({
  totalTrails: zod.number(),
  totalMembers: zod.number(),
  upcomingEvents: zod.number(),
  totalDistanceMiles: zod.number().optional(),
  trailsByDifficulty: zod.object({
    easy: zod.number(),
    moderate: zod.number(),
    hard: zod.number(),
    expert: zod.number(),
  }),
  recentAnnouncements: zod.array(
    zod.object({
      id: zod.number(),
      title: zod.string(),
      content: zod.string(),
      pinned: zod.boolean().optional(),
      createdAt: zod.string(),
    }),
  ),
});
