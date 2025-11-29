"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Calendar, Cpu, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryImage } from "@/lib/gallery-data"

interface LightboxProps {
  image: GalleryImage | null
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  currentIndex: number
  totalImages: number
}

export function Lightbox({ image, isOpen, onClose, onNext, onPrevious, currentIndex, totalImages }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowRight":
          onNext()
          break
        case "ArrowLeft":
          onPrevious()
          break
      }
    },
    [isOpen, onClose, onNext, onPrevious],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [handleKeyDown, isOpen])

  if (!image) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] text-foreground hover:bg-secondary"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] text-foreground hover:bg-secondary h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] text-foreground hover:bg-secondary h-12 w-12"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Content */}
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-16 gap-6 md:gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative flex-1 w-full max-w-3xl h-[40vh] md:h-[70vh]">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.title}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-96 flex flex-col gap-6 max-h-[40vh] md:max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-xs font-mono text-primary uppercase tracking-wider">
                  {currentIndex + 1} / {totalImages}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 text-balance">{image.title}</h2>
              </div>

              <div className="space-y-4">
                {/* Model */}
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block">Model / Tool</span>
                    <span className="text-foreground font-medium">{image.model}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block">Created</span>
                    <span className="text-foreground font-medium">{image.date}</span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Prompt</span>
                    <p className="text-sm text-muted-foreground leading-relaxed font-mono bg-secondary/50 p-3 rounded-lg">
                      {image.prompt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Year badge */}
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Year</span>
                  <span className="px-3 py-1 text-sm font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                    {image.year}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalImages) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
