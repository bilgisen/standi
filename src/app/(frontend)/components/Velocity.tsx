"use client"

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"

export function ScrollBasedVelocityDemo() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="text-5xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem]">
        <ScrollVelocityRow baseVelocity={10} direction={1}>
          <div className="text-muted-foreground/50 dark:text-muted/70">{dict.velocity.stands}</div>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={20} direction={-1}>
          <div className="text-muted-foreground/30 dark:text-muted/50">{dict.velocity.cities}</div>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
