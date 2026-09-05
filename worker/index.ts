import handler from 'vinext/server/app-router-entry'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Set env on globalThis so Payload CMS can access it
    ;(globalThis as any).__CLOUDFLARE_ENV__ = env
    
    // Delegate to vinext handler
    return handler.fetch(request)
  },
}
