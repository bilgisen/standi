"use client"

import { ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"

export default function CTA() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <div className="px-4">
      <div className="relative overflow-hidden my-20 max-w-5xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-300 backdrop-blur-sm text-foreground mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14 border-muted/50 border">
        <div className="absolute inset-0 -z-10" />
        <div className="relative z-10 flex flex-col gap-3">
          <h3 className="text-3xl md:text-5xl text-background font-bold">
            {dict.cta.title}
          </h3>
          <p className="mt-2 text-base md:text-xl text-background/90">
            {dict.cta.description}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4">
          <a href="#contact" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-background hover:bg-background/90 text-amber-500">
              {dict.cta.button} <ArrowDownRight className="!h-5 !w-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
