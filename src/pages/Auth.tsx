import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");

  // Redirect authenticated users to home
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(loginEmail, loginPassword);
    if (!error) {
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(signupEmail, signupPassword, signupFullName);
    if (!error) {
      setActiveTab("login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with back button */}
      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="glass glass-hover"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Site
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="glass border-glass-border backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Lunaris Portal
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Acesse ou crie sua conta para continuar
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 glass">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary">
                    Cadastro
                  </TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login" className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground font-medium">
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 glass border-glass-border bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 pr-10 glass border-glass-border bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all"
                    >
                      Entrar no Portal
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-6">
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground font-medium">
                        Nome Completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu Nome"
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                          className="pl-10 glass border-glass-border bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground font-medium">
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10 glass border-glass-border bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 pr-10 glass border-glass-border bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all"
                    >
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Plataforma exclusiva para gerenciamento de campanhas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;