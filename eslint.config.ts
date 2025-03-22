import antfu from "@antfu/eslint-config"

export default await antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  typescript: true,
  yaml: true,
  rules: {
    "curly": ["error", "all"],
    "camelcase": ["warn", {
      properties: "always",
      ignoreImports: true,
    }],
    "ts/consistent-type-definitions": ["warn", "type"],
  },
}, {
  files: ["**/*.ts"],
  rules: {
    "no-undef": ["error"],
  },
}, {
  ignores: [
    "dist/",
  ],
})
