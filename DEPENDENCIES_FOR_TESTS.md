<!-- DEPENDENCIES_FOR_TESTS.md -->

# Test Dependencies - Installation Guide

This document lists the dependencies needed to run the test suite for the Upload Panel feature.

## Required Dependencies

### Testing Framework & Libraries

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

## Installation

### Option 1: Install Individual Packages

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom \
  @types/jest
```

### Option 2: Install All at Once

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

## Next.js Specific

If using Next.js 13+, most of these are already included. Just add:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Verify Installation

Check that packages are installed:

```bash
npm list @testing-library/react
npm list jest
```

## Version Compatibility

| Package | Current | Minimum | Maximum |
|---------|---------|---------|---------|
| React | 18.x | 18.0 | 19.x |
| Next.js | 14.x | 13.0 | 15.x |
| Jest | 29.x | 28.0 | 30.x |
| @testing-library/react | 14.x | 13.0 | 15.x |

## TypeScript Support

If using TypeScript (recommended), also ensure:

```bash
npm install --save-dev typescript @types/node
```

## Running Tests

After installation, run:

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Troubleshooting Installation

### Jest Not Found

```bash
npm install --save-dev jest
npx jest --version
```

### React Testing Library Not Found

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Jest Config Error

Ensure `jest.config.js` and `jest.setup.js` exist in project root (they were created during implementation)

### TypeScript Errors

```bash
npm install --save-dev @types/jest @types/node
```

## Optional Enhancement Packages

For more advanced testing capabilities:

```bash
# For mocking and spying
npm install --save-dev jest-mock-extended

# For visual regression testing (optional)
npm install --save-dev @visual-testing/jest

# For performance testing (optional)
npm install --save-dev jest-performance-now

# For accessibility testing (optional)
npm install --save-dev @testing-library/jest-axe
```

## CI/CD Setup

For GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
```

## npm Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage"
  }
}
```

## Quick Start After Installation

```bash
# 1. Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# 2. Run tests
npm run test

# 3. View coverage
npm run test:coverage

# 4. Watch mode for development
npm run test:watch
```

## Uninstall/Cleanup

If you need to remove test dependencies:

```bash
npm uninstall --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom \
  @types/jest
```

## Documentation

- Jest: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Testing Best Practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

## Support

If you encounter issues:

1. Check Node.js version: `node --version` (should be 14+)
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`
4. Check Jest config: `npx jest --showConfig`

