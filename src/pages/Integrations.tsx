import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Instagram, Youtube, Linkedin, CheckCircle, AlertCircle, Chrome, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'facebook', name: 'Facebook', icon: Facebook, connected: false, color: 'text-blue-500', accountName: '', scopes: ['posting', 'insights'] },
    { id: 'instagram', name: 'Instagram', icon: Instagram, connected: true, color: 'text-pink-500', accountName: '@mybusiness_official', scopes: ['posting', 'insights'] },
    { id: 'youtube', name: 'YouTube', icon: Youtube, connected: false, color: 'text-red-500', accountName: '', scopes: ['uploading', 'analytics'] },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: false, color: 'text-blue-700', accountName: '', scopes: ['posting', 'company_insights'] },
    { id: 'google', name: 'Google Ads', icon: Chrome, connected: false, color: 'text-blue-600', accountName: '', scopes: ['ads_management', 'reporting'] },
  ]);
  
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [connectionForm, setConnectionForm] = useState({
    email: '',
    scopes: [] as string[],
    consent: false,
    twoFactor: ''
  });

  const openConnectDialog = (id: string) => {
    setSelectedPlatform(id);
    setShowConnectDialog(true);
    setConnectionForm({ email: '', scopes: [], consent: false, twoFactor: '' });
  };

  const connectIntegration = async () => {
    if (!connectionForm.consent) {
      toast.error('Please consent to the integration');
      return;
    }
    
    const platform = integrations.find(i => i.id === selectedPlatform);
    if (!platform) return;
    
    setConnecting(selectedPlatform);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === selectedPlatform 
          ? { 
              ...integration, 
              connected: true, 
              accountName: connectionForm.email || `@${platform.name.toLowerCase()}_account`
            }
          : integration
      )
    );
    
    setConnecting(null);
    setShowConnectDialog(false);
    toast.success(`${platform.name} connected successfully!`);
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: false, accountName: '' }
          : integration
      )
    );
    toast.success(`${integrations.find(i => i.id === id)?.name} disconnected.`);
  };

  const refreshConnection = (id: string) => {
    const platform = integrations.find(i => i.id === id);
    if (platform) {
      toast.success(`${platform.name} connection refreshed!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Integrations</h1>
        <p className="text-muted-foreground">Connect your social media and advertising accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="glass border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className={`h-8 w-8 ${integration.color}`} />
                  <div>
                    <span className="text-foreground">{integration.name}</span>
                    {integration.connected && integration.accountName && (
                      <p className="text-xs text-muted-foreground font-normal">{integration.accountName}</p>
                    )}
                  </div>
                </div>
                <Badge variant={integration.connected ? "default" : "secondary"}>
                  {integration.connected ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
                  ) : (
                    <><AlertCircle className="h-3 w-3 mr-1" /> Not Connected</>
                  )}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {integration.connected 
                  ? `Your ${integration.name} account is connected and syncing data.`
                  : `Connect your ${integration.name} account to create and manage campaigns with OAuth 2.0 authentication.`
                }
              </p>
              
              {integration.connected && (
                <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Active Scopes:</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.scopes.map(scope => (
                      <Badge key={scope} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {integration.connected ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => refreshConnection(integration.id)}
                  >
                    Refresh Token
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => disconnectIntegration(integration.id)}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="neon" 
                  className="w-full"
                  onClick={() => openConnectDialog(integration.id)}
                  disabled={connecting === integration.id}
                >
                  {connecting === integration.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    `Connect ${integration.name}`
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="glass border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Connect {integrations.find(i => i.id === selectedPlatform)?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email/Username</Label>
              <Input
                id="email"
                placeholder="Enter your account email"
                value={connectionForm.email}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, email: e.target.value }))}
                className="glass border-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              {integrations.find(i => i.id === selectedPlatform)?.scopes.map(scope => (
                <div key={scope} className="flex items-center space-x-2">
                  <Checkbox 
                    id={scope}
                    checked={connectionForm.scopes.includes(scope)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConnectionForm(prev => ({ 
                          ...prev, 
                          scopes: [...prev.scopes, scope] 
                        }));
                      } else {
                        setConnectionForm(prev => ({ 
                          ...prev, 
                          scopes: prev.scopes.filter(s => s !== scope) 
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={scope} className="text-sm capitalize">
                    {scope.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent"
                checked={connectionForm.consent}
                onCheckedChange={(checked) => setConnectionForm(prev => ({ ...prev, consent: !!checked }))}
              />
              <Label htmlFor="consent" className="text-sm">
                I consent to connecting this account and sharing data
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="neon" 
                onClick={connectIntegration}
                disabled={!connectionForm.consent || connecting === selectedPlatform}
                className="flex-1"
              >
                {connecting === selectedPlatform ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Account'
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowConnectDialog(false)}
                disabled={connecting === selectedPlatform}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;