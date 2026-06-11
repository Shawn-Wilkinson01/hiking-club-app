import { useListAnnouncements } from "@workspace/api-client-react";
import { Megaphone, Pin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Announcements() {
  const { data: announcements, isLoading, isError } = useListAnnouncements();

  const sortedAnnouncements = announcements?.slice().sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" />
          Club Noticeboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stay up to date with the latest trail conditions, club meetings, and special announcements.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-destructive/10 text-destructive rounded-lg">
          Failed to load announcements.
        </div>
      ) : !sortedAnnouncements?.length ? (
        <div className="text-center py-20 bg-muted/50 rounded-lg border border-dashed border-border">
          <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No announcements</h3>
          <p className="text-muted-foreground">It's quiet... maybe go for a hike?</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAnnouncements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`overflow-hidden transition-shadow hover:shadow-md ${
                announcement.pinned ? "border-primary/50 shadow-sm bg-primary/[0.02]" : "border-border/50 bg-card"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-2xl font-bold leading-tight">
                    {announcement.title}
                  </CardTitle>
                  {announcement.pinned && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20 shrink-0 flex items-center gap-1.5 py-1">
                      <Pin className="h-3 w-3 fill-current" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-2">
                  <Clock className="h-4 w-4" />
                  {new Date(announcement.createdAt).toLocaleDateString(undefined, { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="prose prose-stone dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
                  {announcement.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
