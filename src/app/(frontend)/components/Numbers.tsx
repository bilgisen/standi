"use client"

import AnimatedCounter from "./AnimatedCounter"
import GoogleRating from "./GoogleRating"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"

const stats = [
  { key: "years", to: 10, suffix: "+" },
  { key: "clients", to: 99, suffix: "+" },
  { key: "projects", to: 350, suffix: "+" },
  { key: "destinations", to: 15, suffix: "+" },
]

export default function NumbersSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {stats.map((stat) => (
          <div key={stat.key} className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl md:text-4xl font-bold">
              <AnimatedCounter to={stat.to} />{stat.suffix}
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {dict.numbers.stats[stat.key as keyof typeof dict.numbers.stats]}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-12">
        <div className="mx-auto w-auto rounded-lg border border-muted shadow py-4 px-8 flex items-center gap-4">
          <img src="/g.svg" alt="Google Rating" className="w-8 h-8" />
          <GoogleRating />
        </div>
      </div>
    </section>
  )
}
