module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  extends: [
    '@vue/standard',
    'plugin:vue/recommended'
  ],
  rules: {
    eqeqeq: 'off',
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      closeBracket: 0,
      switchCase: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    indent: ['error', 2],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/script-indent': [
      'error',
      2,
      { baseIndent: 1 }
    ],
    'space-before-function-paren': ['error', 'never'],
    semi: [2, 'never'],
    'vue/singleline-html-element-content-newline': 'warn',
    'vue/multiline-html-element-content-newline': 'warn'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
}
