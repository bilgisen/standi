"use client"

import { useEffect, useState } from "react"
import { MailIcon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

const SmLinks = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const iconClass =
    "w-5 h-5 transition-colors text-muted-foreground hover:text-foreground"

  const links = [
    {
      href: "https://www.instagram.com/expostepcom/",
      label: "Instagram",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-4 2.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/company/expostep/",
      label: "LinkedIn",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.7 0 5-2.2 5-5v-14c0-2.8-2.3-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3c-1 0-1.8-.8-1.8-1.8S5.5 5 6.5 5s1.8.8 1.8 1.8-.8 1.9-1.8 1.9zm13.5 10.3h-3v-4.6c0-1.1-.4-1.9-1.4-1.9-.8 0-1.3.6-1.6 1.2-.1.2-.1.5-.1.8v4.5h-3s.1-7.3 0-8h3v1.1c.4-.7 1.1-1.8 2.7-1.8 2 0 3.5 1.3 3.5 4.1v4.6z" />
        </svg>
      ),
    },
    {
      href: "https://www.youtube.com/channel/UCbqosE4UYRtKUQgrwpIM1vA",
      label: "YouTube",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M10 15.5l6-3.5-6-3.5v7z" />
          <path d="M21.8 8s-.2-1.6-.8-2.3c-.8-.9-1.6-.9-2-1C17 4.2 12 4.2 12 4.2s-5 0-7 .2c-.4.1-1.2.1-2 .9-.6.7-.8 2.3-.8 2.3S2 9.9 2 12v.1c0 2.1.2 4.1.2 4.1s.2 1.6.8 2.3c.8.9 1.9.8 2.4.9 1.7.2 7 .2 7 .2s5 0 7-.2c.4 0 1.2 0 2-.9.6-.7.8-2.3.8-2.3s.2-2 .2-4.1V12c0-2.1-.2-4-.2-4z" />
        </svg>
      ),
    },
    {
      href: "https://wa.me/905334393343",
      label: "WhatsApp",
      svg: (
        <svg viewBox="0 0 32 32" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M16.01 4C9.37 4 4 9.37 4 16c0 2.63.93 5.06 2.47 6.99L4 28l5.17-2.4A11.94 11.94 0 0016 28c6.63 0 12-5.37 12-12S22.63 4 16 4h.01zM16 26c-1.96 0-3.77-.58-5.3-1.57l-.38-.25-3.06 1.42.8-3.17-.2-.33A9.94 9.94 0 016 16c0-5.51 4.48-10 10-10s10 4.49 10 10-4.48 10-10 10zm5.24-7.85c-.29-.15-1.72-.84-1.98-.94-.26-.1-.45-.15-.63.15s-.72.94-.88 1.13c-.16.18-.32.2-.61.06-.29-.15-1.21-.44-2.3-1.4-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.44.13-.59.13-.13.29-.32.44-.48.15-.17.2-.29.3-.49.1-.19.05-.36-.03-.51-.08-.15-.63-1.52-.86-2.08-.23-.56-.46-.49-.63-.49-.16 0-.35-.01-.54-.01s-.51.07-.77.36c-.26.29-1 1-1 2.44s1.02 2.83 1.16 3.02c.14.19 2 3.05 4.84 4.28.68.29 1.2.47 1.61.6.67.21 1.27.18 1.75.11.53-.08 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
        </svg>
      ),
    },
    {
      href: "mailto:info@expostep.com",
      label: "Email",
      svg: <MailIcon className={iconClass} />,
    },
  ]

  return (
    <div className="flex items-center gap-5">
      {links.map(({ href, label, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          {svg}
        </a>
      ))}
    </div>
  )
}

export default SmLinks
