"use client"

import { Badge } from "@/components/ui/badge"
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"

type HeroKey = "about" | "services" | "projects" | "design"

export function SubPageHero({ heroKey }: { heroKey: HeroKey }) {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const hero = dict[heroKey].hero

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center px-6 py-20 md:py-32 overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_right,white,rgba(255,255,255,0.6),transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_top_left,white,rgba(255,255,255,0.6),transparent)]",
          "inset-x-0 inset-y-0 h-[200%] skew-y-12"
        )}
      />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,black_70%)]" />
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <Badge
          variant="secondary"
          className="mb-6 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
        >
          {hero.badge}
        </Badge>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-4xl md:text-7xl font-bold leading-tight/60 tracking-tight max-w-5xl mx-auto"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 text-xl md:text-xl max-w-4xl text-muted-foreground mx-auto"
        >
          {hero.description}
        </motion.p>
      </div>
    </div>
  )
}
