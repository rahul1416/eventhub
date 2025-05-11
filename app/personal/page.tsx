'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  status: 'upcoming' | 'live' | 'completed';
  startTime: string;
  endTime: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    virtualLink: string;
  };
  customization: {
    colors: string;
    logoUrl: string;
    bannerUrl: string;
  };
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');

  const firebaseUid = '3b397f4d-877a-4052-9983-89d71cbc539d'; // Ideally from Firebase Auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${firebaseUid}`);
        const userData: User = await userRes.json();
        setUser(userData);

        const eventsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events?organizerId=${userData._id}`);
        const eventData: Event[] = await eventsRes.json();
        setEvents(eventData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const groupedEvents: Record<'upcoming' | 'live' | 'completed', Event[]> = {
    upcoming: events.filter(e => e.status === 'upcoming'),
    live: events.filter(e => e.status === 'live'),
    completed: events.filter(e => e.status === 'completed'),
  };

  if (!user) return <p className="p-6 text-gray-600">Loading user data...</p>;

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-5 sticky top-4 bg-white z-10 p-4 border rounded-lg shadow-sm">
        <img
          src={user.profileImage || '/placeholder-profile.png'}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <span className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded-full capitalize">
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex space-x-4 border-b pb-2 mb-4">
          {(['upcoming', 'live', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`capitalize px-4 py-2 rounded-t-md font-medium ${
                activeTab === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {groupedEvents[activeTab].length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No {activeTab} events.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedEvents[activeTab].map((event) => (
              <div
                key={event._id}
                className="bg-white border rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={event.customization.bannerUrl || '/placeholder-banner.jpg'}
                  alt="Event Banner"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Type:</strong> {event.eventType}</p>
                    <p><strong>Location:</strong> {event.location.city}, {event.location.country}</p>
                    <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
