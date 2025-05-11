"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LiveRedirect({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/livestreams/${params.id}`)
        const data = await res.json()

        if (!res.ok || !data.streamLink) {
          alert("Stream not available")
          router.push("/events")
          return
        }

        if (data.accessRestricted) {
          alert("Access to this stream is restricted.")
          router.push("/events")
          return
        }

        if (!data.isLive) {
          alert("Stream is not live yet.")
          router.push("/events")
          return
        }

        // Redirect to the live stream
        window.location.href = data.streamLink
      } catch (err) {
        console.error("Error fetching stream", err)
        router.push("/events")
      } finally {
        setLoading(false)
      }
    }

    fetchStream()
  }, [params.id, router])

  return (
    <div className="flex h-screen items-center justify-center text-xl font-semibold">
      {loading ? "Loading live stream..." : "Redirecting..."}
    </div>
  )
}
