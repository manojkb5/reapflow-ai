import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Copy, 
  Star, 
  Sparkles, 
  TrendingUp,
  Target,
  Megaphone,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    {
      title: "Create Facebook Ad",
      description: "Generate high-converting Facebook ad copy for real estate",
      icon: Megaphone,
      prompt: "Create a Facebook ad campaign for luxury real estate listings targeting high-income professionals aged 35-55"
    },
    {
      title: "Email Sequence", 
      description: "Build a 5-email nurture sequence for leads",
      icon: Calendar,
      prompt: "Create a 5-email nurture sequence for real estate leads who downloaded our buyer's guide"
    },
    {
      title: "Campaign Strategy",
      description: "Get platform recommendations and targeting ideas",
      icon: Target,
      prompt: "What's the best marketing strategy for a new fitness studio? Include platform recommendations and target audience insights"
    },
    {
      title: "Content Ideas",
      description: "Generate social media content calendar",
      icon: Star,
      prompt: "Create 30 social media post ideas for a local restaurant including captions and hashtag suggestions"
    }
  ];

  const mockResponses = [
    {
      type: "campaign_strategy",
      title: "Recommended Campaign Strategy",
      content: {
        platforms: ["Facebook", "Instagram", "Google Ads"],
        budget: "$500-1000/month",
        targeting: "Age 25-45, Interests: Real Estate, Income: $50k+",
        adCopy: "Discover Your Dream Home Today - Expert Real Estate Services",
        cta: "Schedule Free Consultation"
      }
    }
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Failed to fetch conversations');
    }
  };

  const handleSubmit = async (inputPrompt?: string) => {
    const currentPrompt = inputPrompt || prompt;
    if (!currentPrompt.trim()) return;

    setLoading(true);
    try {
      // Mock AI response for demo
      const mockResponse = `Based on your request: "${currentPrompt}"

**Platform Recommendation:**
• Facebook Ads - Best for broad reach and detailed targeting
• Instagram - Perfect for visual content and younger demographics  
• Google Ads - Capture high-intent search traffic

**Suggested Ad Copy:**
"🏠 Find Your Perfect Home Today! 
Expert real estate guidance from trusted local professionals. 
✅ Free market analysis
✅ Personalized home search
✅ Negotiation expertise
Get started with your FREE consultation!"

**Target Audience:**
• Age: 28-55
• Income: $50,000+  
• Interests: Real Estate, Home Buying, Investment
• Location: 25-mile radius from your area

**Budget Recommendation:**
$800-1,500/month for optimal results

**Next Steps:**
1. Set up Facebook Business Manager
2. Create custom audiences
3. Design visual assets
4. Launch with A/B testing

Would you like me to create the actual campaign setup for you?`;

      // Save to database
      const { error } = await supabase
        .from('ai_logs')
        .insert([
          {
            prompt: currentPrompt,
            response: mockResponse,
            model_used: 'gpt-4',
            tokens_used: 450,
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          }
        ]);

      if (error) throw error;

      await fetchConversations();
      setPrompt("");
      toast.success("AI response generated!");
    } catch (error) {
      toast.error("Failed to generate AI response");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const createCampaignFromSuggestion = (suggestion: any) => {
    toast.success("Campaign template created! Check your Campaigns page.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Get intelligent marketing insights and campaign suggestions
          </p>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          <Brain className="h-3 w-3 mr-1 animate-pulse" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          {/* Input Area */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                What would you like to achieve?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Create a Facebook ad campaign for my restaurant..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="glass border-primary/20 focus:border-primary"
                />
                <Button
                  variant="neon"
                  onClick={() => handleSubmit()}
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <Brain className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="glass border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* User Prompt */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xs font-medium">You</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{conversation.prompt}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="p-4 rounded-lg glass border border-primary/20">
                          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                            {conversation.response}
                          </pre>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(conversation.response)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => createCampaignFromSuggestion(conversation)}
                            >
                              <Megaphone className="h-3 w-3 mr-1" />
                              Create Campaign
                            </Button>
                            <div className="ml-auto text-xs text-muted-foreground">
                              {conversation.tokens_used} tokens • {conversation.model_used}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {conversations.length === 0 && (
              <Card className="glass border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto text-primary/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Start Your First AI Conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Ask me anything about marketing, campaigns, or content creation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((quickPrompt, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg glass border border-secondary/20 hover:border-primary/50 cursor-pointer transition-all"
                  onClick={() => handleSubmit(quickPrompt.prompt)}
                >
                  <div className="flex items-start gap-3">
                    <quickPrompt.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {quickPrompt.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {quickPrompt.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">AI Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conversations</span>
                <span className="text-sm font-medium text-foreground">{conversations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tokens</span>
                <span className="text-sm font-medium text-foreground">
                  {conversations.reduce((acc, conv) => acc + (conv.tokens_used || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="text-sm font-medium text-foreground">1.2s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;