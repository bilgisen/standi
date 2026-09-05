'use client'

import { useLocale } from '../components/LocaleProvider'
import Hero07 from '../components/Hero07'
import Logos from '../components/Logos'
import AnimeSection from '../components/AnimeSection'
import PM from '../components/PM'
import AnimeDSection from '../components/AnimeDSection'
import DS from '../components/DS'

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero07 />
      <Logos showHeader={false} compact />
      <AnimeSection />
      <PM />
      <AnimeDSection />
      <DS />
    </div>
  )
}
