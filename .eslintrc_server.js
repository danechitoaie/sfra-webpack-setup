module.exports = {
    root: true,
    extends: "eslint:recommended",
    env: {
        commonjs: true
    },
    globals: {
        dw: true,
        customer: true,
        session: true,
        request: true,
        response: true,
        empty: true,
        PIPELET_ERROR: true,
        PIPELET_NEXT: true
    },
    rules: {
        "eol-last": ["error", "always"],
        "func-style": "off",
        "global-require": "off",
        "linebreak-style": ["error", "unix"],
        "keyword-spacing": ["error", {"before": true, "after": true}],
        "no-bitwise": "off",
        "no-plusplus": "off",
        "no-unneeded-ternary": "off",
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "prefer-const": "off",
        "prefer-spread": "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        radix: ["error", "always"],
        semi: ["error", "always"],
        strict: ["error", "global"]
    }
};
