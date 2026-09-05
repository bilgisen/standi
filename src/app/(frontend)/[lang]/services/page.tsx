"use client"

import { SubPageHero } from "../../components/SubPageHero"
import { useLocale } from "../../components/LocaleProvider"
import { getDictionary } from "../../i18n/dictionaries"
import { motion } from "motion/react"
import Image from "next/image"

const features = [
  { key: "exhibition", image: "https://res.cloudinary.com/daa8dnuhr/image/upload/v1761189445/fuar_ez8bxd.jpg" },
  { key: "festival", image: "https://res.cloudinary.com/daa8dnuhr/image/upload/v1761188483/68d12f5aa322c59cc783b6e1_ysrwzh.jpg" },
  { key: "pavillion", image: "https://res.cloudinary.com/daa8dnuhr/image/upload/v1761188820/5_2_uinxsx.jpg" },
  { key: "congress", image: "https://res.cloudinary.com/daa8dnuhr/image/upload/v1761189308/Forum_20Banque_20Populaire_20-_20tekoaphotos_20-_20Sc_C3_A9nographie_20Digiplay_20_284_29_20BD_fb6fr2.jpg" },
] as const

export default function ServicesPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.services.body

  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="services" />
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="space-y-20">
          {features.map((feature, index) => {
            const direction = index % 2 === 0 ? 100 : -100
            const item = t[feature.key as keyof typeof t] as { title: string; details: string }

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, x: direction }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="basis-2/3 w-full overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={feature.image}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="basis-1/2">
                  <h3 className="text-3xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.details}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
