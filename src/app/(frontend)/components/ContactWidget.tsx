"use client"

import { MailIcon, PhoneIcon, MessageCircle, ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { ContactForm } from "./ContactForm"

const ContactWidget = () => {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const items = [
    {
      icon: MailIcon,
      title: dict.contactWidget.email.title,
      desc: dict.contactWidget.email.desc,
      link: {
        href: "mailto:info@expostep.com",
        label: "info@expostep.com",
      },
    },
    {
      icon: PhoneIcon,
      title: dict.contactWidget.phone.title,
      desc: dict.contactWidget.phone.desc,
      link: {
        href: "tel:+905334393343",
        label: "+90 (533) 439 3343",
      },
    },
    {
      icon: MessageCircle,
      title: dict.contactWidget.whatsapp.title,
      desc: dict.contactWidget.whatsapp.desc,
      link: {
        href: "https://wa.me/905324984681",
        label: dict.contactWidget.whatsapp.link,
      },
    },
  ]

  return (
    <div id="contact" className="flex items-center justify-center py-16 bg-muted/10">
      <div className="w-full max-w-7xl mx-auto px-6 xl:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl uppercase text-center mb-2 text-primary/80">
            {dict.contactWidget.sectionTitle}
          </h3>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
            {dict.contactWidget.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact Cards */}
          <div className="space-y-6">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link.href}
                target={item.link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="mt-1 text-muted-foreground">{item.desc}</p>
                      <div className="mt-2 inline-flex items-center text-sm font-medium text-primary">
                        {item.link.label}
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </a>
            ))}
          </div>

          {/* Right Column - Contact Form (2/3) */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactWidget
