import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // Cloudflare Workers (free tier ~10ms CPU) cannot sustain high PBKDF2
    // counts: even 25k intermittently trips 1102 on login. 6k keeps admin
    // logins reliable behind Payload's built-in login rate limiting.
    currentPasswordHashIterations: 6000,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  versions: false,
}
