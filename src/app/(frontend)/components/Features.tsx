"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Rocket,
  Eye,
  Globe2,
  Award,
  Leaf,
  ShieldCheck,
} from "lucide-react"
import { useLocale } from "../components/LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import type { ReactNode } from "react"

const icons = [Rocket, Eye, Globe2, Award, Leaf, ShieldCheck]

const Features = () => {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const features = [
    { title: dict.features.feature1.title, description: dict.features.feature1.description },
    { title: dict.features.feature2.title, description: dict.features.feature2.description },
    { title: dict.features.feature3.title, description: dict.features.feature3.description },
    { title: dict.features.feature4.title, description: dict.features.feature4.description },
    { title: dict.features.feature5.title, description: dict.features.feature5.description },
    { title: dict.features.feature6.title, description: dict.features.feature6.description },
  ]

  return (
    <section id="features" className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto px-6">
        <div className="text-center">
          <h3 className="text-2xl uppercase text-center mb-2 text-primary/80">
            {dict.features.sectionLabel}
          </h3>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {dict.features.sectionTitle}
          </h2>
        </div>
        <Card className="mx-auto mt-8 grid max-w-6xl divide-y divide-x overflow-hidden *:text-center md:mt-16 md:grid-cols-2 md:divide-y-0 lg:grid-cols-3 lg:divide-y">
          {features.map((item, index) => {
            const Icon = icons[index]
            return (
              <div key={index} className="group">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Icon className="size-6" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium">{item.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </div>
            )
          })}
        </Card>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-24 duration-200 [--color-border:hsl(var(--border))] group-hover:[--color-border:hsl(var(--border)_/_60%)] dark:[--color-border:hsl(var(--border)_/_40%)] dark:group-hover:[--color-border:hsl(var(--border)_/_20%)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:16px_16px]"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-10 items-center justify-center">
      {children}
    </div>
  </div>
)

export default Features
