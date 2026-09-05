"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLocale } from "./LocaleProvider"
import { getDictionary } from "../i18n/dictionaries"

const FAQ = () => {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const faqItems = Array.from({ length: 7 }, (_, index) => ({
    question: dict.faq[`q${index + 1}` as keyof typeof dict.faq].question,
    answer: dict.faq[`q${index + 1}` as keyof typeof dict.faq].answer,
  }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        <div className="w-full sm:w-1/2">
          <h2 className="text-4xl lg:text-5xl leading-[1.15] font-bold tracking-tight pr-16">
            {dict.faq.title}
          </h2>
        </div>
        <div className="w-full sm:w-1/2">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(({ question, answer }, index) => (
              <AccordionItem key={index} value={`question-${index}`}>
                <AccordionTrigger className="text-left text-lg">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default FAQ
