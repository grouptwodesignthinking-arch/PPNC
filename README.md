# ComboFlow prototype

Open `dist/index.html` with a browser, or send `dist/ComboFlow-standalone.html` as a single offline file. The prototype makes no external requests. All data are synthetic and labelled.

Documentation: `dist/validation.html` and `dist/validation.md`.
Blank participant log: `dist/test-log-template.csv`.
Engineering validation:

```sh
node logic-tests.cjs
node kitchen-tests.cjs
python3 build-delivery.py            # rebuilds dist/validation.html, dist/ComboFlow-standalone.html and ../ComboFlow-prototype.zip
NODE_PATH=$(npm root -g) node flow-tests.cjs   # browser flows; needs Playwright + Chromium
```

Current version: **v1.15** (see `CHANGELOG.md`). The Claude handoff guide for v1.12 is in `docs/handoff-v1.12/`.

Source: v5 attached to “Chấm bài Future CEO” plus the user's current requirements and v5 critique. Original project Working Canon/Training files were not present in the local mirror; scope and source limits are documented in the validation kit.

No real orders or user-study results. B and C_sim are implemented; A, H_live and C_AI are documented only.

## Web (GitHub Pages)

`.github/workflows/pages.yml` runs the logic and kitchen checks and publishes `dist/` to GitHub Pages on every push to `main` (or manually from the Actions tab). One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site URL is shown on that page and in the workflow run. A GitHub Pages site is publicly reachable even when the repository is private (private-repo Pages needs a paid GitHub plan).
