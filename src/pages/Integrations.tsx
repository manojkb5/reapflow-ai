import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, Youtube, Linkedin, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'facebook', name: 'Facebook', icon: Facebook, connected: false, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, connected: true, color: 'text-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, connected: false, color: 'text-red-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: false, color: 'text-blue-700' },
  ]);

  const connectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: true }
          : integration
      )
    );
    toast.success(`${integrations.find(i => i.id === id)?.name} connected successfully!`);
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: false }
          : integration
      )
    );
    toast.success(`${integrations.find(i => i.id === id)?.name} disconnected.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Integrations</h1>
        <p className="text-muted-foreground">Connect your social media and advertising accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className={`h-8 w-8 ${integration.color}`} />
                  <span className="text-foreground">{integration.name}</span>
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
                  ? `Your ${integration.name} account is connected and ready to use.`
                  : `Connect your ${integration.name} account to create and manage campaigns.`
                }
              </p>
              {integration.connected ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast.success("Account refreshed!")}
                  >
                    Refresh Connection
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
                  onClick={() => connectIntegration(integration.id)}
                >
                  Connect {integration.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integrations;