import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Eye, EyeOff, Check, Building, User, Crown } from "lucide-react";
import logo from "@/assets/logo.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [selectedPlan, setSelectedPlan] = useState("solo");
  const [signupStep, setSignupStep] = useState(1);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Welcome back to ReapFlow!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            plan_type: selectedPlan,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created! Please check your email to verify your account.");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="ReapFlow" 
              className="w-16 h-16 animate-pulse-glow" 
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ReapFlow
          </h1>
          <p className="text-muted-foreground">
            AI-Powered CRM & Campaign Management
          </p>
        </div>

        <Card className="glass border-primary/20 shadow-glass">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="text-center">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <CardTitle className="text-center text-foreground">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Sign in to your ReapFlow account
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="glass border-primary/20 focus:border-primary pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    variant="neon" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {signupStep === 1 ? (
                <div>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <CardTitle className="text-foreground">Choose Your Plan</CardTitle>
                      <CardDescription>
                        Select the plan that best fits your needs
                      </CardDescription>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Solo Plan */}
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedPlan === 'solo' 
                            ? 'border-primary bg-primary/10 glow-primary' 
                            : 'border-muted glass hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan('solo')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Solo Plan</h3>
                              <p className="text-sm text-muted-foreground">Perfect for individual marketers</p>
                            </div>
                          </div>
                          {selectedPlan === 'solo' && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="mt-3 pl-11">
                          <div className="text-2xl font-bold text-primary">₹0<span className="text-sm text-muted-foreground">/month</span></div>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            <li>• Up to 1,000 contacts</li>
                            <li>• 5 active campaigns</li>
                            <li>• Basic AI assistance</li>
                            <li>• Email support</li>
                          </ul>
                        </div>
                      </div>

                      {/* Agency Plan */}
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedPlan === 'agency' 
                            ? 'border-primary bg-primary/10 glow-primary' 
                            : 'border-muted glass hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan('agency')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/20">
                              <Building className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Agency Plan</h3>
                              <p className="text-sm text-muted-foreground">Manage multiple client accounts</p>
                            </div>
                          </div>
                          {selectedPlan === 'agency' && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="mt-3 pl-11">
                          <div className="text-2xl font-bold text-accent">₹0<span className="text-sm text-muted-foreground">/month</span></div>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            <li>• Unlimited contacts</li>
                            <li>• Unlimited campaigns</li>
                            <li>• Multiple subaccounts</li>
                            <li>• Advanced AI features</li>
                            <li>• Priority support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="neon" 
                      className="w-full"
                      onClick={() => setSignupStep(2)}
                    >
                      Continue with {selectedPlan === 'solo' ? 'Solo' : 'Agency'} Plan
                    </Button>
                  </CardFooter>
                </div>
              ) : (
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <CardTitle className="text-foreground">Create Your Account</CardTitle>
                      <CardDescription>
                        {selectedPlan === 'solo' ? 'Solo Plan' : 'Agency Plan'} - ₹0/month
                      </CardDescription>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="glass border-primary/20 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="glass border-primary/20 focus:border-primary pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="space-y-2">
                    <div className="w-full space-y-2">
                      <Button 
                        type="submit" 
                        variant="neon" 
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setSignupStep(1)}
                      >
                        Back to Plan Selection
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;