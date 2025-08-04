import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Download, 
  FileText, 
  Image, 
  Send,
  User,
  Lock,
  Calendar,
  Target,
  TrendingUp,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const ClientPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [clientData, setClientData] = useState({
    name: 'Acme Corporation',
    email: 'client@acme.com',
    phone: '+1 (555) 123-4567',
    plan: 'Pro Plan'
  });
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to your client portal! How can we help you today?', sender: 'admin', time: '9:00 AM' },
    { id: 2, text: 'Thank you! Can you provide an update on our current campaign performance?', sender: 'client', time: '9:15 AM' },
    { id: 3, text: 'Of course! Your campaigns are performing excellently. Check the analytics tab for detailed metrics.', sender: 'admin', time: '9:20 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Brand_Guidelines.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-01-15' },
    { id: 2, name: 'Logo_Pack.zip', type: 'ZIP', size: '8.7 MB', uploadedAt: '2024-01-10' }
  ]);

  const campaigns = [
    { 
      id: 1, 
      name: 'Summer Sale Campaign', 
      status: 'active', 
      platform: 'Facebook & Instagram',
      budget: '$5,000',
      spent: '$3,240',
      conversions: 128,
      ctr: '2.8%',
      roas: '4.2x'
    },
    { 
      id: 2, 
      name: 'Brand Awareness Drive', 
      status: 'completed', 
      platform: 'Google Ads',
      budget: '$3,000',
      spent: '$2,890',
      conversions: 89,
      ctr: '1.9%',
      roas: '3.7x'
    }
  ];

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
      toast.success('Successfully logged in to your client portal');
    } else {
      toast.error('Please enter valid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
    toast.success('Successfully logged out');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'client',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate admin response
    setTimeout(() => {
      const adminReply = {
        id: messages.length + 2,
        text: 'Thank you for your message. We\'ll get back to you shortly with a detailed response.',
        sender: 'admin',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, adminReply]);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newFile = {
        id: uploadedFiles.length + 1,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      toast.success('File uploaded successfully');
    }
  };

  const updateProfile = () => {
    toast.success('Profile updated successfully');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="w-full max-w-md glass border-primary/20">
          <CardHeader className="text-center">
            <img 
              src={logo} 
              alt="ReapFlow" 
              className="w-16 h-16 mx-auto mb-4 animate-float" 
            />
            <CardTitle className="text-2xl text-foreground">Client Portal</CardTitle>
            <p className="text-muted-foreground">Access your campaigns and reports</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="glass border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="glass border-primary/20"
              />
            </div>
            <Button 
              className="w-full" 
              variant="neon" 
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo credentials: any email and password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="ReapFlow" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Client Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {clientData.name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="uploads">Files</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-accent">+1 from last month</p>
                </CardContent>
              </Card>
              
              <Card className="glass border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$6,130</div>
                  <p className="text-xs text-accent">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="glass border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">217</div>
                  <p className="text-xs text-accent">+18% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="glass border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
                  <Eye className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3.9x</div>
                  <p className="text-xs text-accent">+0.3x from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.slice(0, 2).map(campaign => (
                      <div key={campaign.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{campaign.name}</span>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <Progress value={65} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {campaign.spent} / {campaign.budget} spent
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="text-sm">
                        <p className="text-foreground">Campaign optimization completed</p>
                        <p className="text-muted-foreground text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="text-sm">
                        <p className="text-foreground">New creative assets uploaded</p>
                        <p className="text-muted-foreground text-xs">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <div className="text-sm">
                        <p className="text-foreground">Monthly report generated</p>
                        <p className="text-muted-foreground text-xs">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {campaigns.map(campaign => (
                <Card key={campaign.id} className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-accent" />
                        <span className="text-foreground">{campaign.name}</span>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Platform</p>
                        <p className="text-sm font-medium text-foreground">{campaign.platform}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium text-foreground">{campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                        <p className="text-sm font-medium text-foreground">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm font-medium text-foreground">{campaign.ctr}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="text-sm font-medium text-foreground">{campaign.roas}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Performance Analytics</CardTitle>
                <p className="text-muted-foreground">Detailed insights into your campaign performance</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">3.9x</div>
                    <p className="text-sm text-muted-foreground">Average ROAS</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2.4%</div>
                    <p className="text-sm text-muted-foreground">Average CTR</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">$28.30</div>
                    <p className="text-sm text-muted-foreground">Cost per Conversion</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-foreground">File Uploads</span>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                    <Button 
                      variant="neon" 
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        {file.type === 'PDF' ? (
                          <FileText className="h-8 w-8 text-red-500" />
                        ) : file.type === 'ZIP' ? (
                          <FileText className="h-8 w-8 text-blue-500" />
                        ) : (
                          <Image className="h-8 w-8 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • Uploaded {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Message Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'client'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/20 text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="glass border-primary/20"
                  />
                  <Button variant="neon" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Profile Settings - Always visible at bottom */}
        <Card className="glass border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              <span className="text-foreground">Profile Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                  className="glass border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  className="glass border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                  className="glass border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Current Plan</Label>
                <Input
                  id="plan"
                  value={clientData.plan}
                  readOnly
                  className="glass border-primary/20 bg-muted/20"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button variant="neon" onClick={updateProfile}>
                <Settings className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="glass border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="glass border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="glass border-primary/20"
                      />
                    </div>
                    <Button 
                      variant="neon" 
                      className="w-full"
                      onClick={() => toast.success('Password updated successfully')}
                    >
                      Update Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPortal;