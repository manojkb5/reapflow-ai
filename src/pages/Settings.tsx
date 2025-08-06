import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // First verify the old password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: oldPassword
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="glass border-primary/20"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  placeholder="Enter new password" 
                  className="glass border-primary/20"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="glass border-primary/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handlePasswordUpdate}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
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

        </div>
      </div>
    </div>
  );
};

export default Settings;