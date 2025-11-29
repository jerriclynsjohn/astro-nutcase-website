"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { siInstagram, siFacebook, siX, siPinterest } from "simple-icons"
import { Linkedin, type LucideIcon } from "lucide-react"
import type { SimpleIcon } from "simple-icons"

// Helper component to render simple-icons as SVG
const SimpleIcon = ({ icon, className }: { icon: SimpleIcon; className?: string }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}

type SocialLink =
  | {
      name: string
      icon: SimpleIcon
      url: string
      username: string
      isSimpleIcon: true
    }
  | {
      name: string
      icon: LucideIcon
      url: string
      username: string
      isSimpleIcon: false
    }

const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    icon: siInstagram,
    url: "https://instagram.com/astro.nutcase",
    username: "astro.nutcase",
    isSimpleIcon: true,
  },
  {
    name: "Facebook",
    icon: siFacebook,
    url: "https://facebook.com/astro.nutcase",
    username: "astro.nutcase",
    isSimpleIcon: true,
  },
  {
    name: "X (Twitter)",
    icon: siX,
    url: "https://x.com/Astro_Nutcase",
    username: "Astro_Nutcase",
    isSimpleIcon: true,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/astronutcase",
    username: "astronutcase",
    isSimpleIcon: false,
  },
  {
    name: "Pinterest",
    icon: siPinterest,
    url: "https://pinterest.com/astronutcase",
    username: "astronutcase",
    isSimpleIcon: true,
  },
]

export function Footer() {
  return (
    <footer className="relative py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          {/* Section title */}
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-balance">The Evolution Continues</h2>
          <p className="text-muted-foreground max-w-lg mb-10 text-balance">
            From blurry artifacts and mangled hands in 2022 to photorealistic perfection in 2025.
          </p>

          {/* Social media links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {socialLinks.map((social, index) => {
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all duration-300 group"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.isSimpleIcon ? (
                    <SimpleIcon icon={social.icon} className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  ) : (
                    <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{social.username}</span>
                </motion.a>
              )
            })}
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-border my-12" />

          {/* Brand footer */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Image
              src="/logo/astronutcase.svg"
              alt="Astro Nutcase Logo"
              width={20}
              height={20}
            />
            <span className="text-sm">Astro Nutcase</span>
            <span className="text-xs">© 2025</span>
          </div>

          {/* Tech credits */}
          <p className="text-xs text-muted-foreground mt-4">
            Powered by AI imagination • DALL-E • Midjourney • Qwen • Gemini 3 Pro
          </p>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </footer>
  )
}
