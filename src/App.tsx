import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { AppLayout } from "@/components/layouts/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Subaccounts from "./pages/Subaccounts";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/subaccounts" element={<AppLayout><Subaccounts /></AppLayout>} />
            <Route path="/contacts" element={<AppLayout><Contacts /></AppLayout>} />
            <Route path="/campaigns" element={<AppLayout><Campaigns /></AppLayout>} />
            <Route path="/workflows" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Workflows</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/ai-assistant" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">AI Assistant</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/social-planner" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Social Planner</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/integrations" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Integrations</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/client-portal" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Client Portal</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/settings" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
