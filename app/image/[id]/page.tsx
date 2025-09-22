"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function ImagePage() {
  const params = useParams()
  const router = useRouter()
  const imageId = Number.parseInt(params.id as string)

  const [imageData, setImageData] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const colorLineImages = [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8559.JPG-rwmf6KV1cvqRvzi052ydtXeEpexBtP.jpeg",
        alt: "Vintage black and white photograph showing African American children and young people gathered on a street",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8713.JPG-tC6UZyMk4KJ7m4kWw9SXi420CfObyd.jpeg",
        alt: "Portrait of young African American baseball player in uniform sitting casually",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8679.jpg-fi9iE0Kza0FuJiA0nPRYAo9Ozp9OlX.jpeg",
        alt: "Syracuse Stars team photograph from 1887 with individual portrait photos in decorative border",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7760.jpg-RswMCwLnJYu7OLneM6xVVX1vfFq6RR.jpeg",
        alt: "Artistic close-up photograph focusing on hands showing unity or integration",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8676.JPG-aJaCLgFhPYZ2UG2xA9a8QMCOYlgZ5O.jpeg",
        alt: "Jackie Robinson in Montreal uniform next to Dodgers Club House sign",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8909.JPG-ZcUlzpfVT23VnYHeo4SH0nBaqHxOt1.jpeg",
        alt: "Indoor photograph showing two men reviewing documents with framed portrait on wall",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8084.JPG-NL0qMVz4SJPkhixNFE3lk2QihPPU0U.jpeg",
        alt: "Action shot of Jackie Robinson crossing home plate being congratulated by teammate",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9136.JPG-6axIynODPYqdVOy97JwcZCIZGrU5ay.jpeg",
        alt: "Color photograph of Jackie Robinson jumping over sliding player during baseball game",
      },
    ]

    // Cycle through the 8 real images for all 120 positions
    const imageIndex = (imageId - 1) % 8
    setImageData(colorLineImages[imageIndex])
  }, [imageId])

  const handlePrevious = () => {
    const prevId = imageId > 1 ? imageId - 1 : 120
    router.push(`/image/${prevId}`)
  }

  const handleNext = () => {
    const nextId = imageId < 120 ? imageId + 1 : 1
    router.push(`/image/${nextId}`)
  }

  if (!imageData) {
    return <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#F1EFE7] relative overflow-hidden">
      {/* Collection Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <h1 className="text-2xl font-light text-black/80 tracking-wider">THE REIFERSON COLLECTION</h1>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white/95 transition-colors shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white/95 transition-colors shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Image - Enlarged to fill almost entire page */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <img
          src={imageData.src || "/placeholder.svg"}
          alt={imageData.alt}
          className="w-full h-full object-contain"
          style={{ maxWidth: "98vw", maxHeight: "98vh" }}
        />
      </div>

      {/* Back to Gallery Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 text-black hover:opacity-70 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Gallery</span>
      </button>
    </div>
  )
}
