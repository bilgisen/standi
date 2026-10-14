import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  experimental: {
    serverExternalPackages: ['jose', '@payloadcms/db-d1-sqlite'],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
