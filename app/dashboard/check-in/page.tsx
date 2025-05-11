"use client"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, QrCode, Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for attendees
const attendees = [
  { id: 1, name: "John Doe", email: "john@example.com", ticketType: "VIP", checkedIn: true, checkInTime: "09:15 AM" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    ticketType: "Standard",
    checkedIn: true,
    checkInTime: "09:30 AM",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    ticketType: "VIP",
    checkedIn: false,
    checkInTime: null,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    ticketType: "Standard",
    checkedIn: false,
    checkInTime: null,
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    ticketType: "Standard",
    checkedIn: true,
    checkInTime: "10:05 AM",
  },
]

// {
//   "_id": "681e54388e0514b3bf92e3ba",
//   "registrationId": "681e53bfbab1a56edb9e5e74",
//   "checkedInBy": "681e532c637219b69310a8d4",
//   "method": "manual",
//   "timestamp": "2025-05-10T00:45:04.413Z"
// },




export default function CheckInPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cameraActive, setCameraActive] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("tech-conference")
  const [attendees, setAttendees] = useState([])

  // Filter attendees based on search query
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAttendees = attendees.length
  const checkedInCount = attendees.filter((a) => a.timestamp).length
  const checkedInPercentage = totalAttendees > 0 ? Math.round((checkedInCount / totalAttendees) * 100) : 0

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-ins`)
        console.log(res)
        const data = await res.json()
        setAttendees(data)
      } catch (err) {
        console.error("Error fetching check-in data:", err)
      }
    }

    fetchCheckIns()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendee Check-In</h1>
        <p className="text-muted-foreground">Manage attendee check-ins for your events.</p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Select Event</CardTitle>
            <CardDescription>Choose which event to manage check-ins for</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="tech-conference">Annual Tech Conference</option>
              <option value="charity-gala">Summer Charity Gala</option>
              <option value="city-marathon">City Marathon</option>
            </select>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Check-In Progress</CardTitle>
            <CardDescription>Current attendance statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{checkedInCount} / {totalAttendees}</span>
            </div>
            <Progress value={checkedInPercentage} className="h-2" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Checked In</span>
                <span className="text-2xl font-bold">{checkedInCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Remaining</span>
                <span className="text-2xl font-bold">{totalAttendees - checkedInCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Check-In</TabsTrigger>
          <TabsTrigger value="qr">QR Code Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>Clear</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ticket Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-In Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee) => {
                      const checkedIn = Boolean(attendee.timestamp)
                      const time = checkedIn
                        ? new Date(attendee.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "—"
                      return (
                        <TableRow key={attendee._id}>
                          <TableCell className="font-medium">{attendee.name || "—"}</TableCell>
                          <TableCell>{attendee.email || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={attendee.ticketType === "VIP" ? "default" : "outline"}>
                              {attendee.ticketType || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {checkedIn ? (
                              <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Check className="mr-1 h-3 w-3" /> Checked In
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Not Checked In
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{time}</TableCell>
                          <TableCell className="text-right">
                            {checkedIn ? (
                              <Button variant="outline" size="sm">
                                <X className="mr-1 h-3 w-3" /> Undo
                              </Button>
                            ) : (
                              <Button size="sm">
                                <Check className="mr-1 h-3 w-3" /> Check In
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No attendees found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>Scan attendee QR codes for quick check-in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                {cameraActive ? (
                  <div className="relative w-full max-w-md aspect-square bg-muted rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-primary/50 rounded-lg"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Camera feed would appear here
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                    <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground mb-4">Camera access is required to scan QR codes</p>
                    <Button onClick={() => setCameraActive(true)}>Start Camera</Button>
                  </div>
                )}
                {cameraActive && (
                  <div className="w-full max-w-md">
                    <Button variant="outline" className="w-full" onClick={() => setCameraActive(false)}>
                      Stop Camera
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}