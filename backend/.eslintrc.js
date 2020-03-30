module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/semi': 0,
    "import/extensions": [".js", ".jsx", ".json", ".ts", ".tsx"],
    'import/prefer-default-export': 0,
    'lines-between-class-members': 0,
    'no-undef': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'radix': 0,
    'semi': [1, "never"],

  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
};
