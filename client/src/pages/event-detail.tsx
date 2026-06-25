import { useGetEvent, getGetEventQueryKey } from "@/api";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, MapPin, Users, Map, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventDetail() {
  const params = useParams();
  const eventId = parseInt(params.id || "0", 10);
  
  const { data: event, isLoading, isError } = useGetEvent(eventId, { 
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) } 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="w-full h-64 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Event not found</h2>
        <Button asChild><Link href="/events">Return to Events</Link></Button>
      </div>
    );
  }

  const date = new Date(event.date);

  return (
    <div className="w-full pb-16">
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-background rounded-2xl shadow-sm border border-border/50 p-6 flex flex-col items-center justify-center min-w-[140px] shrink-0">
              <div className="text-lg font-bold text-destructive uppercase tracking-wider">{date.toLocaleDateString(undefined, { month: 'long' })}</div>
              <div className="text-6xl font-black text-foreground my-1">{date.getDate()}</div>
              <div className="text-muted-foreground font-medium">{date.getFullYear()}</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Official Hike</Badge>
                {date < new Date() && (
                  <Badge variant="outline" className="text-muted-foreground">Past Event</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-5 w-5 text-primary" />
                  {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-5 w-5 text-primary" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-5 w-5 text-primary" />
                  {event.attendeeCount} going
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <section className="prose prose-stone dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="h-6 w-6 text-muted-foreground" />
                Event Details
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line mt-4">
                {event.description}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            {event.trailId && (
              <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                <CardHeader className="bg-muted/50 pb-4">
                  <CardTitle className="text-base flex items-center gap-2 text-foreground">
                    <Map className="h-5 w-5 text-primary" />
                    Associated Trail
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="font-semibold text-lg mb-1">{event.trailName}</p>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/trails/${event.trailId}`}>View Trail Map & Info</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold text-lg">Join this hike</h3>
                <p className="text-sm text-muted-foreground">Log in to RSVP and let the organizer know you're coming.</p>
                <Button className="w-full font-bold">RSVP Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
