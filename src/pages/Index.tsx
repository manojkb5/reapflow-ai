import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { ArrowRight, Zap, Target, Brain, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
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

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Automation",
      description: "True AI integrations, not basic automations. Let machine learning optimize your campaigns, predict customer behavior, and auto-generate high-converting content."
    },
    {
      icon: Target,
      title: "One-Click Multi-Platform Campaigns",
      description: "Launch synchronized campaigns across Facebook, Instagram, YouTube, Google Ads, and LinkedIn from a single dashboard. No more platform juggling."
    },
    {
      icon: Zap,
      title: "Intelligent Workflows with Real-Time Analytics",
      description: "Build smart automation workflows that adapt based on performance data. Get instant insights, not delayed reports like traditional CRMs."
    }
  ];

  const comparisons = [
    "Real AI integrations (not just basic automations)",
    "One-click multi-platform campaigns",
    "Intuitive workflows with real-time analytics", 
    "Affordable pricing with no hidden costs",
    "Built-in social media scheduler",
    "Advanced lead scoring with AI insights"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header with Logo in Top Right */}
      <header className="absolute top-4 right-4 z-10">
        <img 
          src={logo} 
          alt="ReapFlow" 
          className="w-12 h-12 animate-float" 
        />
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ReapFlow
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            The AI-Powered CRM & Campaign Management Platform
          </p>
          
          <p className="text-lg text-foreground/80 mb-12 max-w-3xl mx-auto">
            Stop wasting time with outdated CRM tools. ReapFlow combines the power of real AI automation 
            with intuitive campaign management to help you scale faster than HubSpot, Zoho, or any traditional CRM.
          </p>

          <div className="flex justify-center">
            <Button 
              variant="neon" 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-12 py-6 hover:scale-105 transition-transform"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass p-8 rounded-2xl border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Why ReapFlow is Better Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">
            Why ReapFlow is Better
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Traditional CRMs like HubSpot and Zoho are outdated. ReapFlow is built for the AI era.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {comparisons.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 glass p-6 rounded-xl border-primary/20">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="glass p-12 rounded-2xl border-primary/20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Contact Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">contact@reapflow.com</p>
              <p className="text-muted-foreground">support@reapflow.com</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 (234) 567-890</p>
              <p className="text-muted-foreground">+1 (234) 567-891</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
              <p className="text-muted-foreground">ReapFlow HQ</p>
              <p className="text-muted-foreground">123 Innovation Drive, Tech City</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="neon" 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
