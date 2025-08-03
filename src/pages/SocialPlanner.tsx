import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

const SocialPlanner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: '',
    content: '',
    scheduled_for: new Date(),
    media_urls: [] as string[]
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' }
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
        media_urls: []
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
      "🚀 Just launched our new CRM feature! Now you can automate your entire customer journey from first touch to conversion. Who else loves automation? #CRM #MarketingAutomation"
    ];

    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setNewPost(prev => ({ ...prev, content: randomSuggestion }));
    toast.success('AI content generated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Social Planner
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your social media content across platforms
          </p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateAIContent}
                  >
                    ✨ AI Generate
                  </Button>
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
                <Label>Schedule Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={format(newPost.scheduled_for, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setNewPost(prev => ({ 
                    ...prev, 
                    scheduled_for: new Date(e.target.value) 
                  }))}
                  className="glass border-primary/20"
                />
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
      </div>

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
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
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
    </div>
  );
};

export default SocialPlanner;