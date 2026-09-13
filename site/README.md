# Winds Ahead — web application

[한국어](README.ko.md)

Private MVP implementation of the bilingual cosmetic archive. Run `npm run install:ci`, then `npm run dev`. The portable development server uses port 5173. `npx tsc --noEmit` checks types; `npm run build` creates the production Worker.

`content/research.json` preserves the initial official CN research, including unknown global status, date precision and media rights. This first milestone establishes the runtime and a visual slice; navigation and search are completed in subsequent PRs. See the bilingual project documents one directory above for scope and quality requirements.


Catalog milestone: EN/KO routes, shared search and filters, eight detail pages, on-demand full-image galleries, browser watchlist, sources and update history are implemented. The roadmap is completed in the next milestone. Thumbnails are 47–108KB. Full reference sheets load only on request. Media reuse remains unverified; this is an owner-private review build.
