"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  id: string
  title: string
  date: string
  location: string
  imageUrl: string
  attendees: number
  category: string
  virtual?: boolean
}

export function EventCard({
  id,
  title,
  date,
  location,
  imageUrl,
  attendees,
  category,
  virtual = false,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-xl card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Category Badge */}
      <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white/80 font-medium">{category}</Badge>

      {/* Virtual Badge */}
      {virtual && (
        <Badge variant="secondary" className="absolute top-4 right-4 bg-primary/90 text-white hover:bg-primary/80">
          Virtual
        </Badge>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>

        <div className="flex flex-col gap-2 mb-4 opacity-90">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{attendees} attending</span>
          </div>
        </div>

        <div className="flex gap-2 transition-transform duration-300 transform translate-y-0 group-hover:translate-y-0">
          <Link href={`/events/${id}`} className="flex-1">
            <Button
              variant="secondary"
              className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
            >
              View Details
            </Button>
          </Link>
          <Link href={`/events/${id}/register`} className="flex-1">
            <Button className="w-full gradient-bg button-glow border-0">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
