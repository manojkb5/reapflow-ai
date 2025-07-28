import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { ArrowRight, Zap, Target, Brain } from "lucide-react";
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
      description: "Let AI handle your marketing campaigns, lead generation, and content creation automatically."
    },
    {
      icon: Target,
      title: "Multi-Platform Campaigns",
      description: "Create and manage campaigns across Facebook, Instagram, YouTube, Google Ads, and LinkedIn."
    },
    {
      icon: Zap,
      title: "Intelligent Workflows",
      description: "Build custom automation workflows that trigger actions based on lead behavior and engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="ReapFlow" 
              className="w-20 h-20 animate-float" 
            />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ReapFlow
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            The AI-Powered CRM & Campaign Management Platform
          </p>
          
          <p className="text-lg text-foreground/80 mb-12 max-w-3xl mx-auto">
            Automate your marketing campaigns, manage leads intelligently, and scale your business 
            with the power of artificial intelligence. Built for modern businesses who want to 
            dominate digital marketing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="neon" 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="glass" 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Watch Demo
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

        {/* CTA Section */}
        <div className="text-center glass p-12 rounded-2xl border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using ReapFlow to automate their marketing, 
            generate more leads, and increase conversions with AI.
          </p>
          <Button 
            variant="neon" 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
