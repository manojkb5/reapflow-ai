import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";

interface SecretFormProps {
  onComplete: () => void;
}

export const SecretForm = ({ onComplete }: SecretFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API key configuration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would send this to your Supabase Edge Function
    console.log("Configuring Resend API key:", apiKey);
    
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <Card className="w-full max-w-md mx-auto glass border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Configure Email Notifications</CardTitle>
        <CardDescription>
          Set up your Resend API key to enable email notifications for activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            Need an API key? Sign up at{" "}
            <a 
              href="https://resend.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              resend.com
            </a>{" "}
            and create one at{" "}
            <a 
              href="https://resend.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              resend.com/api-keys
            </a>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Resend API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="re_..."
              required
              className="glass"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            variant="neon"
            disabled={!apiKey || isSubmitting}
          >
            {isSubmitting ? "Configuring..." : "Configure Email Notifications"}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground text-center">
          <p>Make sure to validate your email domain at resend.com/domains</p>
        </div>
      </CardContent>
    </Card>
  );
};