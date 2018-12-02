module.exports = {
    extends: "stylelint-config-standard",
    plugins: ["stylelint-scss"],
    rules: {
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "include",
                    "for",
                    "each",
                    "mixin",
                    "if",
                    "else",
                    "content",
                    "return",
                    "warn",
                    "function"
                ]
            }
        ],
        indentation: 4,
        "scss/at-import-no-partial-leading-underscore": true,
        "no-descending-specificity": null,
        "scss/dollar-variable-no-missing-interpolation": true,
        "scss/media-feature-value-dollar-variable": "always",
        "scss/selector-no-redundant-nesting-selector": true,
        "at-rule-empty-line-before": [
            "always",
            {
                ignoreAtRules: ["else"],
                ignore: ["blockless-after-same-name-blockless", "inside-block"]
            }
        ],
        "block-closing-brace-newline-after": ["always", { ignoreAtRules: ["if", "else"] }]
    }
};
