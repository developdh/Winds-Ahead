# Publishing releases

[한국어](../ko/releasing.md) · [Latest release](https://github.com/developdh/Winds-Ahead/releases/latest)

The user requested **v0.1.0 as the first GitHub release, then a release for every completed update**. This includes features, fixes, researched content, translations and documentation. Group related commits into one finished update. Unchanged source checks, work in progress and draft PRs do not need releases.

## Version policy

| Change | Example |
| --- | --- |
| Bug fix, content/photo/calendar update, translation or documentation | `0.1.0` → `0.1.1` |
| Substantial new capability | `0.1.x` → `0.2.0` |
| Stable 1.0 milestone or a change requiring migration | Decide deliberately and explain compatibility in the notes |

Use `vX.Y.Z` for Git tags and `X.Y.Z` for `site/package.json`, the top-level `site/package-lock.json` version and its root package version. Check existing tags and releases before choosing the next number. Never move a published tag to another commit; issue a new patch release for corrections.

## Complete an update

1. Finish the change on a reviewable branch. Confirm the working tree contains only intended changes and the PR has the necessary English/Korean updates and source references.
2. Bump the version and lockfile together from `site/` using `npm version patch --no-git-tag-version` (or `minor` for a feature release). The initial release already uses `0.1.0`. This does not publish to npm; the application remains private as an npm package.
3. Add paired notes at `docs/en/releases/X.Y.Z.md` and `docs/ko/releases/X.Y.Z.md`. Describe the final behavior, relevant fixes, actual validation and material limits. Include links to the website and the relevant PRs. Preserve earlier notes.
4. Run checks appropriate to the changed files and require successful project CI for the release commit. For application/content changes, validate types, tests, content and the production build. Exercise affected UI flows in English/Korean and on mobile when relevant. Documentation changes require version/link/content review; they do not justify invented browser results.
5. Complete the reviewed integration into `main` and verify its exact commit. Do not enable GitHub auto-merge. If integration or a required check is blocked, report it and retain the prepared work without claiming a completed release.
6. Create and push an annotated `vX.Y.Z` tag on that verified commit. Publish a non-draft GitHub release using the existing tag, an English title such as `Winds Ahead v0.1.0`, and a single body containing both language versions of the notes. Mark it latest unless it is explicitly a prerelease. Use `gh release create` with `--verify-tag` and `--notes-file` so an unintended tag is not created.
7. Verify the published release URL, tag commit, versions, notes and latest status. Report the release link to the user.

GitHub releases and website deployment are separate results. Deploy site changes through the established Sites process and verify the live URL; record deployment status honestly if it is still pending or failed. Documentation-only changes do not require rebuilding the hosted site. GitHub provides source archives for tagged releases; do not attach credentials, raw research downloads or unreviewed media bundles.

This is part of completing each update, including updates from the existing calendar task. It does not add another scheduled job or enable automatic merging. If publishing fails, inspect whether the tag or release already exists before retrying to avoid duplicates.

## Release notes

- [0.1.0 — initial public release](releases/0.1.0.md)
