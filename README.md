
# Actions

Reusable workflows and GitHub actions for my projects.

* [Usage](#usage)
  * [`enforce-commit-style`](#enforce-commit-style)
  * [`hugo-website`](#hugo-website)
  * [`node-package-monorepo`](#node-package-monorepo)
  * [`node-package-single`](#node-package-single)
* [Contributing](#contributing)
* [License](#license)


## Usage

This repo holds the following shared workflows:

### `enforce-commit-style`

Used to run [commitlint](https://commitlint.js.org/) against all commits in a pull request, unless the pull request was opened by Dependabot.

To use this workflow, add the following to `.github/workflows/commit-style.yml` in your repo:

```yml
name: Enforce commit style

on:
  pull_request:
    branches: [ main ]

jobs:
  enforce:
    uses: rowanmanning/actions/.github/workflows/enforce-commit-style.yml@v1
```

### `hugo-website`

Used to build a website with [hugo](https://gohugo.io/) and deploy it to GitHub Pages. It requires GitHub Pages to be set up (configured to use GitHub Actions) on the repo. It runs the following:

  * Run `npm run verify` on the latest LTS version of Node.js
  * Run `npm run test` on the latest LTS version of Node.js
  * Install the `hugo` command line interface
  * Run `npm run build` - this must include your `hugo` build command
  * Publish to GitHub Pages

To use this workflow, add the following to `.github/workflows/deploy.yml` in your repo:

```yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    uses: rowanmanning/actions/.github/workflows/hugo-website.yml@v1
    with:
      hugo-version: '0.101.0' # required
      cache-version: v1       # optional - change if you need to clear the cache
      build-path: build       # optional - set to the same as your build folder
      timezone: Europe/London # optional
```

### `node-package-monorepo`

Used to test, build, and release a monorepo of Node.js packages. It does the following:

  * Run `npm run verify` on the lowest LTS version of Node.js I support
  * Run `npm run test` for each of the LTS versions of Node.js I support
  * Manage release pull requests and tagging via [Release Please](https://github.com/googleapis/release-please#readme) (if required)
  * Run `npm run build` and publish the packages to the public npm registry (if required)

> [!NOTE]
> This workflow will never publish the root package.

To use this workflow, add the following to `.github/workflows/ci.yml` in your repo:

```yml
name: CI

on:
  push:
    branches: [ main ]
    tags: [ '**' ]
  pull_request:
    branches: [ main ]

jobs:
  ci:
    uses: rowanmanning/actions/.github/workflows/node-package-monorepo.yml@v1
    secrets:
      githubToken: ${{ secrets.RELEASE_TOKEN }}
      npmToken: ${{ secrets.NPM_AUTH_TOKEN }}
```

The `githubToken` secret must reference a GitHub token that can read the repo as well as push, create tags, and open pull requests. This will not work if you use the default `secrets.GITHUB_TOKEN` because the workflow relies on certain actions successfully triggering further workflows.

The `npmToken` secret must be an npm auth token with write access to the relevant packages.

### `node-package-single`

Used to test, build, and release a repo that contains a single Node.js package. It does the following:

  * Run `npm run verify` on the lowest LTS version of Node.js I support
  * Run `npm run test` for each of the LTS versions of Node.js I support
  * Manage release pull requests and tagging via [Release Please](https://github.com/googleapis/release-please#readme) (if required)
  * Run `npm run build` and publish the package to the public npm registry (if required)

To use this workflow, add the following to `.github/workflows/ci.yml` in your repo:

```yml
name: CI

on:
  push:
    branches: [ main ]
    tags: [ '**' ]
  pull_request:
    branches: [ main ]

jobs:
  ci:
    uses: rowanmanning/actions/.github/workflows/node-package-single.yml@v1
    secrets:
      githubToken: ${{ secrets.RELEASE_TOKEN }}
      npmToken: ${{ secrets.NPM_AUTH_TOKEN }}
```

The `githubToken` secret must reference a GitHub token that can read the repo as well as push, create tags, and open pull requests. This will not work if you use the default `secrets.GITHUB_TOKEN` because the workflow relies on certain actions successfully triggering further workflows.

The `npmToken` secret must be an npm auth token with write access to the relevant package.


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2024, Rowan Manning
