"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { EmailSubscription } from "./email-subscription"

export function Header() {
  return (
    <header className="relative z-50 w-full">
      <div className="container mx-auto px-6 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          {/* Brand */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo/astronutcase.svg"
              alt="Astro Nutcase Logo"
              width={56}
              height={56}
              priority
            />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">Astro Nutcase</h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance mb-4"
          >
            Exploring the evolution of AI-generated art from 2022 to 2025
          </motion.p>

          {/* Subscription form - subtle and compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md mb-4"
          >
            <EmailSubscription />
          </motion.div>

          {/* Model badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {["DALL-E", "Midjourney", "Qwen", "Gemini 3 Pro"].map((model, i) => (
              <span
                key={model}
                className="px-3 py-1 text-xs md:text-sm font-mono rounded-full bg-secondary text-secondary-foreground border border-border"
              >
                {model}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </header>
  )
}
