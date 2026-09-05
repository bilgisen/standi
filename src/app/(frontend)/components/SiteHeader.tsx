"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  key: "home" | "projectManagement" | "designStudio" | "services" | "aboutUs" | "contact"
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/project", key: "projectManagement" },
  { href: "/design", key: "designStudio" },
  { href: "/services", key: "services" },
  { href: "/about", key: "aboutUs" },
  { href: "#contact", key: "contact" },
]

export function SiteHeader() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome])

  const resolvePath = (href: string) => {
    if (href === "#contact") return "#contact"
    return href === "/" ? `/${locale}` : `/${locale}${href}`
  }

  const currentPath = pathname?.split("/").slice(2).join("/") || ""
  const isActive = (href: string) => {
    if (href === "#contact") return false
    if (href === "/") return currentPath === ""
    return currentPath === href.replace(/^\//, "")
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        isHome && !isScrolled
          ? "bg-transparent"
          : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <div className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={resolvePath(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {dict.nav[item.key]}
              </Link>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Mobile Menu */}
          <div className="md:hidden ml-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{dict.nav.toggleMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link href={`/${locale}`} onClick={() => setIsOpen(false)}>
                      <Logo className="h-10 w-auto" />
                    </Link>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {NAV_ITEMS.map((item) => (
                        <Link
                          key={item.key}
                          href={resolvePath(item.href)}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {dict.nav[item.key]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
