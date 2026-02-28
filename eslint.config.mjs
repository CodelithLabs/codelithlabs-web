import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Allow img element (images are unoptimized in static export)
      "@next/next/no-img-element": "off",
      // Downgrade React 19 compiler rules to warnings (project uses React 18)
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Allow unescaped quotes in JSX text (common in legal/prose pages)
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
