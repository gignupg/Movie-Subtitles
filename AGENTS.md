# Agent Instructions

## Versioning

- `package.json` is the single source of truth for the extension version.
- When making code or behavior changes, update the version in `package.json`.
- Do not add a version to `src/manifest.json`; the build injects the package version into `build/manifest.json`.
- Use semantic versioning:
  - Patch version for bug fixes, compatibility fixes, small UI changes, and refactors that do not change behavior.
  - Minor version for new user-facing features or broader behavior changes.
  - Major version only for breaking changes.
- Do not update the version for documentation-only changes unless explicitly requested.
