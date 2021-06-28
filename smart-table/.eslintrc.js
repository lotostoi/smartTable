module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'prettier/prettier': ['error', { endOfLine: "auto", 'no-undef': false, "semi": true }],
        "vue/html-self-closing": "off",
        "vue/attributes-order": "off",
        "no-undef": "off",
    }
}