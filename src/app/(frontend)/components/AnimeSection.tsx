"use client"

import { useLocale } from "../components/LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { TextReveal } from "@/components/ui/text-reveal"
import VideoBackground from "./VideoBackground"

const AnimeSection = () => {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <div className="overflow-x-hidden bg-muted/10">
      <section className="w-full flex items-center py-0 md:py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Column - Content */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight text-left">
                <TextReveal className="py-8 w-full text-left">{dict.heroAnime.title}</TextReveal>
              </h2>
            </div>

            {/* Right Column - Video */}
            <div className="w-full lg:w-2/3 rounded-xl overflow-hidden shadow-xl aspect-video relative">
              <VideoBackground
                src="https://res.cloudinary.com/daa8dnuhr/video/upload/v1758989057/turasas-n_mcx4lf.mp4"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AnimeSection
