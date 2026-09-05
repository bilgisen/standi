/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Modified by vite-plugin-vinext-payload: normalize empty segments for vinext. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

// vinext passes segments=[] for /admin, Next.js omits the key entirely, and
// Payload only resolves the dashboard route when it is absent. Drop the key
// so both frameworks land on the same route.
const normalizeParams = async (params: Args['params']) => {
  const resolved = await params
  // Array.isArray is the guard, not a style choice: Next.js omits the key
  // entirely, so reading .length off it directly throws at request time.
  if (Array.isArray(resolved.segments) && resolved.segments.length === 0) {
    const { segments, ...rest } = resolved
    return rest
  }
  return resolved
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params: normalizeParams(params), searchParams })

const Page = ({ params, searchParams }: Args) =>
  // RootPage types segments as required; its runtime reads a missing value as
  // the dashboard root. Remove this directive if Payload widens the type.
  // @ts-expect-error segments is optional at runtime
  RootPage({ config, params: normalizeParams(params), searchParams, importMap })

export default Page
