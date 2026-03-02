# CodelithLabs Web

Next.js 16 + TypeScript codebase for [codelithlabs.in](https://codelithlabs.in):
free online tools, blog content, legal pages, and SEO-first route generation.

## Stack

- Next.js 16 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Vitest + Testing Library
- Playwright (E2E)

## Project Structure

```text
codelithlabs-web/
├── content/              # Markdown content for tools/blog
├── public/               # Static assets
├── scripts/              # Content and OG generation scripts
├── src/
│   ├── app/              # Routes, metadata, sitemap/robots/feed
│   ├── components/       # UI + tool implementations
│   ├── lib/              # Registries, loaders, utilities
│   ├── types/            # Shared TS types
│   └── __tests__/        # Unit tests
├── .github/workflows/    # CI workflows
└── package.json
```

## Local Development

Install dependencies:

- `npm install --legacy-peer-deps`

Run locally:

- `npm run dev`

## Quality Commands

- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Unit tests: `npm run test:run`
- E2E tests: `npm run test:e2e`
- Production build: `npm run build`

## Content Automation

- Generate/update tool content: `npm run generate-content`
- Generate OG assets: `npm run og:generate`

## Contributing

1. Create a feature branch.
2. Make focused, reviewable changes.
3. Run `npm run lint`, `npm run typecheck`, and `npm run test:run`.
4. Open a pull request.

## License

MIT
