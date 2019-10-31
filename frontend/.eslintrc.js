module.exports = {
    root: true,
    env: {
        node: true
    },
    plugins: [
        'vuetify'
    ],
    extends: [
        'plugin:vue/essential',
        '@vue/typescript'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "comma-dangle": 0,
        quotes: 0,
        "no-param-reassign": ["error", { props: false }],
        camelcase: 0,
        "max-len": 0,
        semi: 0,
        "func-names": 0,
        "class-methods-use-this": 0,
        "no-restricted-globals": 0,
        "import/prefer-default-export": 0,
        "import/extensions": 0,
        "import/no-unresolved": 0,
        "import/no-extraneous-dependencies": 0,
        "object-curly-newline": 0,
        indent: ["warn", 4, { ArrayExpression: "first" }],
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader'],
        // Eric
        "operator-linebreak": 0,
        "no-restricted-syntax": 0,
        "object-shorthand": 0,
        // Romain
        // "prefer-destructuring":0,
        "prefer-template": 0,
        "default-case": 0,
        "no-bitwise": 0,
        "no-mixed-operators": 0,
        "no-plusplus": 0,
        "no-underscore-dangle": 0,
        "no-nested-ternary": 0,
        "no-await-in-loop": 1,
        "prefer-destructuring": ["error", { object: false, array: false }],
        'vuetify/no-deprecated-classes': 'error',
        'lines-between-class-members': ["error", "always", { exceptAfterSingleLine: true }]
    }
}
