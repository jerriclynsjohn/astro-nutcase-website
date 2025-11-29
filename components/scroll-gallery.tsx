"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Lightbox } from "./lightbox"
import { galleryImages, type GalleryImage } from "@/lib/gallery-data"
import { Loader2 } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const IMAGES_PER_BATCH = 12

export function ScrollGallery() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const animationCtxRef = useRef<gsap.Context | null>(null)

  // Preload images immediately
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }

  useEffect(() => {
    // Load initial batch immediately and preload images
    const initialBatch = galleryImages.slice(0, IMAGES_PER_BATCH)
    setLoadedImages(initialBatch)
    setHasMore(galleryImages.length > IMAGES_PER_BATCH)

    // Preload initial images immediately
    initialBatch.forEach((image) => {
      preloadImage(image.src).catch(() => {
        // Silently handle preload errors
      })
    })
  }, [])

  const loadMoreImages = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Remove setTimeout for instant loading
    const currentLength = loadedImages.length
    const nextBatch = galleryImages.slice(currentLength, currentLength + IMAGES_PER_BATCH)

    if (nextBatch.length > 0) {
      setLoadedImages((prev) => [...prev, ...nextBatch])
      setHasMore(currentLength + nextBatch.length < galleryImages.length)

      // Preload next batch images in background
      nextBatch.forEach((image) => {
        preloadImage(image.src).catch(() => {
          // Silently handle preload errors
        })
      })
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }, [isLoading, hasMore, loadedImages.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreImages()
        }
      },
      { threshold: 0.1, rootMargin: "400px" }, // Increased rootMargin for earlier loading
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreImages, hasMore, isLoading])

  const columns = [
    loadedImages.filter((_, i) => i % 3 === 0),
    loadedImages.filter((_, i) => i % 3 === 1),
    loadedImages.filter((_, i) => i % 3 === 2),
  ]

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || loadedImages.length === 0) return

    if (animationCtxRef.current) {
      animationCtxRef.current.revert()
    }

    // Optimize ScrollTrigger settings for smoother performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    })

    animationCtxRef.current = gsap.context(() => {
      const columnElements = grid.querySelectorAll(".column")
      const items = grid.querySelectorAll(".column__item")

      // Middle column (index 1) moves up by -20% as per index2.js
      if (columnElements[1]) {
        gsap.to(columnElements[1], {
          ease: "none",
          scrollTrigger: {
            trigger: grid,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Smoother scrub value
            invalidateOnRefresh: true,
          },
          yPercent: -20,
        })
      }

      // Side columns rotation and translation as per index2.js
      items.forEach((item) => {
        const wrapper = item.querySelector(".column__item-imgwrap")
        const columnIndex = Number(item.getAttribute("data-column"))

        if (columnIndex === 1 || !wrapper) return

        gsap.to(wrapper, {
          ease: "none",
          startAt: {
            transformOrigin: columnIndex === 0 ? "0% 100%" : "100% 100%",
          },
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Smoother scrub value
            invalidateOnRefresh: true,
          },
          rotation: columnIndex === 0 ? -6 : 6,
          xPercent: columnIndex === 0 ? -10 : 10,
        })
      })

      ScrollTrigger.refresh()
    }, grid)

    return () => {
      if (animationCtxRef.current) {
        animationCtxRef.current.revert()
      }
    }
  }, [loadedImages])

  useEffect(() => {
    return () => {
      if (animationCtxRef.current) {
        animationCtxRef.current.revert()
      }
    }
  }, [])

  const handleImageClick = (image: GalleryImage) => {
    const index = galleryImages.findIndex((img) => img.id === image.id)
    setCurrentIndex(index)
    setSelectedImage(image)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(galleryImages[nextIndex])
  }

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    setCurrentIndex(prevIndex)
    setSelectedImage(galleryImages[prevIndex])
  }

  return (
    <>
      <section className="columns-section w-full flex justify-center pt-40 pb-[10vh] overflow-x-hidden">
        <div ref={gridRef} className="columns w-full max-w-[1200px] grid grid-cols-3 gap-[1vw] px-[2vw]">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="column w-full flex flex-col gap-[1vw] will-change-transform">
              {column.map((image) => (
                <figure
                  key={image.id}
                  data-column={colIndex}
                  className="column__item relative m-0 cursor-pointer group"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="column__item-imgwrap w-full aspect-square overflow-hidden rounded-[20px] relative">
                    <div
                      className="column__item-img absolute bg-cover bg-center will-change-transform"
                      style={{
                        top: "-30px",
                        left: "-30px",
                        width: "calc(100% + 60px)",
                        height: "calc(100% + 60px)",
                        backgroundImage: `url(${image.src})`,
                        backfaceVisibility: "hidden",
                        transform: "translateZ(0)",
                      }}
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 md:p-4 text-center z-10">
                      <span className="text-[10px] md:text-xs font-mono text-primary mb-1">{image.model}</span>
                      <span className="text-xs md:text-base font-medium text-foreground line-clamp-2">
                        {image.title}
                      </span>
                      <span className="text-[10px] md:text-xs text-muted-foreground mt-1">{image.year}</span>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div ref={loadMoreRef} className="flex justify-center items-center py-12">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && loadedImages.length > 0 && (
          <p className="text-sm text-muted-foreground">You've seen all the AI magic</p>
        )}
      </div>

      <Lightbox
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentIndex={currentIndex}
        totalImages={galleryImages.length}
      />
    </>
  )
}
