"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Upload, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

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
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  type: z.string({
    required_error: "Please select an event type.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().optional(),
  virtualLink: z.string().url().optional(),
  capacity: z.string().optional(),
  isPublic: z.boolean().default(true),
  isFree: z.boolean().default(true),
  price: z.string().optional(),
})

export default function CreateEventPage() {
  const [step, setStep] = useState(1)
  const [eventType, setEventType] = useState("physical")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewBanner, setPreviewBanner] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [formData, setFormData] = useState({})

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "",
      location: "",
      virtualLink: "",
      capacity: "",
      isPublic: true,
      isFree: true,
      price: "",
    },
  })

  function onSubmitBasicInfo(values: z.infer<typeof formSchema>) {
    console.log(values)
    setFormData({ ...formData, ...values })
    setStep(2)
    window.scrollTo(0, 0)
  }

  function onSubmitDetails() {
    setStep(3)
    window.scrollTo(0, 0)
  }

  function onSubmitCustomization() {
    setStep(4)
    window.scrollTo(0, 0)
  }

  function onSubmitFinal() {
    const completeFormData = { ...formData, primaryColor, previewImage, previewBanner }
    console.log(completeFormData)
    // Here you would typically send the data to your API
    alert("Event created successfully!")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewBanner(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to create your event.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    step >= i ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i ? <Check className="h-5 w-5" /> : i}
                </div>
                {i < 4 && <div className={`h-1 w-16 md:w-24 ${step > i ? "gradient-bg" : "bg-muted"}`}></div>}
              </div>
            ))}
          </div>

          <Card className="glass-effect">
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Let's start with the essential details of your event.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitBasicInfo)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Annual Tech Conference 2025" {...field} />
                            </FormControl>
                            <FormDescription>This will be the main title displayed for your event.</FormDescription>
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
                              <Textarea placeholder="Describe your event..." className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>Provide details about what attendees can expect.</FormDescription>
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
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date (Optional)</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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
                              <FormLabel>End Time (Optional)</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="conference">Conference</SelectItem>
                                  <SelectItem value="workshop">Workshop</SelectItem>
                                  <SelectItem value="webinar">Webinar</SelectItem>
                                  <SelectItem value="networking">Networking</SelectItem>
                                  <SelectItem value="concert">Concert</SelectItem>
                                  <SelectItem value="exhibition">Exhibition</SelectItem>
                                  <SelectItem value="gala">Gala</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="business">Business</SelectItem>
                                  <SelectItem value="technology">Technology</SelectItem>
                                  <SelectItem value="education">Education</SelectItem>
                                  <SelectItem value="entertainment">Entertainment</SelectItem>
                                  <SelectItem value="arts">Arts & Culture</SelectItem>
                                  <SelectItem value="health">Health & Wellness</SelectItem>
                                  <SelectItem value="sports">Sports & Fitness</SelectItem>
                                  <SelectItem value="food">Food & Drink</SelectItem>
                                  <SelectItem value="charity">Charity & Causes</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant={eventType === "physical" ? "default" : "outline"}
                            onClick={() => setEventType("physical")}
                            className="w-full"
                          >
                            Physical Event
                          </Button>
                          <Button
                            type="button"
                            variant={eventType === "virtual" ? "default" : "outline"}
                            onClick={() => setEventType("virtual")}
                            className="w-full"
                          >
                            Virtual Event
                          </Button>
                          <Button
                            type="button"
                            variant={eventType === "hybrid" ? "default" : "outline"}
                            onClick={() => setEventType("hybrid")}
                            className="w-full"
                          >
                            Hybrid Event
                          </Button>
                        </div>

                        {(eventType === "physical" || eventType === "hybrid") && (
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Conference Center, City" {...field} />
                                </FormControl>
                                <FormDescription>The physical address where the event will take place.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {(eventType === "virtual" || eventType === "hybrid") && (
                          <FormField
                            control={form.control}
                            name="virtualLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Virtual Link</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://meeting.example.com/event" {...field} />
                                </FormControl>
                                <FormDescription>The URL where attendees can join the virtual event.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <Button type="submit" className="gradient-bg button-glow">
                        Continue to Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Configure additional details for your event.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <FormLabel>Capacity</FormLabel>
                      <Input placeholder="100" type="number" />
                      <FormDescription>Maximum number of attendees. Leave blank for unlimited.</FormDescription>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Visibility</h3>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Event</FormLabel>
                          <FormDescription>
                            Public events will be listed in the event directory and searchable.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Ticketing</h3>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Free Event</FormLabel>
                          <FormDescription>Attendees can register without payment.</FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Ticket Price</FormLabel>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                            $
                          </span>
                          <Input className="rounded-l-none" placeholder="0.00" type="number" step="0.01" />
                        </div>
                        <FormDescription>Set the price for paid tickets.</FormDescription>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Registration Options</h3>
                      <div className="space-y-2">
                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <Checkbox id="collect-names" />
                          <div className="space-y-1 leading-none">
                            <label
                              htmlFor="collect-names"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Collect attendee names
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Require attendees to provide their names during registration.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <Checkbox id="collect-emails" defaultChecked />
                          <div className="space-y-1 leading-none">
                            <label
                              htmlFor="collect-emails"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Collect attendee emails
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Require attendees to provide their email addresses during registration.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <Checkbox id="collect-phone" />
                          <div className="space-y-1 leading-none">
                            <label
                              htmlFor="collect-phone"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Collect phone numbers
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Require attendees to provide their phone numbers during registration.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button className="gradient-bg button-glow" onClick={onSubmitDetails}>
                        Continue to Customization
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Event Customization</CardTitle>
                  <CardDescription>Customize the appearance of your event page.</CardDescription>
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
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mb-2" />
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
                      <Input type="file" accept="image/*" onChange={handleBannerUpload} />
                      <p className="text-sm text-muted-foreground">Recommended size: 1200x400px. Max file size: 5MB.</p>
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
                          This color will be used for buttons and accents on your event page.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button className="gradient-bg button-glow" onClick={onSubmitCustomization}>
                      Continue to Preview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Event Preview</CardTitle>
                  <CardDescription>Review how your event will appear to attendees.</CardDescription>
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
                      <h2 className="text-2xl font-bold mb-2">{form.watch("title") || "Event Title"}</h2>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                          {form.watch("type")?.charAt(0).toUpperCase() + form.watch("type")?.slice(1) || "Event Type"}
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {form.watch("date") ? format(form.watch("date"), "PPP") : "Event Date"} •{" "}
                          {form.watch("time") || "Event Time"}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {form.watch("description") || "Event description will appear here..."}
                      </p>

                      <div className="mb-6">
                        <h3 className="font-medium mb-1">Location</h3>
                        <p className="text-sm text-muted-foreground">
                          {eventType === "physical"
                            ? form.watch("location") || "Physical location will appear here"
                            : eventType === "virtual"
                              ? form.watch("virtualLink") || "Virtual link will appear here"
                              : "Hybrid event - both physical and virtual options available"}
                        </p>
                      </div>

                      <Button style={{ backgroundColor: primaryColor }}>Register Now</Button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-8">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button className="gradient-bg button-glow" onClick={onSubmitFinal}>
                      Create Event
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
