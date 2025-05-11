"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, MessageSquare, Users, Settings, Video, Archive } from "lucide-react"

export default function BroadcastsPage() {
  const [isLive, setIsLive] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "John Doe", message: "Hello everyone! Excited for the event.", time: "10:15 AM" },
    { id: 2, user: "Jane Smith", message: "The presentation looks great!", time: "10:17 AM" },
    { id: 3, user: "Robert Johnson", message: "When will the Q&A session start?", time: "10:20 AM" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          user: "You (Host)",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Broadcasting</h1>
        <p className="text-muted-foreground">Manage your virtual events and live streams.</p>
      </div>

      <Tabs defaultValue="live">
        <TabsList>
          <TabsTrigger value="live">Live Stream</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Product Launch Webinar</CardTitle>
                      <CardDescription>Live stream to your virtual attendees</CardDescription>
                    </div>
                    <Badge
                      variant={isLive ? "destructive" : "outline"}
                      className={isLive ? "bg-red-100 text-red-800 hover:bg-red-100" : ""}
                    >
                      {isLive ? "LIVE" : "OFFLINE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isLive ? (
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Live stream is active</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Preview your camera before going live</p>
                        </div>
                      )}
                    </div>
                    {isLive && (
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">LIVE</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                        <Users className="h-3 w-3 inline mr-1" /> 78 watching
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" /> Stream Settings
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-2" /> Record
                    </Button>
                  </div>
                  <Button variant={isLive ? "destructive" : "default"} onClick={() => setIsLive(!isLive)}>
                    {isLive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> End Stream
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> Go Live
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stream Information</CardTitle>
                  <CardDescription>Configure your broadcast details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input defaultValue="Product Launch Webinar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea defaultValue="Join us for the exclusive launch of our newest product line. We'll be showcasing features, pricing, and availability." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" defaultValue="2025-05-15" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Time</label>
                      <Input type="time" defaultValue="10:00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stream URL (for OBS/Streaming Software)</label>
                    <div className="flex">
                      <Input defaultValue="rtmp://stream.eventshub.com/live/prod-launch-123" readOnly />
                      <Button variant="outline" className="ml-2">
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Live Chat</CardTitle>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" /> 42 active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div className="h-[500px] overflow-y-auto space-y-4 pr-2">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-medium text-xs">{msg.user.charAt(0)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit">
                      <MessageSquare className="h-4 w-4 mr-2" /> Send
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Q2 Investor Update",
                date: "June 15, 2025",
                time: "2:00 PM",
                attendees: 120,
              },
              {
                title: "Product Demo Webinar",
                date: "June 22, 2025",
                time: "11:00 AM",
                attendees: 85,
              },
              {
                title: "Industry Panel Discussion",
                date: "July 5, 2025",
                time: "3:30 PM",
                attendees: 150,
              },
            ].map((event, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {event.date} at {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} registered attendees</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stream URL:</span>
                      <span className="font-mono text-xs">rtmp://stream.eventshub.com/live/investor-123</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configure Stream
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="space-y-4">
            {[
              {
                title: "Annual Shareholder Meeting",
                date: "April 10, 2025",
                duration: "1h 45m",
                views: 342,
              },
              {
                title: "New Feature Walkthrough",
                date: "March 22, 2025",
                duration: "52m",
                views: 189,
              },
              {
                title: "Team Q&A Session",
                date: "February 15, 2025",
                duration: "1h 12m",
                views: 156,
              },
            ].map((recording, i) => (
              <Card key={i}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-40 bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-lg">{recording.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Recorded on {recording.date} • {recording.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" /> {recording.views} views
                        </Badge>
                        <Button size="sm">Watch</Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
