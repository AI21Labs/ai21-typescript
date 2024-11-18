# Contributing to AI21 Typescript SDK

We welcome contributions to the AI21 Typescript SDK. Please read the following guidelines before submitting your pull request.

### Examples of contributions include:

- Bug fixes
- Documentation improvements
- Additional tests

## Reporting issues

Go to this repository's [issues page](https://github.com/AI21Labs/ai21-typescript/issues) and click on the "New Issue" button.
Please make sure to check if the issue has already been reported before creating a new one.

Include the following information in your post:

- Describe what you expected to happen.
- If possible, include a [minimal reproducible example](https://stackoverflow.com/help/minimal-reproducible-example) to help us
  identify the issue. This also helps check that the issue is not with
  your own code.
- Describe what actually happened. Include the full traceback if there
  was an exception.
- List your Typescript version. If possible, check if this
  issue is already fixed in the latest releases or the latest code in
  the repository.

## Submit a pull request

Fork the AI21 Typescript SDK repository and clone it to your local machine. Create a new branch for your changes:

    git clone https://github.com:AI21Labs/USERNAME/ai21-typescript
    cd ai21-typescript
    git checkout -b my-fix-branch master

### Installation

Install using npm or yarn with dev dependencies, run:

    npm install -D

We use Husky to manage pre-commit hooks. Installing the pre-commit hooks would take care of formatting and linting your code before committing.
Please make sure you have the pre-commit hooks installed before committing your code.

### Commits

Each commit should be a single logical change and should be aligned with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
Since we are using a pre-commit hook to enforce this, any other commit message format will be rejected.

### Run CI tasks locally

```bash
$ npm run --list
  build
    vite build
  unused-deps
    npx depcheck --json | jq '.dependencies == []'
  clean-build
    rm -rf ./dist
  lint
    npx eslint 'src/**/*.{ts,tsx}' --no-ignore
  format
    prettier --write "(src|test)/**" --no-error-on-unmatched-pattern
  prepare
    npm run build
  example
    npx tsx src/example.ts
  circular
    madge --circular --extensions ts src
  quality
    npm run circular && npm run lint && tsc --noEmit && npm run format && npm run unused-deps
  quality:fix
    npm run circular && npm run lint -- --fix && tsc --noEmit && npm run format
```

You can run any of the above commands to check for errors in your code. you can also run `npm run quality` to check for errors and `npm run quality:fix` to fix the linting errors. if you installed husky from the previous step, it would run the `quality:fix` command before committing your code.

### Tests

We use [jest](https://jestjs.io/) for testing. To run the tests, run:

    npm run test

If adding a new test, please make sure to add it to the `tests` directory and have the file location be under the same hierarchy as the file being tested.

Make sure you use `jest` for tests writing and not any other testing framework.

### How to open a pull request?

Push your branch to your forked repository and open a pull request against the `main` branch of the AI21 Typescript SDK repository. Please make sure to include a description of your changes in the pull request.

The title of the pull request should follow the above-mentioned [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Feedback

If you have any questions or feedback, please feel free to reach out to us.

We appreciate and encourage any contributions to the AI21 Typescript SDK. Please take the reviewer feedback positively and make the necessary changes to your pull request.

## Code Style Guidelines

- We follow TypeScript best practices and maintain strict type safety
- Use interfaces over types when possible
- Use early returns for better readability
- Follow ESLint and Prettier configurations provided in the project
- Write self-documenting code with clear variable and function names
- Add JSDoc comments for public APIs and complex functions

## Pull Request Process

1. Ensure all tests pass locally
2. Update documentation if needed
3. Add or update tests for new functionality
4. Squash commits into meaningful changes
5. Request review from maintainers
6. Address review feedback promptly

## Release Process

- We follow semantic versioning (SEMVER)
- Changes are documented in CHANGELOG.md
- Releases are tagged using git tags
