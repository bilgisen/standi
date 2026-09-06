import React from 'react'
import { ThemeProvider } from '../components/ThemeProvider'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { LocaleProvider } from '../components/LocaleProvider'
import { ScrollBasedVelocityDemo } from '../components/Velocity'
import Features from '../components/Features'
import NumbersSection from '../components/Numbers'
import CTA from '../components/CTA'
import ContactWidget from '../components/ContactWidget'
import type { Locale } from '../i18n/dictionaries'
import '../styles.css'

export const metadata = {
  description: 'Expostep - Exhibition Stand Design and Build',
  title: 'Expostep',
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }]
}

export default async function LangLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const locale: Locale = lang === 'tr' ? 'tr' : 'en'

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LocaleProvider locale={locale}>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{props.children}</main>
              <Features />
              <NumbersSection />
              <CTA />
              <ContactWidget />
              <SiteFooter />
              <ScrollBasedVelocityDemo />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
