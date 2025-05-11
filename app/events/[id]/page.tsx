"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Share2, Heart, MessageSquare, Video } from "lucide-react"

export default function EventPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [Ievent,setEvent] = useState([])
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/`);
        const response = await res.json();
        console.log("Fetched Events:", response); 
        setEvent(response)
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEvents();
  }, []);
  // Mock event data - in a real app, you would fetch this based on the ID
  const event = {
    id: params.id,
    title: "Tech 2025",
    description:
      "Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and learn about the latest innovations in technology.",
    longDescription: `
      <p>The Tech Conference 2025 is the premier event for technology professionals, entrepreneurs, and enthusiasts. This three-day event will feature keynote speeches from industry leaders, hands-on workshops, networking opportunities, and product showcases.</p>
      
      <p>Our agenda includes sessions on artificial intelligence, blockchain, cybersecurity, cloud computing, and more. Whether you're a developer, designer, product manager, or executive, there's something for everyone at this conference.</p>
      
      <h3>What to Expect:</h3>
      <ul>
        <li>Inspiring keynote presentations</li>
        <li>In-depth technical workshops</li>
        <li>Panel discussions on emerging trends</li>
        <li>Networking events and social gatherings</li>
        <li>Product demos and exhibitions</li>
        <li>Career opportunities and job fair</li>
      </ul>
      
      <p>Don't miss this opportunity to stay ahead of the curve and connect with the brightest minds in the industry!</p>
    `,
    date: "May 15-17, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco Convention Center",
    address: "747 Howard St, San Francisco, CA 94103",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    bannerUrl: "/placeholder.svg?height=600&width=1200",
    category: "Conference",
    organizer: "TechEvents Inc.",
    organizerLogo: "/placeholder.svg?height=100&width=100",
    attendees: 1250,
    speakers: [
      { name: "Jane Smith", role: "CEO, TechCorp", avatar: "/placeholder.svg?height=100&width=100" },
      { name: "John Doe", role: "CTO, InnovateTech", avatar: "/placeholder.svg?height=100&width=100" },
      { name: "Sarah Johnson", role: "AI Researcher", avatar: "/placeholder.svg?height=100&width=100" },
    ],
    agenda: [
      { day: "Day 1", title: "Opening Keynote", time: "9:00 AM - 10:30 AM", speaker: "Jane Smith" },
      { day: "Day 1", title: "Future of AI Panel", time: "11:00 AM - 12:30 PM", speaker: "Multiple Speakers" },
      { day: "Day 1", title: "Networking Lunch", time: "12:30 PM - 2:00 PM", speaker: "" },
      { day: "Day 2", title: "Blockchain Workshop", time: "9:00 AM - 11:00 AM", speaker: "John Doe" },
      { day: "Day 2", title: "Cybersecurity Talk", time: "11:30 AM - 12:30 PM", speaker: "Sarah Johnson" },
      { day: "Day 3", title: "Closing Remarks", time: "4:00 PM - 5:00 PM", speaker: "Jane Smith" },
    ],
    ticketTypes: [
      {
        name: "Standard",
        price: 299,
        benefits: ["Access to all sessions", "Lunch and refreshments", "Conference materials"],
      },
      {
        name: "VIP",
        price: 599,
        benefits: ["Standard benefits", "VIP lounge access", "Exclusive networking event", "Speaker meet & greet"],
      },
    ],
    virtual: false,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Event Banner */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img src={event.bannerUrl || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 md:h-24 md:w-24 rounded-lg overflow-hidden border-4 border-background">
                  <img
                    src={event.organizerLogo || "/placeholder.svg"}
                    alt={event.organizer}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-primary/90 hover:bg-primary/80">{event.category}</Badge>
                    {event.virtual && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Virtual Event
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold">{event.title}</h1>
                  <p className="text-muted-foreground mt-1">Organized by {event.organizer}</p>
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
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                  {event.virtual && <TabsTrigger value="stream">Live Stream</TabsTrigger>}
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.longDescription }} />
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                      {isLiked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="agenda">
                  <div className="space-y-6">
                    {["Day 1", "Day 2", "Day 3"].map((day) => (
                      <div key={day}>
                        <h3 className="text-xl font-bold mb-4">{day}</h3>
                        <div className="space-y-4">
                          {event.agenda
                            .filter((item) => item.day === day)
                            .map((item, index) => (
                              <div key={index} className="flex border-l-2 border-primary pl-4">
                                <div className="w-32 flex-shrink-0 text-muted-foreground">{item.time}</div>
                                <div>
                                  <h4 className="font-medium">{item.title}</h4>
                                  {item.speaker && (
                                    <p className="text-sm text-muted-foreground">Speaker: {item.speaker}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="speakers">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                          <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{speaker.name}</h3>
                          <p className="text-sm text-muted-foreground">{speaker.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {event.virtual && (
                  <TabsContent value="stream">
                    <div className="space-y-6">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <Video className="h-16 w-16 text-muted-foreground" />
                        <p className="text-muted-foreground ml-4">
                          Live stream will be available when the event starts
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Live Chat</h3>
                        <div className="h-64 bg-muted/50 rounded mb-4 flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-muted-foreground mr-2" />
                          <span className="text-muted-foreground">Chat will be enabled during the live stream</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                            disabled
                          />
                          <Button disabled>Send</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Right Column - Registration */}
            <div className="lg:w-96">
              <div className="glass-effect rounded-xl p-6 sticky top-24">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{event.location}</div>
                      <div className="text-xs text-muted-foreground">{event.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Attendees</div>
                      <div className="text-sm text-muted-foreground">{event.attendees} people attending</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-lg">Ticket Options</h3>

                  {event.ticketTypes.map((ticket, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{ticket.name}</h4>
                        <div className="text-lg font-bold">${ticket.price}</div>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        {ticket.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full gradient-bg button-glow">Select</Button>
                    </div>
                  ))}
                </div>

                <Link href={`/events/${event.id}/register`}>
                  <Button className="w-full gradient-bg button-glow py-6 text-lg">Register Now</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Similar Events */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Events You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <div key={id} className="group relative overflow-hidden rounded-xl card-hover">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=400&width=600`}
                      alt="Event"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">Related Tech Event {id}</h3>
                    <div className="flex flex-col gap-2 mb-4 opacity-90">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">June {id + 10}, 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm line-clamp-1">San Francisco, CA</span>
                      </div>
                    </div>

                    <Link href={`/events/${id}`}>
                      <Button className="w-full gradient-bg button-glow border-0">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
