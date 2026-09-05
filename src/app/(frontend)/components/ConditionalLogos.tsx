"use client"

import { usePathname } from "next/navigation"
import Logos from "./Logos"

const ConditionalLogos = () => {
  const pathname = usePathname()
  const isHome = pathname === "/" || /^\/[a-z]{2}$/.test(pathname)

  if (isHome) return null

  return <Logos showHeader={false} compact />
}

export default ConditionalLogos
