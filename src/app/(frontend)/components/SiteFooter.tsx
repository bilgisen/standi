"use client"

import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { Logo } from "./Logo"
import SmLinks from "./SmLinks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type NavItem = {
  href: string
  key: "home" | "projectManagement" | "designStudio" | "aboutUs" | "contact"
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/project", key: "projectManagement" },
  { href: "/design", key: "designStudio" },
  { href: "/about", key: "aboutUs" },
  { href: "#contact", key: "contact" },
]

export function SiteFooter() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const resolvePath = (href: string) => {
    if (href === "#contact") return "#contact"
    return href === "/" ? `/${locale}` : `/${locale}${href}`
  }

  return (
    <footer className="bg-background text-foreground border-t md:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            <Logo className="w-32 h-auto" />
            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {NAV_ITEMS.map(({ href, key }) => (
                <li key={key}>
                  <a
                    href={resolvePath(href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {dict.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-xs w-full">
            <h6 className="font-semibold">{dict.footer.newsletterTitle}</h6>
            <form className="mt-6 flex items-center gap-2">
              <Input type="email" placeholder={dict.footer.newsletterPlaceholder} />
              <Button type="submit">{dict.footer.subscribe}</Button>
            </form>
          </div>
        </div>

        <Separator />

        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Expostep. {dict.footer.rights}
          </span>
          <SmLinks />
        </div>
      </div>
    </footer>
  )
}
