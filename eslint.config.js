//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    },
  },
  {
    ignores: [".output/**", "dist/**", "node_modules/**", "routeTree.gen.ts"],
  },
]
