"use client";
import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarDays, Clock, Users, DollarSign } from "lucide-react";

// Utility to fetch data from API
const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);

  useEffect(() => {
    async function load() {
      const [ev, tix, regs, live] = await Promise.all([
        fetchData("events"),
        fetchData("tickets"),
        fetchData("registrations"),
        fetchData("live-streams"),
      ]);
      setEvents(ev);
      setTickets(tix);
      setRegistrations(regs);
      setLiveStreams(live);
    }
    load();
  }, []);

  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");
  const totalAttendees = registrations.length;
  const revenue = tickets.reduce((sum, ticket) => sum + ((ticket.price || 0) * (ticket.sold || 0)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your events and performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={<CalendarDays />} title="Total Events" value={totalEvents} hint="+2 from last month" />
        <SummaryCard icon={<Clock />} title="Upcoming Events" value={upcomingEvents.length} hint="Next event in 3 days" />
        <SummaryCard icon={<Users />} title="Total Attendees" value={totalAttendees} hint="+201 from last month" />
        <SummaryCard icon={<DollarSign />} title="Revenue" value={`$${revenue.toFixed(2)}`} hint="+$2,174 from last month" />
      </div>

      {/* Tabs for Event Categories */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="space-y-4">
          <EventGrid events={upcomingEvents} registrations={registrations} />
        </TabsContent>

        {/* Live Events */}
        <TabsContent value="live" className="space-y-4">
          {liveStreams.filter((s) => s.isLive).length > 0 ? (
            liveStreams
              .filter((stream) => stream.isLive)
              .map((stream, idx) => {
                const event = events.find((e) => e._id === stream.eventId);
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle>{event?.title || "Live Event"}</CardTitle>
                      <CardDescription>Started recently</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{event?.title || "Live Event"}</h3>
                          <p className="text-sm text-muted-foreground">Live now</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-medium">LIVE</span>
                          </div>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {registrations.filter((r) => r.eventId === event?._id).length} watching
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Live Events</CardTitle>
                <CardDescription>There are currently no live events.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        {/* Past Events */}
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>You have {pastEvents.length} completed events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pastEvents.map((event, i) => (
                  <div key={i} className="flex justify-between rounded-lg border p-3">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.endTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ----------- Reusable Components ----------- */

function SummaryCard({ icon, title, value, hint }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function EventGrid({ events, registrations }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{new Date(event.startTime).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                  {event.eventType}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {registrations.filter((reg) => reg.eventId === event._id).length}
                </span>
              </div>
              <div className="text-sm font-medium text-primary">Manage</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
