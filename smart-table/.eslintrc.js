module.exports = {
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        "no-undef": false,
        semi: true,
        semicolon: true,
        comma: false,
      },
    ],
    "no-undef": "off",
  },
};
