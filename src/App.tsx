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
import Workflows from "./pages/Workflows";
import AIAssistant from "./pages/AIAssistant";
import SocialPlanner from "./pages/SocialPlanner";
import Analytics from "./pages/Analytics";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
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
            <Route path="/workflows" element={<AppLayout><Workflows /></AppLayout>} />
            <Route path="/ai-assistant" element={<AppLayout><AIAssistant /></AppLayout>} />
            <Route path="/social-planner" element={<AppLayout><SocialPlanner /></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
            <Route path="/integrations" element={<AppLayout><Integrations /></AppLayout>} />
            <Route path="/client-portal" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Client Portal</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
