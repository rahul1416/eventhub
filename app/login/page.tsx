"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { auth } from "@/firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Google sign-in logic
  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Fetch account type from MongoDB
      try {
        const response = await fetch(`/api/users/${result.user.uid}`);
        const userData = await response.json();

        if (userData && userData.accountType === "personal") {
          router.push("/dashboard/personal");
        } else if (userData && userData.accountType === "organization") {
          router.push("/dashboard");
        } else {
          // New user or missing accountType, redirect to signup
          router.push("/signup");
        }
      } catch (error) {
        router.push("/signup");
      }
    } catch (error: any) {
      form.setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  }

  // Email Link sign-in logic
  async function handleEmailLinkSignIn() {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Please enter your email to receive a sign-in link.",
      });
      return;
    }
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/login", // Use localhost for now
        handleCodeInApp: true,
      });
      window.localStorage.setItem("emailForSignIn", email);
      setEmailLinkSent(true);
    } catch (error: any) {
      form.setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  }

  // Handle sign-in with email link if present in URL
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      isSignInWithEmailLink(auth, window.location.href)
    ) {
      let email = window.localStorage.getItem("emailForSignIn") || "";
      if (!email) {
        // Prompt user for email if not available
        email =
          window.prompt("Please provide your email for confirmation") || "";
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem("emailForSignIn");
            // Fetch account type from MongoDB
            try {
              const response = await fetch(`/api/users/${result.user.uid}`);
              const userData = await response.json();
              if (userData && userData.accountType === "personal") {
                router.push("/dashboard/personal");
              } else if (userData && userData.accountType === "organization") {
                router.push("/dashboard");
              } else {
                router.push("/signup");
              }
            } catch (error) {
              router.push("/dashboard");
            }
          })
          .catch((error) => {
            form.setError("email", {
              type: "manual",
              message: error.message,
            });
          });
      }
    }
  }, [router, form, auth]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Fetch the user's account type from your database
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          const userData = await response.json();

          if (userData && userData.accountType === "personal") {
            router.push("/dashboard/personal");
          } else if (userData && userData.accountType === "organization") {
            router.push("/dashboard");
          } else {
            router.push("/signup");
          }
        } catch (error) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        form.setError("email", {
          type: "manual",
          message: error.message,
        });
      });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="glass-effect">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue managing your events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEmailLinkSignIn}
                  disabled={emailLinkSent}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {emailLinkSent
                    ? "Email Link Sent"
                    : "Sign in with Email Link"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-bg button-glow"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
