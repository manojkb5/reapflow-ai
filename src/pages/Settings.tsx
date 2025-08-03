import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { Crown, User, Shield, Bell } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [planType] = useState("agency"); // This would come from user profile

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input defaultValue="John" className="glass border-primary/20" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" className="glass border-primary/20" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={user?.email} disabled className="glass border-primary/20" />
              </div>
              <Button variant="neon">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" className="glass border-primary/20" />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm new password" className="glass border-primary/20" />
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Notifications</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/20">
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="important">Important only</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">Save Preferences</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge variant="outline" className="mb-4 border-accent text-accent">
                  {planType === 'agency' ? 'Agency Plan' : 'Solo Plan'}
                </Badge>
                <div className="text-2xl font-bold text-accent mb-2">₹0/month</div>
                <p className="text-sm text-muted-foreground mb-4">
                  {planType === 'agency' 
                    ? 'Unlimited subaccounts and campaigns'
                    : 'Up to 1,000 contacts and 5 campaigns'
                  }
                </p>
                <Button variant="neon" className="w-full" onClick={() => toast.success("Upgrade coming soon!")}>
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Export Data</Button>
              <Button variant="outline" className="w-full">Download Reports</Button>
              <Button variant="destructive" className="w-full">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;