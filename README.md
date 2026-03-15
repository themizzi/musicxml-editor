# MusicXML Editor

This repository contains a minimal TypeScript web app and Cocogitto-based release tooling.

## App structure

- Source files: `src/index.html`, `src/styles.css`, `src/app.ts`
- Build output: `dist/`

## Run the app

1. `npm run build`
2. `npm run serve`
3. Open the local URL printed in the terminal (usually `http://localhost:3000`).

## Run end-to-end smoke test

`npm run test:e2e`

## Conventional commits

Use Conventional Commits so Cocogitto can validate commits and compute semantic version bumps.

Examples:

- `feat: add toolbar button`
- `fix: correct status message wording`
- `feat!: change editor initialization flow`

## Commit enforcement

`cog.toml` defines a `commit-msg` hook that runs:

`cog verify --file $1`

Install the hook with:

`cog install-hook commit-msg`

## Docker-based cocogitto installation

`Dockerfile` installs `cog` from GitHub release binaries using architecture mapping and a pinned build argument:

- `ARG COG_VERSION=6.2.1`
- `ARG TARGETARCH` mapped to:
  - `amd64` -> `x86_64`
  - `arm64` -> `aarch64`

The image resolves a Linux asset for the pinned version tag, installs `cog` to `/usr/local/bin/cog`, and verifies the installation with `cog --version` during build.

## Release flow

Run:

1. `cog check --from-latest-tag`
2. `cog bump --auto`
3. `git push --follow-tags`

`cog bump --auto` updates `CHANGELOG.md`, creates the bump commit, and creates the release tag.

## Design choices

- No `VERSION` file is used.
- No app version is displayed in the UI by design.
