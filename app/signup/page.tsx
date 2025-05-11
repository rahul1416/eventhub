"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, Mail, Check } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const accountFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must include uppercase, lowercase, and numbers.",
    }),
  confirmPassword: z.string(),
  accountType: z.enum(["personal", "organization"]),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  organizationName: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string({
    required_error: "Please select a country.",
  }),
});

const preferencesFormSchema = z.object({
  eventTypes: z.array(z.string()).nonempty({
    message: "Please select at least one event type.",
  }),
  marketingEmails: z.boolean().default(false),
  newsUpdates: z.boolean().default(false),
});

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const router = useRouter();

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "personal",
      termsAccepted: false,
    },
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      organizationName: "",
      phoneNumber: "",
      country: "",
    },
  });

  const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      eventTypes: [],
      marketingEmails: false,
      newsUpdates: false,
    },
  });

  async function saveUserToMongo(userId: string, allData: any) {
    try {
      const res = await fetch("/api/saveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...allData, firebaseUid: userId }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function onSubmitAccountForm(values: z.infer<typeof accountFormSchema>) {
    if (values.password !== values.confirmPassword) {
      accountForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setFormData({ ...formData, ...values, firebaseUid: user.uid });
        setStep(2);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        accountForm.setError("email", {
          type: "manual",
          message: error.message,
        });
      });
  }

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
          // New user, continue signup flow or ask for account type
          setFormData({ ...formData, firebaseUid: result.user.uid });
          setStep(2);
        }
      } catch (error) {
        // New user, continue signup flow
        setFormData({ ...formData, firebaseUid: result.user.uid });
        setStep(2);
      }
    } catch (error: any) {
      accountForm.setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  }

  // Email Link sign-up logic
  async function handleEmailLinkSignup() {
    const email = accountForm.getValues("email");
    if (!email) {
      accountForm.setError("email", {
        type: "manual",
        message: "Please enter your email to receive a sign-up link.",
      });
      return;
    }
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/signup", // Use localhost for now
        handleCodeInApp: true,
      });
      window.localStorage.setItem("emailForSignIn", email);
      setEmailLinkSent(true);
    } catch (error: any) {
      accountForm.setError("email", {
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
        email =
          window.prompt("Please provide your email for confirmation") || "";
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn");
            setFormData({ ...formData, email, firebaseUid: result.user.uid });
            setStep(2);
            window.scrollTo(0, 0);
          })
          .catch((error) => {
            accountForm.setError("email", {
              type: "manual",
              message: error.message,
            });
          });
      }
    }
    // eslint-disable-next-line
  }, [formData, accountForm, auth]);

  function onSubmitProfileForm(values: z.infer<typeof profileFormSchema>) {
    setFormData({ ...formData, ...values });
    setStep(3);
    window.scrollTo(0, 0);
  }

  async function onSubmitPreferencesForm(
    values: z.infer<typeof preferencesFormSchema>
  ) {
    const completeFormData = { ...formData, ...values };
    // Save to MongoDB
    if (completeFormData.firebaseUid) {
      await saveUserToMongo(completeFormData.firebaseUid, completeFormData);
    }
    // Redirect based on account type
    if (formData.accountType === "organization") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard/personal");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="glass-effect">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Sign up to start creating and managing your events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step >= i
                          ? "gradient-bg text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > i ? <Check className="h-5 w-5" /> : i}
                    </div>
                    {i < 3 && (
                      <div
                        className={`h-1 w-16 ${
                          step > i ? "gradient-bg" : "bg-muted"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Sign up with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleEmailLinkSignup}
                      disabled={emailLinkSent}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {emailLinkSent
                        ? "Email Link Sent"
                        : "Sign up with Email Link"}
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

                  <Form {...accountForm}>
                    <form
                      onSubmit={accountForm.handleSubmit(onSubmitAccountForm)}
                      className="space-y-4"
                    >
                      <FormField
                        control={accountForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="name@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
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
                            <FormDescription>
                              Must be at least 8 characters with uppercase,
                              lowercase, and numbers.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="accountType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Account Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="personal" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Personal Account
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="organization" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Organization Account
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="font-medium text-primary hover:underline underline-offset-4"
                                >
                                  terms of service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="/privacy"
                                  className="font-medium text-primary hover:underline underline-offset-4"
                                >
                                  privacy policy
                                </Link>
                                .
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full gradient-bg button-glow"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </>
              )}

              {step === 2 && (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfileForm)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {accountForm.getValues().accountType === "organization" && (
                      <FormField
                        control={profileForm.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={profileForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="in">India</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="jp">Japan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="gradient-bg button-glow">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {step === 3 && (
                <Form {...preferencesForm}>
                  <form
                    onSubmit={preferencesForm.handleSubmit(
                      onSubmitPreferencesForm
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={preferencesForm.control}
                      name="eventTypes"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              What types of events are you interested in?
                            </FormLabel>
                            <FormDescription>
                              Select all that apply.
                            </FormDescription>
                          </div>
                          {[
                            "Gala",
                            "Conference",
                            "Virtual",
                            "Marathon",
                          ].map((item) => (
                            <FormField
                              key={item}
                              control={preferencesForm.control}
                              name="eventTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.charAt(0).toUpperCase() +
                                        item.slice(1)}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Communication Preferences
                      </h3>
                      <FormField
                        control={preferencesForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Marketing emails
                              </FormLabel>
                              <FormDescription>
                                Receive emails about new features and offers.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferencesForm.control}
                        name="newsUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                News and updates
                              </FormLabel>
                              <FormDescription>
                                Receive the latest news and updates.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="gradient-bg button-glow">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Sign in
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
