"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { clientX, clientY } = e
      const { width, height, left, top } = heroRef.current.getBoundingClientRect()

      const x = (clientX - left) / width
      const y = (clientY - top) / height

      heroRef.current.style.setProperty("--mouse-x", `${x}`)
      heroRef.current.style.setProperty("--mouse-y", `${y}`)
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: `radial-gradient(
          circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), 
          rgba(139, 92, 246, 0.15), 
          rgba(0, 0, 0, 0) 40%
        )`,
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-48 h-48 rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Create <span className="gradient-text">Memorable</span> Events That Last
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Your all-in-one platform for creating, managing, and participating in both physical and virtual events that
            leave a lasting impression.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/create">
              <Button size="lg" className="gradient-bg button-glow text-white font-medium px-8 py-6 rounded-full">
                Create Event <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="px-8 py-6 rounded-full">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
