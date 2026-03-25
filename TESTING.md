# Vitest Testing Setup

This document explains the Vitest testing setup for the Next.js blog project.

## Overview

Vitest is a modern testing framework that provides a fast and lightweight testing experience for JavaScript and TypeScript projects. It's designed to be compatible with Vite and offers a familiar API similar to Jest.

## Setup

### Dependencies

The following dependencies are installed for testing:

- **vitest**: The main testing framework
- **@vitejs/plugin-react**: React plugin for Vite/Vitest
- **@testing-library/react**: Testing utilities for React components
- **@testing-library/jest-dom**: DOM testing utilities and matchers
- **jsdom**: DOM implementation for testing

### Configuration

- **`vite.config.ts`**: Vitest configuration file that sets up the test environment, React plugin, and path aliases
- **`src/test/setup.ts`**: Test setup file that imports jest-dom extensions

### Scripts

The following scripts are added to `package.json`:

- `test`: Run all tests once
- `test:watch`: Run tests in watch mode
- `test:coverage`: Run tests and generate coverage report

## Test Structure

Tests are organized by component, with test files named `[component].test.tsx` located alongside the component files.

### Example: Button Component Test

The `Button` component test (`src/components/ui/button.test.tsx`) includes the following test cases:

1. **Default button rendering**: Tests that the button renders with text and has the correct data-slot attribute
2. **Different variants**: Tests rendering of all button variants (default, destructive, outline, secondary, ghost, link)
3. **Different sizes**: Tests rendering of all button sizes (default, sm, lg, icon)
4. **Click events**: Tests that click events are properly handled
5. **Disabled state**: Tests that disabled buttons are rendered correctly
6. **asChild property**: Tests that the button can render as a child element (e.g., a link)

## How to Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Descriptive names**: Test names should clearly describe what they're testing
3. **Coverage**: Aim for comprehensive test coverage, especially for critical components
4. **Maintainability**: Keep tests clean and maintainable, following the same coding standards as the application code

## Troubleshooting

### Common Issues

- **Node.js version compatibility**: Vitest 3.x requires Node.js v14+ (recommended v18+)
- **Dependency conflicts**: Use `--legacy-peer-deps` if encountering dependency resolution issues
- **Permissions**: Run commands as administrator if encountering permission errors

### Debugging

- Use `console.log` statements within tests for debugging
- Use the `test:watch` script to quickly iterate on tests
- Check the Vitest documentation for advanced configuration options

## Conclusion

This Vitest setup provides a robust testing framework for the Next.js blog project, allowing for comprehensive testing of components and ensuring code quality and reliability.
