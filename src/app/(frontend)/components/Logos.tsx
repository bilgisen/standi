"use client"

import { useLocale } from "../components/LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import Marquee from "@/components/ui/marquee"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type LogosProps = {
  showHeader?: boolean
  compact?: boolean
}

const Logos = ({ showHeader = true, compact = false }: LogosProps) => {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const logos = [
    { src: "/thy.svg", label: "THY" },
    { src: "/teknofest.png", label: "TEKNOFEST" },
    { src: "/mitsubishi.svg", label: "Mitsubishi" },
    { src: "/iga.svg", label: "IGA" },
    { src: "/sarsilmaz.png", label: "Sarsilmaz" },
    { src: "/rosatom.png", label: "Rosatom" },
    { src: "/kutas.png", label: "Kutas" },
    { src: "/ssb.png", label: "SSB" },
    { src: "/kultur.png", label: "Kultur" },
    { src: "/hes.png", label: "HES Kablo" },
    { src: "/ica.png", label: "ICA" },
    { src: "/bridge.png", label: "Bridge to Life" },
    { src: "/hepsi.png", label: "Hepsiburada" },
    { src: "/lcw.png", label: "LC Waikiki" },
    { src: "/borusan.png", label: "Borusan" },
    { src: "/turksat.png", label: "Turksat" },
  ]

  return (
    <div className={compact ? "flex items-center justify-center px-6 my-4" : "flex items-center justify-center px-6 my-10"}>
      <div className="overflow-hidden">
        {showHeader ? (
          <>
            <h3 className="text-2xl uppercase text-center mb-2 text-primary/80">
              {dict.logos.subtitle}
            </h3>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center mb-8">
              {dict.logos.title}
            </h2>
          </>
        ) : null}
        <TooltipProvider>
          <div className={compact ? "mt-2 w-full space-y-20" : "mt-10 w-full space-y-20"}>
            <Marquee pauseOnHover className="[--duration:20s]">
              {logos.map((logo) => (
                <Tooltip key={logo.src}>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-flex">
                      <img src={logo.src} alt={logo.label} className="w-24 h-24 p-2 m-2" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">{logo.label}</TooltipContent>
                </Tooltip>
              ))}
            </Marquee>
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Logos
