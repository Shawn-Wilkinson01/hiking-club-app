import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListTrails, useCreateTrail, useDeleteTrail, getListTrailsQueryKey,
  useListEvents, useCreateEvent, useDeleteEvent, getListEventsQueryKey,
  useListMembers, useCreateMember, getListMembersQueryKey,
  useListAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, getListAnnouncementsQueryKey
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Map, Calendar, Users, Megaphone, Plus, Trash2, Badge } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function Admin() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Club Administration</h1>
        <p className="text-muted-foreground mt-2">Manage trails, events, members, and announcements.</p>
      </div>

      <Tabs defaultValue="trails" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="trails" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Map className="h-4 w-4 mr-2" /> Trails
          </TabsTrigger>
          <TabsTrigger value="events" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4 mr-2" /> Events
          </TabsTrigger>
          <TabsTrigger value="members" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" /> Members
          </TabsTrigger>
          <TabsTrigger value="announcements" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Megaphone className="h-4 w-4 mr-2" /> Notices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trails">
          <AdminTrails />
        </TabsContent>
        <TabsContent value="events">
          <AdminEvents />
        </TabsContent>
        <TabsContent value="members">
          <AdminMembers />
        </TabsContent>
        <TabsContent value="announcements">
          <AdminAnnouncements />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TRAIL ADMIN
// -----------------------------------------------------------------------------
function AdminTrails() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: trails, isLoading } = useListTrails();
  const createTrail = useCreateTrail();
  const deleteTrail = useDeleteTrail();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", location: "", distanceMiles: "", elevationFt: "", difficulty: "moderate" as any, description: "", imageUrl: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrail.mutate({ data: { 
      ...formData, 
      distanceMiles: parseFloat(formData.distanceMiles), 
      elevationFt: formData.elevationFt ? parseInt(formData.elevationFt, 10) : null 
    }}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTrailsQueryKey() });
        setOpen(false);
        setFormData({ name: "", location: "", distanceMiles: "", elevationFt: "", difficulty: "moderate", description: "", imageUrl: "" });
        toast({ title: "Trail created successfully" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this trail?")) {
      deleteTrail.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTrailsQueryKey() });
          toast({ title: "Trail deleted" });
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Trails</CardTitle>
          <CardDescription>Add or remove trails from the directory.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Trail</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Trail</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Name</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Location</Label>
                  <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Distance (miles)</Label>
                  <Input required type="number" step="0.1" value={formData.distanceMiles} onChange={e => setFormData({...formData, distanceMiles: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Elevation Gain (ft)</Label>
                  <Input type="number" value={formData.elevationFt} onChange={e => setFormData({...formData, elevationFt: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(val: any) => setFormData({...formData, difficulty: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Image URL</Label>
                  <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTrail.isPending}>Save Trail</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="p-4 text-center">Loading...</div> : 
          <div className="divide-y border rounded-md">
            {trails?.map(trail => (
              <div key={trail.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <div className="font-semibold">{trail.name}</div>
                  <div className="text-sm text-muted-foreground">{trail.location} • {trail.difficulty}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(trail.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// EVENTS ADMIN
// -----------------------------------------------------------------------------
function AdminEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: events, isLoading } = useListEvents();
  const { data: trails } = useListTrails();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({ title: "", date: "", location: "", description: "", trailId: "none", imageUrl: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate({ data: { 
      ...formData, 
      trailId: formData.trailId === "none" ? null : parseInt(formData.trailId, 10),
      attendeeCount: 0
    }}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        setOpen(false);
        setFormData({ title: "", date: "", location: "", description: "", trailId: "none", imageUrl: "" });
        toast({ title: "Event created successfully" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
          toast({ title: "Event deleted" });
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Events</CardTitle>
          <CardDescription>Schedule new group hikes.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Date & Time (ISO String or YYYY-MM-DDTHH:MM)</Label>
                <Input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Location / Meeting Point</Label>
                <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Associated Trail (Optional)</Label>
                <Select value={formData.trailId} onValueChange={(val) => setFormData({...formData, trailId: val})}>
                  <SelectTrigger><SelectValue placeholder="Select a trail" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Custom Location</SelectItem>
                    {trails?.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createEvent.isPending}>Create Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="p-4 text-center">Loading...</div> : 
          <div className="divide-y border rounded-md">
            {events?.map(evt => (
              <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <div className="font-semibold">{evt.title}</div>
                  <div className="text-sm text-muted-foreground">{new Date(evt.date).toLocaleString()} • {evt.location}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(evt.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// MEMBERS ADMIN
// -----------------------------------------------------------------------------
function AdminMembers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: members, isLoading } = useListMembers();
  const createMember = useCreateMember();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", role: "Member", bio: "", avatarUrl: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMember.mutate({ data: { 
      ...formData,
      trailsCompleted: 0
    }}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
        setOpen(false);
        setFormData({ name: "", role: "Member", bio: "", avatarUrl: "" });
        toast({ title: "Member added successfully" });
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Members</CardTitle>
          <CardDescription>Add members to the directory.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL (Optional)</Label>
                <Input value={formData.avatarUrl} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMember.isPending}>Add Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="p-4 text-center">Loading...</div> : 
          <div className="divide-y border rounded-md">
            {members?.map(member => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <div className="font-semibold">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
                {/* Note: Delete member is not exposed in the API hooks, skipping button */}
              </div>
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// ANNOUNCEMENTS ADMIN
// -----------------------------------------------------------------------------
function AdminAnnouncements() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: announcements, isLoading } = useListAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({ title: "", content: "", pinned: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        setOpen(false);
        setFormData({ title: "", content: "", pinned: false });
        toast({ title: "Announcement posted" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
          toast({ title: "Announcement deleted" });
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Noticeboard</CardTitle>
          <CardDescription>Post news and updates.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Post Notice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pinned" checked={formData.pinned} onChange={e => setFormData({...formData, pinned: e.target.checked})} className="rounded border-gray-300" />
                <Label htmlFor="pinned">Pin to top</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createAnnouncement.isPending}>Post Announcement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="p-4 text-center">Loading...</div> : 
          <div className="divide-y border rounded-md">
            {announcements?.map(ann => (
              <div key={ann.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {ann.title}
                    {ann.pinned && <Badge variant="secondary" className="text-[10px]">Pinned</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString()}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}
