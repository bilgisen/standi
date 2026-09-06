"use client"

import Image from "next/image"
import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { SubPageHero } from "../../components/SubPageHero"

interface SliderProps {
  id: number
  images: string[]
  className?: string
}

function Slider({ id, images, className }: SliderProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const intervalRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (isHovered) {
      intervalRef.current = window.setInterval(() => {
        if (!api) return
        const nextIndex = (current % count) || 0
        api.scrollTo(nextIndex)
      }, 2000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, current, count, api])

  return (
    <div
      className={cn("max-w-4xl mx-auto", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }}
    >
      <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image, index) => {
            if (!image || typeof image !== "string" || !image.trim()) return null
            const imageUrl = image.startsWith("/")
              ? `https://res.cloudinary.com/daa8dnuhr/image/upload/f_auto,q_auto:best,w_1200${image}`
              : image
            return (
              <CarouselItem key={index}>
                <div className="aspect-[3/2] relative w-full">
                  <Image
                    src={imageUrl}
                    alt={`Design Slider ${id} - ${index + 1}`}
                    fill
                    className="object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
                    quality={90}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
      <div className="mt-2 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              api?.scrollTo(index)
              setCurrent(index + 1)
            }}
            className={cn("h-2 w-2 rounded-full transition-colors", {
              "bg-primary": current === index + 1,
              "bg-muted/50": current !== index + 1,
            })}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface SliderData {
  id: number
  images: string[]
}

const sliders: SliderData[] = [
  { id: 1, images: ["/ds_1-1_tehlt5.jpg", "/ds_1-2_bzik7o.jpg", "/ds_1-3_c3qkqr.jpg"] },
  { id: 2, images: ["/ds_2-1_vbnijv.jpg", "/ds_2-2_exjbkx.jpg", "/ds_2-3_jgabzw.jpg"] },
  { id: 3, images: ["/ds_3-1_xnaarp.jpg", "/ds_3-2_krz1sb.jpg", "/ds_3-3_n2wd57.jpg"] },
  { id: 4, images: ["/ds_4-1_koew26.jpg", "/ds_4-2_q72ujm.jpg", "/ds_4-3_ublivy.jpg"] },
  { id: 5, images: ["/ds_5-1_lsrulo.jpg", "/ds_5-2_uwg09p.jpg", "/ds_5-3_wvgnbc.jpg"] },
  { id: 6, images: ["/ssb-1_fnnjve.jpg", "/ssb-2_msfrgb.jpg", "/ssb-3_lapj44.jpg"] },
  { id: 7, images: ["/yucel-1_hsvkoi.jpg", "/yucel-2_zc0gxj.jpg", "/yucel-3_ptwbbg.jpg"] },
  { id: 8, images: ["/kutas-1_kntja8.jpg", "/kutas-2_n205se.jpg", "/kutas-3_pubp9g.jpg"] },
  { id: 9, images: ["/iga-1_wh689g.jpg", "/iga-2_fpx6oy.jpg", "/iga-3_vb3car.jpg"] },
  { id: 10, images: ["/rosatom-3_c7v7rk.jpg", "/rosatom-1_vqvwqm.jpg", "/rosatom-2_abr1lp.jpg"] },
]

export default function DesignPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SubPageHero heroKey="design" />
      <section className="py-12 md:py-6 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sliders.map((slider, index) => (
              <motion.div
                key={slider.id}
                className="w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <Slider {...slider} className="w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
