import { buildConfig } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media, Posts, Categories],
  editor: lexicalEditor(),
  localization: { locales: ['en', 'tr'], defaultLocale: 'en' },
  secret: process.env.PAYLOAD_SECRET || 'temporary-secret',
  db: sqliteD1Adapter({ binding: {} as any }),
  plugins: [],
})

async function deleteAllPosts() {
  const payload = await (await import('payload')).getPayload({ config })
  
  const posts = await payload.find({ collection: 'posts', limit: 100 })
  console.log(`Found ${posts.docs.length} posts`)
  
  for (const post of posts.docs) {
    await payload.delete({ collection: 'posts', id: post.id })
    console.log(`Deleted post ${post.id}: ${post.title}`)
  }
  
  console.log('All posts deleted')
  process.exit(0)
}

deleteAllPosts().catch(console.error)
