import 'server-only'

import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'
import { router } from '@/app/router'
import { request } from "@arcjet/next";

globalThis.$client = createRouterClient(router, {

  context: async () => ({
    request: await request(),
  }),
})