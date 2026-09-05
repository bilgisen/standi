"use client"

import { SubPageHero } from "../../components/SubPageHero"
import { useLocale } from "../../components/LocaleProvider"
import { getDictionary } from "../../i18n/dictionaries"

export default function AboutPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.about.body

  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="about" />
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-12">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {t.intro}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {t.paragraph1}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
              {t.countries}
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t.managementTitle}
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">{t.managementContent1}</p>
              <p className="text-lg leading-relaxed">{t.managementContent2}</p>
              <p className="text-lg leading-relaxed">{t.managementContent3}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
