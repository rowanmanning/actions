
# Actions

Reusable workflows and GitHub actions for my projects.

* [Usage](#usage)
  * [`node-package-single`](#node-package-single)
* [Contributing](#contributing)
* [License](#license)


## Usage

This repo holds the following shared workflows:

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
