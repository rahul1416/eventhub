"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { initFirebase } from "@/lib/firebase";
import {
  Ticket,
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  User,
  Edit,
  Download,
  QrCode,
  Loader2,
  Save,
  ArrowRight,
} from "lucide-react";

// Mock data for tickets
const mockTickets = [
  {
    id: "tkt-001",
    eventId: "evt-1",
    eventName: "Tech Conference 2025",
    eventDate: "2025-06-15T09:00:00",
    ticketType: "VIP",
    purchaseDate: "2025-03-10T14:30:00",
    price: 599,
    status: "active",
    qrCode: "qr-code-data-1",
  },
  {
    id: "tkt-002",
    eventId: "evt-2",
    eventName: "Music Festival",
    eventDate: "2025-07-22T16:00:00",
    ticketType: "Standard",
    purchaseDate: "2025-05-01T10:15:00",
    price: 199,
    status: "active",
    qrCode: "qr-code-data-2",
  },
  {
    id: "tkt-003",
    eventId: "evt-3",
    eventName: "Business Summit",
    eventDate: "2025-04-10T08:30:00",
    ticketType: "VIP",
    purchaseDate: "2025-02-15T09:45:00",
    price: 899,
    status: "used",
    qrCode: "qr-code-data-3",
  },
];

// Mock data for registered events
const mockRegisteredEvents = [
  {
    id: "evt-1",
    name: "Tech Conference 2025",
    date: "2025-06-15T09:00:00",
    location: "San Francisco Convention Center",
    status: "upcoming",
    ticketType: "VIP",
  },
  {
    id: "evt-2",
    name: "Music Festival",
    date: "2025-07-22T16:00:00",
    location: "Golden Gate Park",
    status: "upcoming",
    ticketType: "Standard",
  },
  {
    id: "evt-3",
    name: "Business Summit",
    date: "2025-04-10T08:30:00",
    location: "Virtual Event",
    status: "completed",
    ticketType: "VIP",
  },
  {
    id: "evt-4",
    name: "Art Exhibition",
    date: "2025-05-05T11:00:00",
    location: "Modern Art Museum",
    status: "completed",
    ticketType: "Standard",
  },
];

export default function MyAccountPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    profileImage: null as string | null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Initialize Firebase and get current user
  useEffect(() => {
    const app = initFirebase();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
        setProfileData({
          displayName: user.displayName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          bio: "", // Fetch from database if available
          profileImage: user.photoURL,
        });
        setLoading(false);
      } else {
        // Redirect to login if user is not authenticated
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Update profile in Firebase Auth
        await updateProfile(user, {
          displayName: profileData.displayName,
          photoURL: profileData.profileImage || user.photoURL,
        });

        // Here you would also update additional profile data in your database
        // such as bio, phone number, etc.

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate upcoming and past tickets
  const upcomingTickets = mockTickets.filter(
    (ticket) =>
      ticket.status === "active" && new Date(ticket.eventDate) > new Date()
  );

  const pastTickets = mockTickets.filter(
    (ticket) =>
      ticket.status === "used" || new Date(ticket.eventDate) < new Date()
  );

  // Calculate upcoming and past events
  const upcomingEvents = mockRegisteredEvents.filter(
    (event) => event.status === "upcoming" && new Date(event.date) > new Date()
  );

  const pastEvents = mockRegisteredEvents.filter(
    (event) => event.status === "completed" || new Date(event.date) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading your account...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Manage your tickets, events, and personal information.
        </p>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">
            <Ticket className="h-4 w-4 mr-2" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Registered Events
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Tickets</h2>
            {upcomingTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTickets.map((ticket) => (
                  <Card key={ticket.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{ticket.eventName}</CardTitle>
                          <CardDescription>
                            {format(new Date(ticket.eventDate), "PPP 'at' p")}
                          </CardDescription>
                        </div>
                        <Badge>{ticket.ticketType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(new Date(ticket.eventDate), "p")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(new Date(ticket.eventDate), "PP")}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>San Francisco Convention Center</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">
                        <QrCode className="h-4 w-4 mr-1" />
                        View QR Code
                      </Button>
                    </CardFooter>
                    <div className="absolute top-0 right-0 h-full w-1 bg-primary/20"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Upcoming Tickets</CardTitle>
                  <CardDescription>
                    You don't have any upcoming tickets. Browse events to
                    purchase tickets.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => router.push("/events")}>
                    Browse Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            <h2 className="text-xl font-semibold mt-8">Past Tickets</h2>
            {pastTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastTickets.map((ticket) => (
                  <Card key={ticket.id} className="opacity-75">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{ticket.eventName}</CardTitle>
                          <CardDescription>
                            {format(new Date(ticket.eventDate), "PPP 'at' p")}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{ticket.ticketType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="secondary">Past Event</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Past Tickets</CardTitle>
                  <CardDescription>
                    You don't have any past tickets.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Registered Events Tab */}
        <TabsContent value="events">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.name}
                          </TableCell>
                          <TableCell>
                            {format(new Date(event.date), "PP")}
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                event.ticketType === "VIP"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {event.ticketType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/events/${event.id}`)
                                }
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  router.push(`/events/${event.id}/ticket`)
                                }
                              >
                                View Ticket
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Upcoming Events</CardTitle>
                  <CardDescription>
                    You haven't registered for any upcoming events yet.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => router.push("/events")}>
                    Browse Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            <h2 className="text-xl font-semibold mt-8">Past Events</h2>
            {pastEvents.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.name}
                          </TableCell>
                          <TableCell>
                            {format(new Date(event.date), "PP")}
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.ticketType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/events/${event.id}`)}
                            >
                              View Event
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Past Events</CardTitle>
                  <CardDescription>
                    You haven't attended any events yet.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal details and preferences.
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        profileData.profileImage ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt="Profile"
                    />
                    <AvatarFallback>
                      {profileData.displayName.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="flex flex-col items-center gap-2">
                      <Label
                        htmlFor="profile-image"
                        className="cursor-pointer text-sm font-medium text-primary hover:underline"
                      >
                        Change Photo
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="display-name"
                        value={profileData.displayName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            displayName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {profileData.displayName || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="p-2 border rounded-md bg-muted/20">
                      {profileData.email}
                    </div>
                    {!isEditing && (
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed directly. Please contact support
                        for email changes.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phoneNumber}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {profileData.phoneNumber || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="min-h-32"
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20 min-h-32">
                        {profileData.bio || "No bio provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.metadata.creationTime
                          ? format(
                              new Date(userData.metadata.creationTime),
                              "MMMM d, yyyy"
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Last Sign In</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.metadata.lastSignInTime
                          ? format(
                              new Date(userData.metadata.lastSignInTime),
                              "MMMM d, yyyy 'at' h:mm a"
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Notification Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    Manage Email Notifications
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Manage Push Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
