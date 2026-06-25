import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@/api";
import { Link } from "wouter";
import { Map, Users, Calendar, ArrowRight, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: summary, isLoading, isError } = useGetDashboardSummary();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-primary-foreground">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">Find Your Path</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              Adventure <br />
              <span className="text-accent/90">Starts Here.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl font-serif">
              Join a vibrant community of outdoor enthusiasts tracking trails, planning group hikes, and celebrating shared adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg h-14 px-8" asChild>
                <Link href="/trails">Explore Trails</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/events">View Upcoming Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Stats Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
            <Activity className="h-5 w-5" />
            <span>Club Overview</span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError || !summary ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load dashboard summary.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Trails</CardTitle>
                  <Map className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{summary.totalTrails}</div>
                  <p className="text-xs text-muted-foreground mt-1">Mapped and ready</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{summary.totalMembers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active explorers</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
                  <Calendar className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{summary.upcomingEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Planned hikes</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Distance Logged</CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{summary.totalDistanceMiles || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Miles collectively hiked</p>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Announcements & Quick Links */}
        {!isLoading && summary && summary.recentAnnouncements && summary.recentAnnouncements.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  Noticeboard
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/announcements">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {summary.recentAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        {announcement.pinned && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 shrink-0">Pinned</Badge>
                        )}
                      </div>
                      <CardDescription>{new Date(announcement.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-foreground">Trail Mix</h2>
               <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Difficulty Spread</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Easy</span>
                        <span className="font-medium">{summary.trailsByDifficulty.easy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Moderate</span>
                        <span className="font-medium">{summary.trailsByDifficulty.moderate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Hard</span>
                        <span className="font-medium">{summary.trailsByDifficulty.hard}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Expert</span>
                        <span className="font-medium">{summary.trailsByDifficulty.expert}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
