'use client'

import { Check, Laptop, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getDictionary, type Locale } from '../i18n/dictionaries'
import { useTheme, type Theme } from './ThemeProvider'

export function ThemeDropdown({ locale = 'en' }: { locale?: Locale }) {
  const { theme, setTheme } = useTheme()
  const dict = getDictionary(locale)

  const options: Array<{ value: Theme; label: string; icon: typeof Sun; footnote?: string }> = [
    { value: 'light', label: dict.theme.light, icon: Sun },
    { value: 'dark', label: dict.theme.dark, icon: Moon },
    { value: 'system', label: dict.theme.system, icon: Laptop, footnote: dict.theme.systemFootnote },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={dict.theme.label}>
          {theme === 'light' ? (
            <Sun className="size-4" aria-hidden="true" />
          ) : theme === 'dark' ? (
            <Moon className="size-4" aria-hidden="true" />
          ) : (
            <Laptop className="size-4" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[11rem]">
        {options.map((option) => {
          const Icon = option.icon
          const active = theme === option.value
          return (
            <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{option.label}</span>
              {option.footnote && (
                <span className="truncate text-xs text-muted-foreground">{option.footnote}</span>
              )}
              {active && <Check className="size-4 text-primary" aria-hidden="true" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
