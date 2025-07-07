# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `prisma-schema-fixer`, a TypeScript CLI tool that automatically fixes Prisma schema files according to configurable rules. It transforms model names, field names, table mappings, and enum definitions to follow consistent naming conventions.

## Commands

**Build:**
```bash
pnpm run build
```
Compiles TypeScript to ES modules in `dist/` and bundles CLI with esbuild.

**Development:**
```bash
pnpm run check
```
Runs linting, type checking, and tests together.

**Testing:**
```bash
pnpm run test           # Run tests
pnpm run test:cov       # Run tests with coverage
vitest run src/rules/field-name-rule.test.ts  # Run single test file
```

**Linting & Type Checking:**
```bash
pnpm run lint           # ESLint
pnpm run typecheck      # TypeScript type checking
pnpm run format         # Format code with Prettier
```

**CLI Testing:**
```bash
npx prisma-schema-fixer --help
npx prisma-schema-fixer -f prisma/schema.prisma -c prisma/schema-fixer.config.mjs --dry-run
```

## Architecture

The codebase follows a rule-based transformation architecture:

### Core Components

**Parser (`src/parser.ts`)**
- Breaks Prisma schema into blocks (model, enum, other, none)
- Each block type handles its own parsing and transformation logic

**Rules System (`src/rules/`)**
- Each rule type (model-name, field-name, etc.) has its own class
- Rules apply transformations based on configuration
- Supports targeting specific models/fields with patterns
- Rules are applied in sequence: model-name → model-map → field-name → field-map → field-attribute → enum-name → enum-map

**Block Types (`src/blocks/`)**
- `ModelBlock`: Handles Prisma model definitions
- `EnumBlock`: Handles enum definitions  
- `OtherBlock`: Handles other block types (generators, datasources)
- `NoneBlock`: Handles content outside blocks

**Configuration (`src/config.ts`)**
- Type-safe configuration structure
- Supports multiple rule configurations with targeting
- Rules applied in reverse order (last rule wins for matching targets)

### Key Architecture Patterns

1. **Rule-based transformations**: Each rule type encapsulates specific transformation logic
2. **Block-based parsing**: Schema is parsed into logical blocks for easier manipulation
3. **Targeting system**: Rules can target specific models/fields using strings, arrays, or regex
4. **String transformations**: Centralized case conversion and form transformation utilities

### Testing Strategy

- Unit tests for each rule type with fixtures
- Snapshot testing for complex transformations
- Mock Prisma internals for schema formatting
- Tests cover targeting, case conversion, and pluralization

### Dependencies

- `@prisma/internals`: Schema parsing and formatting
- `change-case`: Case transformations (camelCase, snake_case, etc.)
- `commander`: CLI interface
- `pluralize`: Singular/plural form transformations
- `vitest`: Testing framework
- `esbuild`: Bundling for CLI distribution