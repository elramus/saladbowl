module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/semi": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "lines-between-class-members": 0,
    "no-console": 1,
    "no-param-reassign": ["error", { props: false }],
    "no-undef": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": 0,
    radix: 0,
    semi: [1, "never"],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
}
