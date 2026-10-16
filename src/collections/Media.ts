import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // The D1 media.alt column is NOT NULL (schema drift); never persist null.
        if (data && !data.alt) {
          data.alt = data.filename || 'media'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    disableLocalStorage: true,
    crop: false,
    focalPoint: false,
    imageSizes: undefined,
  },
}
