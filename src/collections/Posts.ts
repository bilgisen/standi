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
        next[locale] = slugify(t) || 'post'
      }
    }
    if (Object.keys(next).length) data.slug = next
  } else if (title && typeof title === 'string' && !data.slug) {
    data.slug = slugify(title) || 'post'
  }
  return data
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    delete: () => true,
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
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Kategoriyi seçin.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
