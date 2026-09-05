"use client"

import { motion, useScroll, useTransform } from "motion/react"
import type { MotionValue } from "motion/react"
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mx-1 lg:mx-1.5 inline-block">
      <span className="text-muted-foreground/20">{children}</span>
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 text-foreground"
      >
        {children}
      </motion.span>
    </span>
  )
}

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
  className?: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.1"],
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")

  return (
    <div ref={containerRef} className={cn("relative w-full overflow-hidden text-left", className)}>
      <motion.div
        className="flex flex-wrap justify-start"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]) }}
      >
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          )
        })}
      </motion.div>
    </div>
  )
}
