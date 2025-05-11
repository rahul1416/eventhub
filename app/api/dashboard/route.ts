import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initFirebase } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  // Initialize Firebase
  const app = initFirebase();
  const db = getFirestore(app);

  // Get userId from query params
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Query events for the user
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Initialize counters
    let totalEvents = 0;
    let upcomingEvents = 0;
    let totalAttendees = 0;
    let revenue = 0;
    let nextEventDays = Infinity;
    const events = [];

    const now = new Date();

    // Process each event
    querySnapshot.forEach((doc) => {
      const event = { id: doc.id, ...doc.data() };
      totalEvents++;

      // Add event to the events array
      events.push({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type || "Event",
        attendees: event.attendees || 0,
        status: determineEventStatus(event),
        watching: event.watching || 0,
        revenue: event.revenue || 0,
      });

      // Process event status based on dates
      const eventDate = event.date ? new Date(event.date) : null;
      if (eventDate) {
        if (eventDate > now) {
          upcomingEvents++;

          // Calculate days to next event
          const daysToEvent = Math.ceil(
            (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
          );
          if (daysToEvent < nextEventDays) {
            nextEventDays = daysToEvent;
          }
        }
      }

      // Add attendees and revenue
      totalAttendees += event.attendees || 0;
      revenue += event.revenue || 0;
    });

    return NextResponse.json({
      totalEvents,
      upcomingEvents,
      totalAttendees,
      revenue,
      nextEventDays: nextEventDays === Infinity ? 0 : nextEventDays,
      events,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Helper function to determine event status
function determineEventStatus(event) {
  const now = new Date();
  const eventDate = event.date ? new Date(event.date) : null;
  const eventEndDate = event.endDate ? new Date(event.endDate) : null;

  if (!eventDate) return "upcoming";

  if (eventEndDate) {
    if (now > eventEndDate) return "completed";
    if (now >= eventDate && now <= eventEndDate) return "live";
    return "upcoming";
  }

  // If no end date, use the event date
  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);

  const nextDay = new Date(eventDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);

  if (now >= nextDay) return "completed";
  if (now >= eventDay && now < nextDay) return "live";
  return "upcoming";
}
