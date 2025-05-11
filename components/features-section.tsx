"use client"

import { useEffect, useRef } from "react"
import { Calendar, Users, Video, MapPin, Ticket } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Event Creation",
    description: "Create and customize events of any type or size with our intuitive tools.",
  },
  {
    icon: Ticket,
    title: "Ticketing",
    description: "Sell tickets, manage registrations, and track attendance seamlessly.",
  },
  {
    icon: Users,
    title: "Attendee Management",
    description: "Manage your guest list and provide a smooth check-in experience.",
  },
  {
    icon: Video,
    title: "Live Streaming",
    description: "Host virtual events with integrated live streaming and chat features.",
  },
  {
    icon: MapPin,
    title: "Venue Mapping",
    description: "Create interactive floor plans and seating arrangements for your venue.",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const featureElements = document.querySelectorAll(".feature-card")
    featureElements.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      featureElements.forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Successful Events</h2>
          <p className="text-muted-foreground text-lg">
            Our platform provides all the tools you need to create, manage, and host amazing events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card opacity-0 glass-effect rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
