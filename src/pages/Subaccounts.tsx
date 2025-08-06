import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { 
  Plus, 
  Building, 
  Users, 
  Calendar, 
  Edit,
  MoreVertical,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface Subaccount {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  created_by: string;
}

const Subaccounts = () => {
  const [subaccounts, setSubaccounts] = useState<Subaccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSubaccount, setSelectedSubaccount] = useState<Subaccount | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    website: "",
    email: "",
    phone: "",
    address: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSubaccounts();
    }
  }, [user]);

  const fetchSubaccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('subaccounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubaccounts(data || []);
    } catch (error) {
      console.error('Error fetching subaccounts:', error);
      toast({
        title: "Error",
        description: "Failed to load subaccounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        ...formData,
        created_by: user.id
      };

      if (selectedSubaccount) {
        // Update existing subaccount
        const { error } = await supabase
          .from('subaccounts')
          .update(payload)
          .eq('id', selectedSubaccount.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Subaccount updated successfully"
        });
      } else {
        // Create new subaccount
        const { data: newSubaccount, error } = await supabase
          .from('subaccounts')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        // Create user_subaccount relationship
        const { error: relationError } = await supabase
          .from('user_subaccounts')
          .insert([{
            user_id: user.id,
            subaccount_id: newSubaccount.id,
            role: 'admin'
          }]);

        if (relationError) throw relationError;
        toast({
          title: "Success", 
          description: "Subaccount created successfully"
        });
      }

      setIsCreateOpen(false);
      setSelectedSubaccount(null);
      setFormData({
        name: "",
        logo_url: "",
        website: "",
        email: "",
        phone: "",
        address: ""
      });
      fetchSubaccounts();
    } catch (error) {
      console.error('Error saving subaccount:', error);
      toast({
        title: "Error",
        description: "Failed to save subaccount",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (subaccount: Subaccount) => {
    setSelectedSubaccount(subaccount);
    setFormData({
      name: subaccount.name,
      logo_url: subaccount.logo_url || "",
      website: subaccount.website || "",
      email: subaccount.email || "",
      phone: subaccount.phone || "",
      address: subaccount.address || ""
    });
    setIsCreateOpen(true);
  };

  const resetForm = () => {
    setSelectedSubaccount(null);
    setFormData({
      name: "",
      logo_url: "",
      website: "",
      email: "",
      phone: "",
      address: ""
    });
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
            Subaccounts
          </h1>
          <p className="text-muted-foreground">
            Manage client accounts and business portfolios
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="neon" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subaccount
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/20 max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedSubaccount ? 'Edit Subaccount' : 'Create New Subaccount'}
              </DialogTitle>
              <DialogDescription>
                {selectedSubaccount 
                  ? 'Update the details for this client account'
                  : 'Add a new client account to your portfolio'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter business name"
                  required
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@example.com"
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, City, State 12345"
                  className="glass resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="neon" className="flex-1">
                  {selectedSubaccount ? 'Update' : 'Create'} Subaccount
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subaccounts Grid */}
      {subaccounts.length === 0 ? (
        <Card className="glass border-primary/20 text-center py-12">
          <CardContent>
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Subaccounts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first client account to get started
            </p>
            <Button variant="neon" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subaccount
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subaccounts.map((subaccount) => (
            <Card key={subaccount.id} className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {subaccount.logo_url ? (
                      <img 
                        src={subaccount.logo_url} 
                        alt={`${subaccount.name} logo`}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Building className="h-5 w-5 text-background" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-foreground">{subaccount.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(subaccount.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(subaccount)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {subaccount.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={subaccount.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors truncate"
                    >
                      {subaccount.website}
                    </a>
                  </div>
                )}
                {subaccount.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{subaccount.email}</span>
                  </div>
                )}
                {subaccount.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{subaccount.phone}</span>
                  </div>
                )}
                {subaccount.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{subaccount.address}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border/50">
                  <Button variant="glass" className="w-full" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subaccounts;