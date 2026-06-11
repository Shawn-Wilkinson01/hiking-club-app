import { useListEvents } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Calendar, MapPin, Users, ArrowRight, Clock, Plus, Badge } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Events() {
  const { data: events, isLoading, isError } = useListEvents();

  const sortedEvents = events?.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Upcoming Events
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Join a group hike and meet fellow adventurers.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
           <Link href="/admin">
             <Plus className="h-4 w-4 mr-2" />
             Propose Event
           </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                <Skeleton className="h-32 w-full md:w-48 rounded-lg shrink-0" />
                <div className="space-y-4 w-full">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-destructive/10 text-destructive rounded-lg">
          Failed to load events.
        </div>
      ) : !sortedEvents?.length ? (
        <div className="text-center py-20 bg-muted/50 rounded-lg border border-dashed border-border">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming events</h3>
          <p className="text-muted-foreground">Check back later or organize one yourself!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedEvents.map((event) => {
            const date = new Date(event.date);
            const isPast = date < new Date();
            
            return (
              <Card key={event.id} className={`overflow-hidden border-border/50 hover:shadow-md transition-all ${isPast ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex flex-col md:flex-row">
                  {/* Date Block */}
                  <div className="bg-muted md:w-48 p-6 flex flex-row md:flex-col items-center md:items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-border gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-destructive uppercase tracking-wider">{date.toLocaleDateString(undefined, { month: 'short' })}</div>
                      <div className="text-4xl font-black text-foreground">{date.getDate()}</div>
                      <div className="text-sm text-muted-foreground">{date.getFullYear()}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-background px-3 py-1 rounded-full shadow-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {/* Content Block */}
                  <div className="p-6 flex-1 flex flex-col justify-center relative">
                    {event.trailName && (
                      <div className="absolute top-6 right-6 hidden sm:flex">
                        <Link href={`/trails/${event.trailId}`}>
                          <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20">
                            Trail: {event.trailName}
                          </Badge>
                        </Link>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-2 pr-0 sm:pr-24">{event.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        {event.attendeeCount} going
                      </span>
                    </div>
                    
                    <p className="text-foreground/80 line-clamp-2 mb-6">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto">
                      <Button variant="default" className="w-full sm:w-auto" asChild>
                        <Link href={`/events/${event.id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
