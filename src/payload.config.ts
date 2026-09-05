import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { r2Storage } from '@payloadcms/storage-r2'
import { Users } from './collections/Users'

import { Media } from './collections/Media'

import { Posts } from './collections/Posts'

import { Categories } from './collections/Categories'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let cfEnv: CloudflareEnv

try {
  // In workerd: cf-env.ts has static `import { env } from 'cloudflare:workers'`
  // which is externalized by Rolldown and resolved by workerd at runtime.
  const { env } = await import('./cf-env')
  cfEnv = env as unknown as CloudflareEnv
} catch {
  // In Node.js (Payload CLI): cloudflare:workers is not available,
  // so we fall back to wrangler's local proxy.
  const { getPlatformProxy } = await import('wrangler')
  const proxy = await getPlatformProxy(
    process.env.CLOUDFLARE_ENV
      ? { environment: process.env.CLOUDFLARE_ENV }
      : {},
  )
  cfEnv = proxy.env as CloudflareEnv
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Categories],
  editor: lexicalEditor(),
  localization: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
  },
  secret: (cfEnv as any).PAYLOAD_SECRET || process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cfEnv.D1 }),
  plugins: [
    r2Storage({
      bucket: cfEnv.R2,
      collections: { media: true },
    }),
  ],
})
