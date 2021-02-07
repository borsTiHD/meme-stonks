module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'prettier',
        'prettier/vue',
        'plugin:prettier/recommended',
        'plugin:nuxt/recommended'
    ],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        indent: [
            'warn',
            4,
            {
                outerIIFEBody: 1,
                ignoredNodes: ['TemplateLiteral'],
                SwitchCase: 1
            }
        ], // 4 spaces – for indentation
        'template-curly-spacing': 'off',
        'max-len': ['off', {code: 120}],
        'no-console': 'off',
        'arrow-parens': ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        curly: ['error', 'multi-line'],
        'import/no-extraneous-dependencies': 'off',
        'require-await': 0,

        'global-require': 0,
        'import/no-unresolved': 0,
        'import/newline-after-import': 0,
        'no-underscore-dangle': 0,

        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 0
    }
}
