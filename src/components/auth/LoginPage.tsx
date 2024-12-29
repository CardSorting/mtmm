import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Location } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import {
  Github,
  Loader2,
  Mail,
  Twitter,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type AuthTab = "login" | "register" | "forgot-password";
type SocialProvider = "Google" | "GitHub" | "Twitter";

interface LocationState {
  from: Location;
}

interface FormState {
  login: {
    email: string;
    password: string;
  };
  register: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  reset: {
    email: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const [formState, setFormState] = useState<FormState>({
    login: { email: "", password: "" },
    register: { email: "", password: "", confirmPassword: "" },
    reset: { email: "" },
  });

  const from =
    (location.state as LocationState)?.from?.pathname || "/dashboard";

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        formState.login.email,
        formState.login.password
      );
      toast({ title: "Success", description: "Logged in successfully" });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error ? error.message : "Invalid login credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, confirmPassword } = formState.register;

    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description:
          "Registration successful! Please check your email to verify your account.",
      });
      setActiveTab("login");
    } catch (error: unknown) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, formState.reset.email);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
      setActiveTab("login");
    } catch (error: unknown) {
      toast({
        title: "Password Reset Failed",
        description:
          error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoading(true);
    try {
      let authProvider;
      switch (provider) {
        case "Google":
          authProvider = new GoogleAuthProvider();
          break;
        // Add cases for other providers as needed
        default:
          throw new Error("Unsupported provider");
      }

      await signInWithPopup(auth, authProvider);
      toast({ title: "Success", description: "Logged in successfully" });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error("Social login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error ? error.message : "Social login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormState = (
    form: keyof FormState,
    field: string,
    value: string,
  ): void => {
    setFormState((prev) => ({
      ...prev,
      [form]: {
        ...prev[form],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Matrix Mingle
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your gateway to AI companionship
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-2" />
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as AuthTab)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
                <TabsTrigger value="forgot-password">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("Google")}
                    className="w-full"
                    type="button"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin("GitHub")}
                    className="w-full"
                    type="button"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        value={formState.login.email}
                        onChange={(e) =>
                          updateFormState("login", "email", e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={formState.login.password}
                        onChange={(e) =>
                          updateFormState("login", "password", e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <CardDescription className="text-center pb-4">
                  Create a new account to get started
                </CardDescription>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={formState.register.email}
                        onChange={(e) =>
                          updateFormState("register", "email", e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={formState.register.password}
                        onChange={(e) =>
                          updateFormState(
                            "register",
                            "password",
                            e.target.value,
                          )
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={formState.register.confirmPassword}
                        onChange={(e) =>
                          updateFormState(
                            "register",
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="forgot-password" className="space-y-4">
                <CardDescription className="text-center pb-4">
                  Enter your email to receive a password reset link
                </CardDescription>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={formState.reset.email}
                        onChange={(e) =>
                          updateFormState("reset", "email", e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Send Reset Link
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
