"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initFirebase } from "@/lib/firebase";

export default function SavedEventsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Firebase and get current user
    const app = initFirebase();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);

      // Mock data loading
      setTimeout(() => {
        setSavedEvents([
          {
            id: "evt-3",
            title: "Business Summit",
            date: new Date("2025-04-10T08:30:00"),
            location: "Virtual Event",
            image: "/placeholder.svg",
          },
          {
            id: "evt-4",
            title: "Art Exhibition",
            date: new Date("2025-05-05T11:00:00"),
            location: "Modern Art Museum",
            image: "/placeholder.svg",
          },
          {
            id: "evt-5",
            title: "Community Fundraiser",
            date: new Date("2025-06-18T17:30:00"),
            location: "City Park",
            image: "/placeholder.svg",
          },
        ]);
        setLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  // Filter events based on search query
  const filteredEvents = savedEvents.filter(
    (event: any) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading saved events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Events</h1>
        <p className="text-muted-foreground">
          Events you've bookmarked for later.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event: any) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {format(new Date(event.date), "PPP 'at' p")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/events/${event.id}/register`}>Register</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Saved Events</CardTitle>
            <CardDescription>
              You haven't saved any events yet. Browse events and save ones
              you're interested in!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
