# Kingdom 290 Portal

Static portal for the Total Battle Kingdom 290 council. Built with Vite + TypeScript and deployable as plain static assets or via Docker.

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:5173 and hot-reloads when editing files under `src/`.

## Production Build

```bash
npm run build
npm run preview
```

The compiled output lands in `dist/`. Use `npm run preview` for a production-like serve check.

## Docker

Build and run the nginx-based container:

```bash
docker build -t kingdom290 .
docker run -it --rm -p 8080:80 kingdom290
```

Open http://localhost:8080 to view the portal served from Docker.
