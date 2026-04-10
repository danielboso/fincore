//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  {
    ignores: [".output/**", "dist/**", "node_modules/**", "routeTree.gen.ts"],
  },
]
