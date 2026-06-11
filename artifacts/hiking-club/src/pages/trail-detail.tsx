import { useGetTrail, getGetTrailQueryKey, useListEvents } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Map, Mountain, Route as RouteIcon, Activity, Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getDifficultyColor } from "./trails";

export default function TrailDetail() {
  const params = useParams();
  const trailId = parseInt(params.id || "0", 10);
  
  const { data: trail, isLoading, isError } = useGetTrail(trailId, { 
    query: { enabled: !!trailId, queryKey: getGetTrailQueryKey(trailId) } 
  });
  
  const { data: events } = useListEvents();
  
  const relatedEvents = events?.filter(e => e.trailId === trailId) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="w-full h-64 md:h-96 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !trail) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Trail not found</h2>
        <Button asChild><Link href="/trails">Return to Trails</Link></Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      {/* Hero Image Section */}
      <div className="relative w-full h-64 md:h-[400px] bg-secondary">
        {trail.imageUrl ? (
          <img 
            src={trail.imageUrl} 
            alt={trail.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mountain className="h-24 w-24 text-secondary-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur hover:bg-background" asChild>
            <Link href="/trails">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trails
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={`uppercase tracking-wider font-bold shadow-sm ${getDifficultyColor(trail.difficulty)} border-none`}>
                  {trail.difficulty}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 bg-muted px-2.5 py-0.5 rounded-full">
                  <Map className="h-3.5 w-3.5" />
                  {trail.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                {trail.name}
              </h1>
            </div>

            {/* Key Stats Bar */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-border/50">
              <div className="flex flex-col gap-1 pr-6 border-r border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><RouteIcon className="h-4 w-4"/> Distance</span>
                <span className="text-xl font-bold text-foreground">{trail.distanceMiles} <span className="text-sm font-normal text-muted-foreground">miles</span></span>
              </div>
              {trail.elevationFt !== null && (
                <div className="flex flex-col gap-1 pr-6 border-r border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Activity className="h-4 w-4"/> Elevation</span>
                  <span className="text-xl font-bold text-foreground">{trail.elevationFt} <span className="text-sm font-normal text-muted-foreground">ft gain</span></span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4"/> Est. Time</span>
                <span className="text-xl font-bold text-foreground">{Math.max(1, Math.round(trail.distanceMiles / 2))} <span className="text-sm font-normal text-muted-foreground">hours</span></span>
              </div>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold mt-8 mb-4">About this trail</h3>
              <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                {trail.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 pt-2">
            <Card className="border-border/50 shadow-sm bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Group Hikes
                </h3>
                {relatedEvents.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {relatedEvents.map(event => (
                      <Link key={event.id} href={`/events/${event.id}`} className="block group">
                        <div className="p-3 rounded-lg bg-background border border-border/50 transition-colors group-hover:border-primary/50 group-hover:shadow-sm">
                          <div className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{event.title}</div>
                          <div className="text-sm text-muted-foreground flex justify-between items-center">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No official events scheduled for this trail right now. Why not organize one?
                  </p>
                )}
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
