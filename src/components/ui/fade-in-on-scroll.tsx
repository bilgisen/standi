"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import type { Variants } from "motion/react"

interface FadeInOnScrollProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
  once?: boolean
}

export function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  className = "",
  once = true,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 0.77, 0.47, 0.97],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
