import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Image,
  Facebook,
  Instagram,
  Youtube,
  Edit,
  Trash2,
  Eye,
  Brain,
  Hash,
  TrendingUp,
  BarChart3,
  Users,
  Heart,
  MessageCircle,
  Share,
  ArrowUpDown,
  Sparkles,
  Target
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

const SocialPlanner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [bestTimeInsights, setBestTimeInsights] = useState<any>(null);
  const [newPost, setNewPost] = useState({
    platform: '',
    content: '',
    scheduled_for: new Date(),
    media_urls: [] as string[],
    hashtags: [] as string[],
    auto_publish: true
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', bestTimes: ['9:00 AM', '1:00 PM', '7:00 PM'] },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bestTimes: ['11:00 AM', '2:00 PM', '5:00 PM'] },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bestTimes: ['2:00 PM', '8:00 PM', '9:00 PM'] },
    { id: 'linkedin', name: 'LinkedIn', icon: Users, color: 'text-blue-700', bestTimes: ['8:00 AM', '12:00 PM', '6:00 PM'] }
  ];

  const hashtagSuggestions = {
    facebook: ['#business', '#marketing', '#growth', '#success', '#entrepreneur'],
    instagram: ['#instagood', '#photooftheday', '#beautiful', '#marketing', '#business'],
    youtube: ['#youtube', '#video', '#content', '#creator', '#trending'],
    linkedin: ['#professional', '#networking', '#career', '#business', '#leadership']
  };

  const performanceMetrics = [
    { label: 'Reach', value: '12.5K', change: '+15%', icon: Eye },
    { label: 'Engagement', value: '2.3K', change: '+8%', icon: Heart },
    { label: 'Shares', value: '456', change: '+22%', icon: Share },
    { label: 'Comments', value: '189', change: '+12%', icon: MessageCircle },
  ];

  const monthDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  useEffect(() => {
    fetchPosts();
  }, [selectedDate]);

  const fetchPosts = async () => {
    try {
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);

      const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .gte('scheduled_for', startDate.toISOString())
        .lte('scheduled_for', endDate.toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  const createPost = async () => {
    if (!newPost.platform || !newPost.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('scheduled_posts')
        .insert([
          {
            platform: newPost.platform as 'facebook' | 'instagram' | 'youtube',
            content: newPost.content,
            scheduled_for: newPost.scheduled_for.toISOString(),
            media_urls: newPost.media_urls,
            status: 'scheduled',
            created_by: user.id,
            subaccount_id: '' // Will need to implement subaccount selection
          }
        ]);

      if (error) throw error;

      await fetchPosts();
      setShowCreateModal(false);
      setNewPost({
        platform: '',
        content: '',
        scheduled_for: new Date(),
        media_urls: [],
        hashtags: [],
        auto_publish: true
      });
      toast.success('Post scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule post');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduled_for), day)
    );
  };

  const getPlatformIcon = (platform: string) => {
    const platformConfig = platforms.find(p => p.id === platform);
    return platformConfig ? platformConfig.icon : Calendar;
  };

  const getPlatformColor = (platform: string) => {
    const platformConfig = platforms.find(p => p.id === platform);
    return platformConfig ? platformConfig.color : 'text-muted-foreground';
  };

  const generateAIContent = () => {
    const aiSuggestions = [
      "🌟 Transform your business with the power of AI! Our latest campaign management tools are helping businesses increase their ROI by 300%. What's your biggest marketing challenge? #AIMarketing #BusinessGrowth",
      "💡 Pro tip: The best time to post on social media varies by platform. Facebook: 9-10am, Instagram: 11am-1pm, LinkedIn: 12-1pm. When do you see the most engagement? #SocialMediaTips",
      "🚀 Just launched our new CRM feature! Now you can automate your entire customer journey from first touch to conversion. Who else loves automation? #CRM #MarketingAutomation",
      "📊 Data-driven marketing is the future! Companies using analytics-driven strategies see 5x higher ROI. What metrics do you track? #DataMarketing #Analytics",
      "🎯 Personalization is key! 71% of consumers expect personalized experiences. How are you personalizing your customer journey? #Personalization #CX"
    ];

    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setNewPost(prev => ({ ...prev, content: randomSuggestion }));
    toast.success('AI content generated!');
  };

  const generateHashtagSuggestions = () => {
    if (!newPost.platform) {
      toast.error('Please select a platform first');
      return;
    }
    
    const suggestions = hashtagSuggestions[newPost.platform as keyof typeof hashtagSuggestions] || [];
    setNewPost(prev => ({ ...prev, hashtags: suggestions }));
    setShowHashtagSuggestions(true);
    toast.success('Hashtag suggestions generated!');
  };

  const getBestTimeForPlatform = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.bestTimes || [];
  };

  const suggestBestTime = () => {
    if (!newPost.platform) {
      toast.error('Please select a platform first');
      return;
    }

    const bestTimes = getBestTimeForPlatform(newPost.platform);
    const randomTime = bestTimes[Math.floor(Math.random() * bestTimes.length)];
    
    // Convert time string to today's date with that time
    const [time, period] = randomTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const suggestedDate = new Date();
    suggestedDate.setHours(hour, parseInt(minutes), 0, 0);
    
    setNewPost(prev => ({ ...prev, scheduled_for: suggestedDate }));
    toast.success(`Best time suggested: ${randomTime}`);
  };

  const autoFillEmptySlots = () => {
    const emptyDays = [];
    const monthDays = eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate)
    });

    monthDays.forEach(day => {
      const dayPosts = getPostsForDay(day);
      if (dayPosts.length === 0) {
        emptyDays.push(day);
      }
    });

    if (emptyDays.length > 0) {
      toast.success(`Found ${emptyDays.length} empty slots. AI will suggest optimal posting times.`);
    } else {
      toast.info('No empty slots found in this month!');
    }
  };

  const viewPostPerformance = (post: any) => {
    setSelectedPost(post);
    setShowPerformanceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Social Planner
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your social media content with AI-powered optimization
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="ai-suggestions" className="text-sm">AI Suggestions</Label>
            <Switch
              id="ai-suggestions"
              checked={aiSuggestionsEnabled}
              onCheckedChange={setAiSuggestionsEnabled}
            />
          </div>
          <Button variant="outline" onClick={autoFillEmptySlots} className="glass border-primary/20">
            <Sparkles className="h-4 w-4 mr-2" />
            Auto-Fill Slots
          </Button>
        </div>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogTrigger asChild>
          <Button variant="neon">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </DialogTrigger>
          <DialogContent className="glass border-primary/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Schedule New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={newPost.platform}
                  onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20">
                    {platforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-2">
                          <platform.icon className={`h-4 w-4 ${platform.color}`} />
                          {platform.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Content</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateAIContent}
                      disabled={!aiSuggestionsEnabled}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      AI Generate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateHashtagSuggestions}
                      disabled={!aiSuggestionsEnabled}
                    >
                      <Hash className="h-4 w-4 mr-1" />
                      Hashtags
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="glass border-primary/20 min-h-[120px]"
                />
                <div className="text-xs text-muted-foreground">
                  {newPost.content.length}/280 characters
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Schedule Date & Time</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={suggestBestTime}
                    disabled={!aiSuggestionsEnabled || !newPost.platform}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Best Time
                  </Button>
                </div>
                <Input
                  type="datetime-local"
                  value={format(newPost.scheduled_for, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setNewPost(prev => ({ 
                    ...prev, 
                    scheduled_for: new Date(e.target.value) 
                  }))}
                  className="glass border-primary/20"
                />
                {newPost.platform && aiSuggestionsEnabled && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Best times for {platforms.find(p => p.id === newPost.platform)?.name}: </span>
                    {getBestTimeForPlatform(newPost.platform).join(', ')}
                  </div>
                )}
              </div>

              {showHashtagSuggestions && newPost.hashtags.length > 0 && (
                <div className="space-y-2">
                  <Label>Suggested Hashtags</Label>
                  <div className="flex flex-wrap gap-2">
                    {newPost.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Auto-Publish</Label>
                  <Switch
                    checked={newPost.auto_publish}
                    onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, auto_publish: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {newPost.auto_publish ? 'Post will be published automatically' : 'Post will be saved as draft'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Media URLs (optional)</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  className="glass border-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Add image or video URLs for your post
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="neon"
                  onClick={createPost}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Scheduling...' : 'Schedule Post'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">
              {format(selectedDate, 'MMMM yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Weekday headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {monthDays.map(day => {
                  const dayPosts = getPostsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <div
                      key={day.toString()}
                      className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : isToday
                          ? 'border-accent bg-accent/10'
                          : 'border-border/20 glass hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="text-sm font-medium text-foreground mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 3).map(post => {
                          const PlatformIcon = getPlatformIcon(post.platform);
                          return (
                            <div
                              key={post.id}
                              className="text-xs p-1 rounded glass border border-secondary/20 flex items-center gap-1"
                            >
                              <PlatformIcon className={`h-3 w-3 ${getPlatformColor(post.platform)}`} />
                              <span className="truncate text-foreground">
                                {post.content.substring(0, 20)}...
                              </span>
                            </div>
                          );
                        })}
                        {dayPosts.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayPosts.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Posts */}
          <Card className="glass border-primary/20 mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">
                Posts for {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getPostsForDay(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getPostsForDay(selectedDate).map(post => {
                    const PlatformIcon = getPlatformIcon(post.platform);
                    return (
                      <div
                        key={post.id}
                        className="p-4 rounded-lg glass border border-secondary/20"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <PlatformIcon className={`h-5 w-5 ${getPlatformColor(post.platform)}`} />
                            <span className="font-medium text-foreground capitalize">
                              {post.platform}
                            </span>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(post.scheduled_for), 'h:mm a')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewPostPerformance(post)}
                            >
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePost(post.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-3">
                          {post.content}
                        </p>
                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Image className="h-3 w-3" />
                            {post.media_urls.length} media file(s)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No posts scheduled for this day
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Schedule a post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Modal */}
      <Dialog open={showPerformanceModal} onOpenChange={setShowPerformanceModal}>
        <DialogContent className="glass border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Post Performance</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              {/* Post Preview */}
              <div className="p-4 rounded-lg glass border border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  {(() => {
                    const PlatformIcon = getPlatformIcon(selectedPost.platform);
                    return <PlatformIcon className={`h-5 w-5 ${getPlatformColor(selectedPost.platform)}`} />;
                  })()}
                  <span className="font-medium capitalize">{selectedPost.platform}</span>
                  <Badge variant="outline">
                    {format(new Date(selectedPost.scheduled_for), 'MMM d, yyyy h:mm a')}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{selectedPost.content}</p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index} className="glass border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <metric.icon className="h-5 w-5 text-primary" />
                        <span className={`text-xs ${metric.change.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>
                          {metric.change}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-xl font-bold text-foreground">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Engagement Timeline */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Engagement timeline would be shown here with real data</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-foreground">
                        🎯 <strong>Peak Engagement:</strong> This post received 40% more engagement than your average {selectedPost.platform} post.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm text-foreground">
                        ⏰ <strong>Timing Analysis:</strong> Posted at optimal time (2:00 PM) which contributed to higher reach.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                      <p className="text-sm text-foreground">
                        💡 <strong>Content Insight:</strong> Posts with emojis and questions generate 25% more comments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialPlanner;