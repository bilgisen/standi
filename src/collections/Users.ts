import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // Cloudflare Workers has strict CPU limits; 100k PBKDF2 iterations
    // intermittently exceed them (1102) on login. 25k keeps admin usable
    // behind Payload's built-in login rate limiting.
    currentPasswordHashIterations: 25000,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  versions: false,
}
