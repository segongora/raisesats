/** @type {import("eslint").Linter.Config} */
const config = {
    extends: ["prettier", "eslint:recommended",],
    plugins: ["@typescript-eslint", "react-hooks"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    env: {
        es6: true,
    },
    rules: {
        "@typescript-eslint/no-misused-promises": "off",
    },
    overrides: [
        {
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
            ],
            files: ["**/*.ts", "**/*.tsx"],
            parserOptions: {
                ecmaVersion: "latest",
                tsconfigRootDir: __dirname,
                project: [
                    "./tsconfig.json",
                    "./apps/*/tsconfig.json",
                    "./packages/*/tsconfig.json",
                ],
            },
            rules: {
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        argsIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                        caughtErrorsIgnorePattern: "^_",
                    },
                ],
                "@typescript-eslint/no-misused-promises": "off",
                "@typescript-eslint/no-floating-promises": "off",
                "react-hooks/exhaustive-deps": "warn",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unused-vars": "warn",
                "@typescript-eslint/no-unsafe-argument": "off",
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/restrict-plus-operands": "off",
                "@typescript-eslint/require-await": "off",
            },
        },
    ],
    root: true,
    reportUnusedDisableDirectives: true,
    ignorePatterns: [
        ".eslintrc.js",
        "**/*.config.js",
        "**/*.config.cjs",
        "packages/config/**",
    ],
};

module.exports = config;