import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/components/AuthProvider";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ReapFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-dark">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="h-14 flex items-center justify-between border-b border-border/50 glass px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-black rounded-lg p-3">
                <img 
                  src="/lovable-uploads/042f2286-5c5c-466c-b3cc-92fd2a278d80.png" 
                  alt="ReapFlow" 
                  className="w-12 h-12" 
                />
                <div>
                  <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ReapFlow
                  </h1>
                  <p className="text-xs text-muted-foreground">AI-Powered CRM</p>
                </div>
              </div>
              
              <SidebarTrigger className="text-primary hover:bg-primary/10 transition-colors">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs text-accent font-medium">Live</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};