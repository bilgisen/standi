import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })
  
  // Check if user exists
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'hbkarabey@gmail.com' } },
    limit: 1
  })

  if (existing.docs.length > 0) {
    console.log('User already exists')
    process.exit(0)
  }

  // Create admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'hbkarabey@gmail.com',
      password: 'Sivas1917',
    }
  })

  console.log('Admin user created successfully')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })