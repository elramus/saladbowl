module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    "plugin:@typescript-eslint/recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-unused-expressions': 1,
    '@typescript-eslint/semi': 0,
    'arrow-body-style': 0,
    'arrow-parens': ['error', 'as-needed'],
    "import/extensions": [".js", ".jsx", ".json", ".ts", ".tsx"],
    'import/prefer-default-export': 0,
    "max-len": 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
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
