"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Calendar, MapPin, Clock, } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { User } from "firebase/auth";


export default function SuggestedEventsPage() {
  const [suggestedEvents, setSuggestedEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState()
  // const [user, setUser] = useState([]);
  const USER_ID = "681e52223ab5f5946dcacec0"
  // if (user){
  //   console.log(user)
  // }

  // useEffect(() => {
  //   const fetchSuggestions = async () => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`)
  //       console.log("res",res)
  //       if (!res.ok) throw new Error("Failed to fetch suggestions")
  //       const response = await res.json()
  //       // setData(response)
  //       console.log("data",res)
  //     } catch (error) {
  //       console.error("Error fetching suggested events:", error)
  //       setError("Failed to load suggestions. Please try again later.")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchSuggestions()
  // }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_AI_BASE_URL}recommendations/${USER_ID}?top_n=4`)
        if (!res.ok) throw new Error("Failed to fetch suggestions")
        const response = await res.json()
        setSuggestedEvents(response.recommended_events || [])
      } catch (error) {
        console.error("Error fetching suggested events:", error)
        setError("Failed to load suggestions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 space-y-8">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center space-y-4">
          <div className="text-destructive">{error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (suggestedEvents.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center space-y-4">
          <div className="text-muted-foreground">No event suggestions available</div>
          <Button asChild>
            <Link href="/events">Browse All Events</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8 space-y-8 mt-16">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Recommended For You</h1>
          <p className="text-muted-foreground">
            Events we think you'll love based on your preferences
          </p>
        </div>

        {/* Featured event */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Featured Recommendation</h2>
          <Link href={`/events/${suggestedEvents[0]._id}`} className="group block">
            <Card className="relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src={suggestedEvents[0].customization?.bannerUrl || "/placeholder.svg"}
                  alt={suggestedEvents[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {suggestedEvents[0].eventType}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{suggestedEvents[0].title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {suggestedEvents[0].description}
                </CardDescription>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(suggestedEvents[0].startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(suggestedEvents[0].startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {suggestedEvents[0].location?.city}, {suggestedEvents[0].location?.country}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {/* <User className="h-4 w-4" /> */}
                    {suggestedEvents[0].organizer?.name || 'Unknown organizer'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Other recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">More Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedEvents.slice(1).map((event) => (
              <Link key={event._id} href={`/events/${event._id}`} className="group">
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={event.customization?.bannerUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">
                      {event.eventType}
                    </Badge>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location?.city}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse all events CTA */}
        <div className="pt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/events" className="text-sm">
              Browse All Events
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}