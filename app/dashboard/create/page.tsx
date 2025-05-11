"use client";

import React from "react";

import { useState , useEffect} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  type: z.string({
    required_error: "Please select an event type.",
  }),
  location: z.string().optional(),
  virtualLink: z.string().url().optional(),
});

export default function CreateEventPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [eventType, setEventType] = useState("physical");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [eventData, setEventData] = useState<any>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for Firebase auth user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      const fetchCheckIns = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`)
          console.log(res)
          const data = await res.json()
          console.log('data feteched', data)
        } catch (err) {
          console.error("Error fetching check-in data:", err)
        }
      }
  
      fetchCheckIns()
    }, [])
  

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        time: "",
        location: "",
        virtualLink: "",
      },
    });

  // Restrict image size and convert to base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Logo must be less than 1MB.");
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Banner image must be less than 1MB.");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted');
    const payload = {
      title: values.title,
      description: values.description,
      date: values.date.toISOString(),
      time: values.time,
      type: values.type,
      location: values.location ?? null,
      virtualLink: values.virtualLink ?? null,
      logo: previewImage,
      banner: previewBanner,
      primaryColor: primaryColor,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      
      const data = await response.json();
      console.log("Event created:", data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("There was an error creating the event.");
    }
  };
  
  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new event.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>
                Enter the basic details about your event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id = 'create event'
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Annual Tech Conference 2025"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be the main title displayed for your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about what attendees can expect.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gala">Gala</SelectItem>
                            <SelectItem value="concert">Concert</SelectItem>
                            <SelectItem value="marathon">Marathon</SelectItem>
                            <SelectItem value="virtual">Virtual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={
                          eventType === "physical" ? "default" : "outline"
                        }
                        onClick={() => setEventType("physical")}
                        className="w-full"
                      >
                        Physical Event
                      </Button>
                      <Button
                        type="button"
                        variant={
                          eventType === "virtual" ? "default" : "outline"
                        }
                        onClick={() => setEventType("virtual")}
                        className="w-full"
                      >
                        Virtual Event
                      </Button>
                    </div>

                    {eventType === "physical" ? (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Conference Center, City"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The physical address where the event will take
                              place.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="virtualLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Virtual Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://meeting.example.com/event"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The URL where attendees can join the virtual
                              event.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => setActiveTab("customization")}
                  >
                    Continue to Customization
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>Event Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your event page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-lg border flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended size: 200x200px. Max file size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Banner Image</h3>
                <div className="space-y-2">
                  <div className="h-40 w-full rounded-lg border flex items-center justify-center overflow-hidden">
                    {previewBanner ? (
                      <img
                        src={previewBanner || "/placeholder.svg"}
                        alt="Banner preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <span>Upload a banner image</span>
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 1200x400px. Max file size: 5MB.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Theme Color</h3>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      This color will be used for buttons and accents on your
                      event page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Details
                </Button>
                <Button onClick={() => setActiveTab("preview")}>
                  Continue to Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Event Preview</CardTitle>
              <CardDescription>
                Review how your event will appear to attendees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="h-48 bg-muted relative">
                  {previewBanner ? (
                    <img
                      src={previewBanner || "/placeholder.svg"}
                      alt="Event banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Banner Image
                    </div>
                  )}
                  {previewImage && (
                    <div className="absolute bottom-0 left-4 transform translate-y-1/2 h-16 w-16 rounded-full border-4 border-background overflow-hidden bg-background">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Event logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 pt-10">
                  <h2 className="text-2xl font-bold mb-2">
                    {form.watch("title") || "Event Title"}
                  </h2>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                      {form.watch("type")?.charAt(0).toUpperCase() +
                        form.watch("type")?.slice(1) || "Event Type"}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {form.watch("date")
                        ? format(form.watch("date"), "PPP")
                        : "Event Date"}{" "}
                      • {form.watch("time") || "Event Time"}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {form.watch("description") ||
                      "Event description will appear here..."}
                  </p>

                  <div className="mb-6">
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {eventType === "physical"
                        ? form.watch("location") ||
                          "Physical location will appear here"
                        : form.watch("virtualLink") ||
                          "Virtual link will appear here"}
                    </p>
                  </div>

                  <Button style={{ backgroundColor: primaryColor }}>
                    Register Now
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("customization")}
              >
                Back to Customization
              </Button>
              <Button onClick={() => form.handleSubmit(onSubmit)}>
                Create Event 1
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
