"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MapPin,
  Users,
  MoreHorizontal,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
  Calendar,
  Globe,
  Link as LinkIcon,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [statusFilter, setStatusFilter] = useState("all")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`)
        const data = await res.json()
        setEvents(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching events:", error)
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Filter events based on search query and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location.address && event.location.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || event.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
        <p className="text-muted-foreground">Manage and track all your events in one place.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events by title, location or type..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>Upcoming Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("live")}>Live Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Past Events</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.customization?.bannerUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge
                        className={
                          event.computedStatus === "live"
                            ? "bg-red-500 hover:bg-red-600"
                            : event.status === "upcoming"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {event.status === "live" ? "LIVE" : event.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.startTime)} - {formatDate(event.endTime)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location?.address || 'Virtual Event'}</span>
                      </div>
                      {event.location?.virtualLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Join Online
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-normal">
                          {event.eventType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button size="sm" onClick={() => handleManageEvent(event)}>
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          {formatDate(event.startTime)} - {formatDate(event.endTime)}
                        </TableCell>
                        <TableCell>
                          {event.location?.address || (
                            <a href={event.location?.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Virtual Event
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.eventType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              event.computedStatus === "live"
                                ? "bg-red-500 hover:bg-red-600"
                                : event.status === "upcoming"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                            }
                          >
                            {event.status === "live" ? "LIVE" : event.status === "upcoming" ? "Upcoming" : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" /> Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents
              .filter((event) => event.computedStatus === "upcoming")
              .map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.customization?.bannerUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-green-500 hover:bg-green-600">Upcoming</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.startTime)} - {formatDate(event.endTime)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location?.address || 'Virtual Event'}</span>
                      </div>
                      {event.location?.virtualLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Join Online
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-normal">
                          {event.eventType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button size="sm">Manage</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="live">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents
              .filter((event) => event.computedStatus === "live")
              .map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.customization?.bannerUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-red-500 hover:bg-red-600">LIVE</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.startTime)} - {formatDate(event.endTime)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location?.address || 'Virtual Event'}</span>
                      </div>
                      {event.location?.virtualLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Join Online
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-normal">
                          {event.eventType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button size="sm">Manage Stream</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents
              .filter((event) => event.computedStatus === "completed")
              .map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.customization?.bannerUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{formatDate(event.startTime)} - {formatDate(event.endTime)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location?.address || 'Virtual Event'}</span>
                      </div>
                      {event.location?.virtualLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={event.location.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Event Link
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-normal">
                          {event.eventType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button size="sm">Analytics</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      
      
      )}
    </div>
  )
}