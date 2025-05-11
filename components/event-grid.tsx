"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

type EventType = {
  _id: string
  title: string
  description: string
  eventType: string
  status: string
  startTime: string
  endTime: string
  location: {
    address: string
    city: string
    state: string
    country: string
    virtualLink?: string
  }
  customization: {
    colors: string
    logoUrl: string
    bannerUrl: string
  }
  organizerId: string
  createdAt: string
  updatedAt: string
}

export function EventGrid() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [allEvents, setAllEvents] = useState<EventType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`);
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = await res.json()
        setAllEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    let result = allEvents

    // Apply virtual/physical filter
    if (filter !== "all") {
      if (filter === "virtual") {
        result = result.filter((event) => !!event.location.virtualLink)
      } else if (filter === "physical") {
        result = result.filter((event) => !event.location.virtualLink)
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.location.address.toLowerCase().includes(query) ||
          event.eventType.toLowerCase().includes(query)
      )
    }

    setFilteredEvents(result)
  }, [filter, searchQuery, allEvents])

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground">Discover and join amazing events</p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
                <TabsTrigger value="virtual">Virtual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                date={`${new Date(event.startTime).toLocaleDateString()} - ${new Date(
                  event.endTime
                ).toLocaleDateString()}`}
                location={event.location.virtualLink ? "Online Event" : event.location.address}
                imageUrl={event.customization.bannerUrl}
                attendees={0} // Optional: replace with real data if available
                category={event.eventType}
                virtual={!!event.location.virtualLink}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="px-8">
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
