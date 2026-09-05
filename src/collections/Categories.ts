import type { CollectionConfig } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)

const generateSlug: CollectionConfig['hooks']['beforeChange'][number] = ({ data }) => {
  const title = data?.title
  if (title && typeof title === 'object') {
    const existing = (data?.slug && typeof data.slug === 'object' ? data.slug : {}) as Record<string, string>
    const next: Record<string, string> = { ...existing }
    for (const locale of ['en', 'tr'] as const) {
      const t = (title as Record<string, string>)[locale]
      if (t && !next[locale]) {
        next[locale] = slugify(t) || 'category'
      }
    }
    if (Object.keys(next).length) data.slug = next
  } else if (title && typeof title === 'string' && !data.slug) {
    data.slug = slugify(title) || 'category'
  }
  return data
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [generateSlug],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Boş bırakılırsa başlıktan otomatik üretilir.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
