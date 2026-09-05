"use client"

import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    grecaptcha?: any
  }
}

const formSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional().or(z.literal("")),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
})

type FormValues = z.infer<typeof formSchema>

export function ContactForm() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.grecaptcha) {
      setIsRecaptchaReady(true)
      return
    }
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => setIsRecaptchaReady(true)
    document.body.appendChild(script)
    return () => {
      const scripts = document.querySelectorAll('script[src*="recaptcha"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  const getRecaptchaToken = async (): Promise<string> => {
    if (process.env.NODE_ENV === "development") return "dev-bypass-token"
    if (!window.grecaptcha) throw new Error("reCAPTCHA not loaded")
    return await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action: "submit" }
    )
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const token = await getRecaptchaToken()
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptcha: token }),
      })
      const result: { error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error || dict.contactForm.submit_error)
      reset()
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error: any) {
      console.error(error)
      alert(error.message || dict.contactForm.submit_error)
    }
  }

  return (
    <div className="relative">
      <style jsx global>{`
        .grecaptcha-badge { visibility: hidden !important; }
      `}</style>
      <Card className="bg-muted/0 py-2 relative">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="col-span-2 md:col-span-1">
                <Input
                  {...register("name")}
                  placeholder={dict.contactForm.placeholders.name}
                  className="bg-muted/10 h-10"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive mt-1">
                    {dict.contactForm.errors.name_min}
                  </motion.p>
                )}
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  {...register("company")}
                  placeholder={dict.contactForm.placeholders.company}
                  className="bg-muted/10 h-10"
                  aria-invalid={!!errors.company}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={dict.contactForm.placeholders.email}
                  className="bg-muted/10 h-10"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive mt-1">
                    {dict.contactForm.errors.email}
                  </motion.p>
                )}
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder={dict.contactForm.placeholders.phone}
                  className="bg-muted/10 h-10"
                  aria-invalid={!!errors.phone}
                />
              </div>
              <div className="col-span-2">
                <Textarea
                  {...register("message")}
                  placeholder={dict.contactForm.placeholders.message}
                  className="bg-muted/10"
                  rows={6}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive mt-1">
                    {dict.contactForm.errors.message_min}
                  </motion.p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || (process.env.NODE_ENV !== "development" && !isRecaptchaReady)}
              className="w-full md:w-auto mt-6"
            >
              {isSubmitting ? dict.contactForm.buttons.sending : dict.contactForm.buttons.submit}
            </Button>
            {submitSuccess && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 rounded-md bg-green-50 p-3">
                <p className="text-sm text-green-800">{dict.contactForm.success}</p>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
