import { useListTrails } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Map, Mountain, ArrowRight, Activity, Route as RouteIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy": return "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/20";
    case "moderate": return "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-500/20";
    case "hard": return "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 hover:bg-orange-500/20";
    case "expert": return "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/20";
    default: return "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20";
  }
};

export default function Trails() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");
  
  const { data: trails, isLoading, isError } = useListTrails(
    filterDifficulty !== "all" ? { difficulty: filterDifficulty } : {}
  );

  const filteredTrails = trails?.filter(trail => 
    search === "" || trail.name.toLowerCase().includes(search.toLowerCase()) || trail.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            Explore Trails
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Find your next adventure.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input 
            placeholder="Search trails..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-destructive/10 text-destructive rounded-lg">
          Failed to load trails. Please try again later.
        </div>
      ) : !filteredTrails?.length ? (
        <div className="text-center py-20 bg-muted/50 rounded-lg border border-dashed border-border">
          <Mountain className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No trails found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          {(search || filterDifficulty !== "all") && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setSearch(""); setFilterDifficulty("all"); }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrails.map((trail) => (
            <Card key={trail.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md flex flex-col h-full">
              <div className="relative h-48 bg-muted overflow-hidden">
                {trail.imageUrl ? (
                  <img 
                    src={trail.imageUrl} 
                    alt={trail.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Mountain className="h-12 w-12 text-secondary-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={`uppercase text-[10px] tracking-wider font-bold shadow-sm ${getDifficultyColor(trail.difficulty)} border-none`}>
                    {trail.difficulty}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-xl font-bold line-clamp-1">{trail.name}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Map className="h-3 w-3" />
                  <span className="line-clamp-1">{trail.location}</span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 flex-1">
                <div className="flex items-center gap-4 text-sm text-foreground/80 mb-3">
                  <div className="flex items-center gap-1.5">
                    <RouteIcon className="h-4 w-4 text-primary" />
                    <span>{trail.distanceMiles} mi</span>
                  </div>
                  {trail.elevationFt && (
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-primary" />
                      <span>{trail.elevationFt} ft gain</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {trail.description}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-0 mt-auto">
                <Button variant="ghost" className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground" asChild>
                  <Link href={`/trails/${trail.id}`}>
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
