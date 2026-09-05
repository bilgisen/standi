"use client"

import { useEffect, useState } from "react"
import { animate } from "motion/react"

type Props = {
  from?: number
  to: number
  duration?: number
  className?: string
  suffix?: string
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2.5,
  className,
  suffix = "",
}: Props) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      onUpdate: (latest) => {
        setValue(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [from, to, duration])

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  )
}
