# Quotation Generator

A professional web-based quotation and invoice generator built with React 19, TanStack Start, and Cloudflare Workers.

## Project Overview

This application allows users to create, manage, and export professional quotations/invoices with the following capabilities:

### Key Features

- **Quotation Creation**: Generate detailed quotations with company information, line items, and payment schedules
- **Line Item Management**: Add, duplicate, and remove items with quantities, rates, and detailed descriptions
- **Payment Scheduling**: Configure deposit percentages, optional second payments, and automatic final payment calculations
- **Multi-Currency Support**: Support for MYR (RM) and USD currencies
- **Data Import/Export**: Import and export quotation data as JSON for backup and sharing
- **Professional Preview**: Print-ready quotation layout with proper formatting
- **PDF Export**: Print quotations directly to PDF using browser print functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Start, Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Deployment**: Cloudflare Workers
- **Code Quality**: Ultracite (Biome preset), Vitest
- **Styling**: Tailwind CSS v4

### Project Structure

```
src/
├── components/           # React components
│   ├── quotation-form.tsx    # Main form for creating quotations
│   └── quotation-preview.tsx # Print-ready preview component
├── stores/               # Zustand state management
│   └── quotation-store.ts    # Quotation data and operations
├── routes/               # TanStack Router file-based routes
│   ├── __root.tsx            # Root layout component
│   └── index.tsx             # Home route
├── router.tsx            # Router configuration
└── styles.css            # Global styles
```

### Main Components

1. **QuotationForm** (`src/components/quotation-form.tsx:4`)
   - Comprehensive form for inputting all quotation details
   - Dynamic line item management
   - Payment configuration
   - Terms and conditions management
   - JSON import/export functionality

2. **QuotationPreview** (`src/components/quotation-preview.tsx:3`)
   - Print-optimized layout
   - Professional table formatting
   - Automatic page breaks
   - Print to PDF functionality

3. **QuotationStore** (`src/stores/quotation-store.ts:96`)
   - Zustand store managing all quotation state
   - Automatic calculations for totals, deposits, and payments
   - JSON import/export methods

### Core Functionality

- **State Management**: The `useQuotationStore` hook manages all application state including form data, current view (input/preview), and calculated values
- **Calculations**: Automatic calculation of line item amounts, total, deposit, second payment (optional), and final payment
- **Data Persistence**: Export/import quotations as JSON for saving and sharing
- **Print Optimization**: CSS print styles ensure proper PDF generation with A4 page size and correct margins

### Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Deploy to Cloudflare
pnpm deploy

# Code quality
npx ultracite fix      # Auto-fix formatting/linting issues
npx ultracite check    # Check for issues
npx ultracite doctor   # Diagnose setup
```

### Deployment

The application is configured for deployment to Cloudflare Workers. Build artifacts are automatically optimized for the platform.

---

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.
