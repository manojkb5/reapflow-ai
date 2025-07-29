import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { 
  Plus, 
  Megaphone, 
  Search,
  Filter,
  Edit,
  Play,
  Pause,
  Calendar,
  DollarSign,
  Target,
  Brain,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Sparkles
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  platform: 'facebook' | 'instagram' | 'google' | 'youtube' | 'linkedin';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number;
  start_date?: string;
  end_date?: string;
  target_audience?: any;
  ad_copy?: string;
  creative_prompt?: string;
  created_at: string;
  subaccount_id: string;
  created_by: string;
}

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { value: 'google', label: 'Google Ads', icon: Globe, color: 'text-green-500' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: Target, color: 'text-blue-600' },
];

const CAMPAIGN_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-500' },
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subaccounts, setSubaccounts] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "" as Campaign['platform'],
    budget: "",
    start_date: "",
    end_date: "",
    target_audience: "",
    ad_copy: "",
    creative_prompt: "",
    subaccount_id: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
      fetchSubaccounts();
    }
  }, [user]);

  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.platform === platformFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, platformFilter, statusFilter]);

  const fetchSubaccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('subaccounts')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSubaccounts(data || []);
      
      if (data && data.length === 1) {
        setFormData(prev => ({ ...prev, subaccount_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching subaccounts:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async () => {
    if (!formData.description || !formData.platform) {
      toast({
        title: "Missing Information",
        description: "Please provide campaign description and platform first",
        variant: "destructive"
      });
      return;
    }

    setAiLoading(true);
    try {
      // Simulate AI generation (replace with actual AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedCopy = `🚀 Transform Your Business Today! 

Discover how our innovative solutions can help you achieve unprecedented growth. Join thousands of satisfied customers who have already revolutionized their operations.

✨ Key Benefits:
• Increase efficiency by 300%
• Reduce costs dramatically
• Scale your business effortlessly

Limited time offer - Act now and get 30% off your first month!

👉 Click to learn more and start your transformation journey today!

#Innovation #Growth #Success #${formData.platform}`;

      const generatedPrompt = `Create a professional, eye-catching ${formData.platform} ad image featuring:
- Modern, clean design with vibrant colors
- Text overlay highlighting key benefits
- Call-to-action button
- Professional business aesthetic
- High contrast and readability
- Platform-optimized dimensions`;

      setFormData(prev => ({
        ...prev,
        ad_copy: generatedCopy,
        creative_prompt: generatedPrompt
      }));

      toast({
        title: "AI Content Generated!",
        description: "Your ad copy and creative prompt have been generated",
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.subaccount_id) return;

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        platform: formData.platform,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        target_audience: formData.target_audience ? JSON.parse(`{"description": "${formData.target_audience}"}`) : null,
        ad_copy: formData.ad_copy || null,
        creative_prompt: formData.creative_prompt || null,
        subaccount_id: formData.subaccount_id,
        created_by: user.id,
        status: 'draft' as const
      };

      if (selectedCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(payload)
          .eq('id', selectedCampaign.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Campaign updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert([payload]);

        if (error) throw error;
        toast({
          title: "Success", 
          description: "Campaign created successfully"
        });
      }

      setIsCreateOpen(false);
      setSelectedCampaign(null);
      setCurrentStep(1);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSelectedCampaign(null);
    setCurrentStep(1);
    setFormData({
      name: "",
      description: "",
      platform: "" as Campaign['platform'],
      budget: "",
      start_date: "",
      end_date: "",
      target_audience: "",
      ad_copy: "",
      creative_prompt: "",
      subaccount_id: subaccounts.length === 1 ? subaccounts[0].id : ""
    });
  };

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      platform: campaign.platform,
      budget: campaign.budget?.toString() || "",
      start_date: campaign.start_date ? campaign.start_date.split('T')[0] : "",
      end_date: campaign.end_date ? campaign.end_date.split('T')[0] : "",
      target_audience: campaign.target_audience?.description || "",
      ad_copy: campaign.ad_copy || "",
      creative_prompt: campaign.creative_prompt || "",
      subaccount_id: campaign.subaccount_id
    });
    setIsCreateOpen(true);
  };

  const updateCampaignStatus = async (campaignId: string, newStatus: Campaign['status']) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Campaign ${newStatus === 'active' ? 'activated' : newStatus === 'paused' ? 'paused' : 'updated'}`
      });
      
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive"
      });
    }
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform) || PLATFORMS[0];
  };

  const getStatusInfo = (status: string) => {
    return CAMPAIGN_STATUSES.find(s => s.value === status) || CAMPAIGN_STATUSES[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Campaigns
          </h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns across platforms
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="neon" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription>
                {selectedCampaign 
                  ? 'Update your campaign details and settings'
                  : 'Set up a new marketing campaign with AI assistance'
                }
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={`step${currentStep}`} className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="step1" onClick={() => setCurrentStep(1)}>
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="step2" onClick={() => setCurrentStep(2)}>
                  Platform & Budget
                </TabsTrigger>
                <TabsTrigger value="step3" onClick={() => setCurrentStep(3)}>
                  AI Content
                </TabsTrigger>
                <TabsTrigger value="step4" onClick={() => setCurrentStep(4)}>
                  Review
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TabsContent value="step1" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Campaign Goal/Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you want to achieve with this campaign..."
                      required
                      className="glass resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subaccount">Subaccount *</Label>
                    <Select 
                      value={formData.subaccount_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subaccount_id: value }))}
                      required
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select subaccount" />
                      </SelectTrigger>
                      <SelectContent>
                        {subaccounts.map((subaccount) => (
                          <SelectItem key={subaccount.id} value={subaccount.id}>
                            {subaccount.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.name || !formData.description || !formData.subaccount_id}
                    >
                      Next: Platform & Budget
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="step2" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform *</Label>
                    <Select 
                      value={formData.platform} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value as Campaign['platform'] }))}
                      required
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center gap-2">
                              <platform.icon className={`h-4 w-4 ${platform.color}`} />
                              {platform.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="1000.00"
                        className="glass"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target_audience">Target Audience</Label>
                      <Input
                        id="target_audience"
                        value={formData.target_audience}
                        onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                        placeholder="Age 25-45, interested in..."
                        className="glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="glass"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="glass"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="ghost" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setCurrentStep(3)}
                      disabled={!formData.platform}
                    >
                      Next: AI Content
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="step3" className="space-y-4">
                  <div className="text-center mb-4">
                    <Button 
                      type="button" 
                      variant="accent" 
                      className="gap-2"
                      onClick={generateAIContent}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                      {aiLoading ? 'Generating...' : 'Generate AI Content'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      AI will create ad copy and creative prompts based on your campaign details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ad_copy">Ad Copy</Label>
                    <Textarea
                      id="ad_copy"
                      value={formData.ad_copy}
                      onChange={(e) => setFormData(prev => ({ ...prev, ad_copy: e.target.value }))}
                      placeholder="Your compelling ad copy will appear here..."
                      className="glass resize-none"
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creative_prompt">Creative Prompt</Label>
                    <Textarea
                      id="creative_prompt"
                      value={formData.creative_prompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, creative_prompt: e.target.value }))}
                      placeholder="Description for your ad creative/image..."
                      className="glass resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="ghost" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(4)}>
                      Next: Review
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="step4" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Campaign Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Platform:</span>
                        <p className="font-medium">{formData.platform && getPlatformInfo(formData.platform).label}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <p className="font-medium">{formData.budget ? `$${formData.budget}` : 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">
                          {formData.start_date && formData.end_date 
                            ? `${formData.start_date} to ${formData.end_date}`
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium mt-1">{formData.description}</p>
                    </div>

                    {formData.ad_copy && (
                      <div>
                        <span className="text-muted-foreground">Ad Copy Preview:</span>
                        <div className="mt-1 p-3 glass rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{formData.ad_copy.slice(0, 200)}...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={() => setCurrentStep(3)}>
                      Back
                    </Button>
                    <Button type="submit" variant="neon">
                      {selectedCampaign ? 'Update' : 'Create'} Campaign
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="glass border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-40 glass">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 glass">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {CAMPAIGN_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Card className="glass border-primary/20 text-center py-12">
          <CardContent>
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {campaigns.length === 0 ? 'No Campaigns Yet' : 'No Campaigns Found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {campaigns.length === 0 
                ? 'Create your first marketing campaign to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {campaigns.length === 0 && (
              <Button variant="neon" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => {
            const platformInfo = getPlatformInfo(campaign.platform);
            const statusInfo = getStatusInfo(campaign.status);
            const PlatformIcon = platformInfo.icon;
            
            return (
              <Card key={campaign.id} className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center`}>
                        <PlatformIcon className={`h-5 w-5 text-background`} />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">{campaign.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: statusInfo.color }}
                          >
                            <div 
                              className={`w-2 h-2 rounded-full mr-1 ${statusInfo.color}`}
                            />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {platformInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(campaign)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {campaign.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-accent">
                          ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {campaign.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">
                          {new Date(campaign.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {campaign.ad_copy && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI-generated content ready
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/50 flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateCampaignStatus(campaign.id, 'active')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateCampaignStatus(campaign.id, 'active')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Campaigns;