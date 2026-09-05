"use client"

import { useLocale } from "../components/LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

const Hero07 = () => {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const shouldReduceMotion = useReducedMotion()

  const handleContactClick = () => {
    const el = document.getElementById("contact")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative min-h-[70vh] md:min-h-[75vh] w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.7}
          duration={3}
          className={cn(
            "w-full h-full",
            "[mask-image:radial-gradient(ellipse_at_center,white,rgba(255,255,255,0.5),transparent)]"
          )}
        />
      </div>

      <div className="relative z-10 flex min-h-[70vh] md:min-h-[75vh] flex-col items-center justify-between max-w-7xl w-full px-4 pt-16 mx-auto">
        <div className="w-full text-center flex-1 flex flex-col items-center justify-center">
          <h3 className="text-primary/70 text-xl font-medium my-8 pt-8 uppercase">
            {dict.hero.badge}
          </h3>

          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: "blur(10px)" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 120, damping: 18, mass: 0.7 }
            }
            className="text-4xl md:text-7xl leading-tight/70 font-semibold tracking-tight max-w-7xl pb-6 mx-auto"
          >
            {dict.hero.title}
          </motion.h1>

          <div className="mt-5 pt-8 flex justify-center">
            <InteractiveHoverButton
              className="text-lg px-10 py-4"
              onClick={handleContactClick}
              type="button"
            >
              {dict.hero.button}
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero07
