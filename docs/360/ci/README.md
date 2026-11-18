# CI workflow — parked, not active

`verify.yml` in this directory is the GitHub Actions workflow that runs
`npm run verify` on every push and pull request.

It is **not** at `.github/workflows/verify.yml`, because it cannot be pushed there.
The GitHub App credentials this repository is used with do not have the `workflows`
permission, and GitHub rejects any push that adds or modifies a file under
`.github/workflows/` — the entire branch, not just that file. Rather than lose the
workflow, it is kept here, byte-identical, until the permission exists.

## To activate it

Either grant the App `workflows` permission for this repository, or have someone
with workflow scope run:

```sh
git mv docs/360/ci/verify.yml .github/workflows/verify.yml
git commit -m "ci: activate the verify workflow"
git push
```

## Why it matters

The checks it runs already existed in the repo but nothing ran them: the smoke
suite shipped failing for several releases, and the site shipped with a Vercel
preview host in 101 canonical/SEO locations. A check that is not gated is not a
check. Until this is activated, `npm run verify` is a local habit rather than an
enforced gate.
