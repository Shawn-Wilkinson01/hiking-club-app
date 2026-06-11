import { useListMembers } from "@workspace/api-client-react";
import { Users, Award, Map, Compass } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Members() {
  const { data: members, isLoading, isError } = useListMembers();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12 max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Club Directory
        </h1>
        <p className="text-muted-foreground text-lg">
          Meet the hikers, guides, and weekend warriors that make this community great.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="text-center">
              <CardHeader className="items-center pb-2">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-destructive/10 text-destructive rounded-lg">
          Failed to load members directory.
        </div>
      ) : !members?.length ? (
        <div className="text-center py-20 bg-muted/50 rounded-lg border border-dashed border-border">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="text-center hover:shadow-md transition-shadow border-border/50 group bg-card overflow-hidden relative">
              <div className="h-20 bg-muted w-full absolute top-0 left-0 z-0"></div>
              <CardHeader className="items-center pb-2 relative z-10 pt-10">
                <Avatar className="h-24 w-24 border-4 border-card shadow-sm mb-2 group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage src={member.avatarUrl || undefined} alt={member.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                {member.role ? (
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border border-accent/20">
                    {member.role}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Member</span>
                )}
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex justify-center gap-6 py-4 mb-4 border-y border-border/50">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-primary mb-1">
                      <Map className="h-4 w-4" />
                      <span className="font-bold">{member.trailsCompleted || 0}</span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Trails</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-accent-foreground mb-1">
                      <Award className="h-4 w-4" />
                      <span className="font-bold">{new Date().getFullYear() - new Date(member.joinedAt).getFullYear()}</span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Years</span>
                  </div>
                </div>
                {member.bio ? (
                  <p className="text-sm text-foreground/80 line-clamp-3 italic">"{member.bio}"</p>
                ) : (
                  <p className="text-sm text-muted-foreground/60 italic">No bio provided</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
