"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { subscribeEmail } from "@/app/actions/subscribe"

type Status = "idle" | "loading" | "success" | "error"

export function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus("error")
      setMessage("Please enter your email address")
      inputRef.current?.focus()
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      inputRef.current?.focus()
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const result = await subscribeEmail(email)

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(result.message)
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  const resetStatus = () => {
    if (status === "error") {
      setStatus("idle")
      setMessage("")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-muted-foreground pointer-events-none">
            <Mail className="w-4 h-4" aria-hidden="true" />
          </div>

          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              resetStatus()
            }}
            placeholder="Get updates"
            disabled={status === "loading" || status === "success"}
            aria-label="Email address"
            aria-describedby={message ? "subscription-message" : undefined}
            aria-invalid={status === "error"}
            className={`
              w-full pl-10 pr-24 py-2.5 
              bg-background/60 backdrop-blur-sm
              border rounded-full
              text-sm text-foreground placeholder:text-muted-foreground
              transition-all duration-300
              focus:outline-none focus:ring-1 focus:ring-primary/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                status === "error"
                  ? "border-destructive/50 focus:border-destructive"
                  : status === "success"
                    ? "border-green-500/50"
                    : "border-border/50 focus:border-primary/50"
              }
            `}
          />

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            aria-label={status === "loading" ? "Subscribing..." : "Subscribe to updates"}
            className={`
              absolute right-1.5 
              px-3 py-1.5 
              rounded-full font-medium text-xs
              transition-all duration-300
              focus:outline-none focus:ring-1 focus:ring-primary/50
              disabled:cursor-not-allowed
              ${
                status === "success"
                  ? "bg-green-500/90 text-white"
                  : "bg-primary/80 text-primary-foreground hover:bg-primary"
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              {status === "loading" ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="sr-only">Subscribing</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline text-xs">Done</span>
                </>
              ) : (
                <>
                  <span className="text-xs">Subscribe</span>
                </>
              )}
            </span>
          </button>
        </div>
      </form>

      {/* Status message - compact */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            id="subscription-message"
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`
              mt-2 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 justify-center
              ${status === "error" ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-500"}
            `}
          >
            {status === "error" ? (
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
