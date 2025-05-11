"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote:
      "EventsHub transformed how we run our annual conference. The platform is intuitive, powerful, and our attendees love the experience.",
    author: "Sarah Johnson",
    role: "Event Director, TechCorp",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The virtual event capabilities are outstanding. We were able to reach a global audience and provide an engaging experience for everyone.",
    author: "Michael Chen",
    role: "Marketing Manager, GlobalConnect",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "From ticketing to check-in, everything worked flawlessly. Our charity gala raised more funds than ever before thanks to the streamlined process.",
    author: "Emily Rodriguez",
    role: "Fundraising Coordinator, Hope Foundation",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground text-lg">Join thousands of event organizers who trust our platform</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 -left-10 text-primary/20">
            <Quote className="h-20 w-20" />
          </div>

          <div className="glass-effect rounded-xl p-8 md:p-12 relative z-10">
            <div className="text-xl md:text-2xl font-medium italic mb-8">"{testimonials[activeIndex].quote}"</div>

            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                <img
                  src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[activeIndex].author}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold">{testimonials[activeIndex].author}</div>
                <div className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-primary" : "bg-primary/30"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
