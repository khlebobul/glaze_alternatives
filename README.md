# Glaze Alternatives

Community-maintained directory of [Glaze Store](https://www.glaze.app/store) alternatives to standalone and paid Mac apps. Search by product or category, compare alternatives, and open matching apps directly in the Glaze Store.

Glaze keeps small, useful tools inside one local-first desktop platform. This project makes those replacements easy to discover. The catalog is community-maintained through pull requests.

**[Browse the directory](https://khlebobul.github.io/glaze_alternatives/)**

See also: [Raycast Alternatives](https://khlebobul.github.io/raycast_alternatives/).

## Add a product

Products are standalone applications people may want to replace. Add an object to `data/apps.json`:

```json
{
  "id": "example-app",
  "name": "Example App",
  "url": "https://example.com/",
  "iconUrl": "https://example.com/icon.png",
  "category": "utilities",
  "description": "Short description of the standalone product."
}
```

Use a stable official website or App Store URL. `iconUrl` must point to a working square image. Available categories: `productivity`, `developer`, `media`, `utilities`, `design`.

## Add a Glaze app

Add an object to `data/glaze-apps.json`:

```json
{
  "id": "example-glaze-app",
  "name": "Example Glaze App",
  "description": "What the app does inside Glaze.",
  "url": "https://www.glaze.app/app/APP_ID",
  "iconUrl": "https://example.com/icon.png",
  "replaces": ["example-app"]
}
```

`replaces` contains IDs from `data/apps.json`. One Glaze app may replace several products; one product may have several Glaze alternatives.

Only submit real, publicly available Glaze Store apps with substantially overlapping core functionality. Dead pages, placeholders, broken icons, and speculative mappings are not accepted.

Run checks before opening a pull request:

```sh
npm ci
npm test
npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the short contribution checklist.
