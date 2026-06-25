import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { AuthProvider, useAuth } from "@/context/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Trails from "@/pages/trails";
import TrailDetail from "@/pages/trail-detail";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Members from "@/pages/members";
import Announcements from "@/pages/announcements";
import Admin from "@/pages/admin";
import Login from "@/pages/login";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/trails" component={Trails} />
        <Route path="/trails/:id" component={TrailDetail} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetail} />
        <Route path="/members" component={Members} />
        <Route path="/announcements" component={Announcements} />
        <Route path="/login" component={Login} />
        <Route path="/admin">
          <ProtectedRoute component={Admin} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base="">
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
