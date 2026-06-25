import { Link, useLocation } from "wouter";
import { Compass, Map, Calendar, Users, Megaphone, Settings, Menu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { href: "/trails", label: "Trails", icon: Map },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/members", label: "Members", icon: Users },
    { href: "/announcements", label: "Noticeboard", icon: Megaphone },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight transition-colors hover:text-primary/80">
            <Compass className="h-6 w-6" />
            <span>The Hiking Club</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="h-4 w-px bg-border mx-2" />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Admin</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground gap-1.5">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">{user?.username}</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground gap-1.5">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium">Home</Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-4 border-t border-border" />
                  {isAuthenticated ? (
                    <>
                      <Link href="/admin" className="text-lg font-medium flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <Settings className="h-5 w-5" />
                        Admin
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-lg font-medium flex items-center gap-2 text-muted-foreground hover:text-primary text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Log out ({user?.username})
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="text-lg font-medium flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <footer className="border-t py-8 md:py-12 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Compass className="h-5 w-5" />
            The Hiking Club
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Hiking Club. Explore responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
