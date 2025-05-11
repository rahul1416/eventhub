"use client";

import React from "react";
import { useState, useEffect } from "react";
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

// Form schema based on the provided event schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  eventType: z.string({
    required_error: "Please select an event type.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  endTime: z.string().min(1, {
    message: "End time is required.",
  }),
  locationType: z.enum(["physical", "virtual"]),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  virtualLink: z.string().optional(), // Changed from url() to string() to allow empty values
});

export default function CreateEventPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [locationType, setLocationType] = useState("physical");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("Wheat");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen for Firebase auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  // Example API fetch - can be used for other features
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events` 
          : "/api/events";
          
        console.log('Fetching from:', apiUrl);
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          console.log('Events fetched:', data);
        } else {
          console.log('API response status:', res.status);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "concert",
      startTime: "",
      endTime: "",
      locationType: "physical",
      address: "",
      city: "",
      state: "",
      country: "",
      virtualLink: "",
    },
  });

  // Handle logo upload and convert to URL
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Logo must be less than 1MB.");
    }
  };

  // Handle banner upload and convert to URL
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Banner image must be less than 1MB.");
    }
  };

  // Main form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    setIsSubmitting(true);
    
    try {
      // Format dates and times to match the schema
      const startDateTime = new Date(values.startDate);
      const [startHours, startMinutes] = values.startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);
      
      const endDateTime = new Date(values.endDate);
      const [endHours, endMinutes] = values.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);
      
      // Create location object based on the schema structure from the example
      const location = {
        address: values.locationType === "physical" ? values.address : "",
        city: values.locationType === "physical" ? values.city : "",
        state: values.locationType === "physical" ? values.state : "",
        country: values.locationType === "physical" ? values.country : "",
        virtualLink: values.locationType === "virtual" ? values.virtualLink : "",
      };
      
      // Create customization object matching schema format
      const customization = {
        colors: primaryColor,
        logoUrl: logoUrl || "https://placekitten.com/691/91",
        bannerUrl: bannerUrl || "https://dummyimage.com/889x599",
      };
      
      // Create payload exactly matching the provided schema format
      const payload = {
        title: values.title,
        description: values.description,
        eventType: values.eventType,
        status: "live",
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: location,
        customization: customization,
        organizerId: userId || "681e52223ab5f5946dcacec8", // Using the example organizerId if no user ID
      };
      
      console.log('Sending payload:', payload);
      
      // Make sure we have the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events` 
        : "/api/events";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to create event: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Event created:", data);
      alert("Event created successfully!");
      
    } catch (error) {
      console.error("Error creating event:", error);
      alert("There was an error creating the event. Please check console for details.");
    } finally {
      setIsSubmitting(false);
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

      <Form {...form}>
        <form id="createEventForm" onSubmit={form.handleSubmit(onSubmit)}>
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
                <CardContent className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="eventType"
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

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
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
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
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
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="locationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Type</FormLabel>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant={
                                field.value === "physical" ? "default" : "outline"
                              }
                              onClick={() => {
                                field.onChange("physical");
                                setLocationType("physical");
                              }}
                              className="w-full"
                            >
                              Physical Event
                            </Button>
                            <Button
                              type="button"
                              variant={
                                field.value === "virtual" ? "default" : "outline"
                              }
                              onClick={() => {
                                field.onChange("virtual");
                                setLocationType("virtual");
                              }}
                              className="w-full"
                            >
                              Virtual Event
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {locationType === "physical" ? (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Conference Center"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
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
                              The URL where attendees can join the virtual event.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("customization")}
                    className="ml-auto"
                  >
                    Continue to Customization
                  </Button>
                </CardFooter>
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
                        {logoUrl ? (
                          <img
                            src={logoUrl}
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
                          Recommended size: 200x200px. Max file size: 1MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Banner Image</h3>
                    <div className="space-y-2">
                      <div className="h-40 w-full rounded-lg border flex items-center justify-center overflow-hidden">
                        {bannerUrl ? (
                          <img
                            src={bannerUrl}
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
                        Recommended size: 1200x400px. Max file size: 1MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme Color</h3>
                    <div className="flex items-center gap-4">
                      <Select
                        value={primaryColor}
                        onValueChange={setPrimaryColor}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Crimson">Crimson</SelectItem>
                          <SelectItem value="SteelBlue">Steel Blue</SelectItem>
                          <SelectItem value="ForestGreen">Forest Green</SelectItem>
                          <SelectItem value="Purple">Purple</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                      <p className="text-sm text-muted-foreground flex-1">
                        This color will be used for buttons and accents on your event page.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Back to Details
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                  >
                    Continue to Preview
                  </Button>
                </CardFooter>
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
                      {bannerUrl ? (
                        <img
                          src={bannerUrl}
                          alt="Event banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Banner Image
                        </div>
                      )}
                      {logoUrl && (
                        <div className="absolute bottom-0 left-4 transform translate-y-1/2 h-16 w-16 rounded-full border-4 border-background overflow-hidden bg-background">
                          <img
                            src={logoUrl}
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
                        <span 
                          className="inline-flex h-6 items-center rounded-full px-2 text-xs font-medium"
                          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                          {form.watch("eventType")?.charAt(0).toUpperCase() +
                            form.watch("eventType")?.slice(1) || "Event Type"}
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {form.watch("startDate")
                            ? format(form.watch("startDate"), "PPP")
                            : "Start Date"}{" "}
                          • {form.watch("startTime") || "Start Time"}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {form.watch("description") ||
                          "Event description will appear here..."}
                      </p>

                      <div className="mb-6">
                        <h3 className="font-medium mb-1">Location</h3>
                        {locationType === "physical" ? (
                          <p className="text-sm text-muted-foreground">
                            {[
                              form.watch("address"),
                              form.watch("city"),
                              form.watch("state"),
                              form.watch("country"),
                            ]
                              .filter(Boolean)
                              .join(", ") || "Physical location details will appear here"}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            <a href={form.watch("virtualLink")} target="_blank" rel="noopener noreferrer" className="text-primary">
                              {form.watch("virtualLink") || "Virtual link will appear here"}
                            </a>
                          </p>
                        )}
                      </div>

                      <Button style={{ backgroundColor: primaryColor }}>
                        Register Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("customization")}
                  >
                    Back to Customization
                  </Button>
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
      {/* </Tabs> */}
    </div>
  );
}