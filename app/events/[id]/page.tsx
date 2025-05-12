"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Share2, Heart, Video } from "lucide-react"

export default function EventPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [suggestedEvents, setSuggestedEvents] = useState<any[]>([])

  const USER_ID = "681e52223ab5f5946dcacec0" 

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.id}`);
        console.log(params.id)
        const response = await res.json();
        setEvent(response);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_AI_BASE_URL}recommendations/${USER_ID}?top_n=3`);
        const response = await res.json();
        setSuggestedEvents(response.recommended_events || []);
      } catch (error) {
        console.error("Error fetching suggested events:", error);
      }
    }

    fetchEvent();
    fetchSuggestions();
  }, [params.id]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Event Banner */}
        {/* (Same as your existing code) */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img src={event.customization?.bannerUrl || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 md:h-24 md:w-24 rounded-lg overflow-hidden border-4 border-background">
                  <img src={event.customization?.logoUrl || "/placeholder.svg"} alt="Organizer Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-primary/90 hover:bg-primary/80">{event.eventType}</Badge>
                    {event.eventType === "virtual" && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Virtual Event
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold">{event.title}</h1>
                  <p className="text-muted-foreground mt-1">Status: {event.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Event Info */}
            <div className="flex-1">
              <Tabs defaultValue="details">
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  {event.eventType === "virtual" && <TabsTrigger value="stream">Live Stream</TabsTrigger>}
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <p className="prose dark:prose-invert max-w-none">{event.description}</p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <Button variant="outline" size="sm" className={`gap-2 ${isLiked ? "text-red-500" : ""}`} onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                      {isLiked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </TabsContent>

                {event.eventType === "virtual" && (
                  <TabsContent value="stream">
                    <div className="space-y-6">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <Video className="h-16 w-16 text-muted-foreground" />
                        <p className="text-muted-foreground ml-4">
                          Live stream link: <a href={event.location?.virtualLink} className="underline text-primary" target="_blank">{event.location?.virtualLink}</a>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Right Column - Details */}
            <div className="lg:w-96">
              <div className="glass-effect rounded-xl p-6 sticky top-24 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">{new Date(event.startTime).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">End Date</div>
                    <div className="text-sm text-muted-foreground">{new Date(event.endTime).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {event.location?.city}, {event.location?.state}, {event.location?.country}
                    </div>
                    <div className="text-xs text-muted-foreground">{event.location?.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Events Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Suggested Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedEvents.map((ev) => (
                <Link key={ev._id} href={`/events/${ev._id}`} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img src={ev.customization?.bannerUrl || "/placeholder.svg"} alt={ev.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-primary/90 hover:bg-primary/80">{ev.eventType}</Badge>
                      {ev.eventType === "virtual" && (
                        <Badge variant="outline" className="border-primary/50 text-primary">
                          Virtual Event
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      {new Date(ev.startTime).toLocaleDateString()} - {new Date(ev.endTime).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ev.location?.city}, {ev.location?.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
