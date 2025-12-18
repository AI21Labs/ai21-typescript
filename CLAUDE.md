# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run build          # Build with Vite (outputs to dist/)
npm test               # Run unit tests with Jest (includes coverage)
npm run lint           # ESLint for src/ and examples/
npm run format         # Prettier formatting
npm run quality        # Full quality check: circular deps, lint, typecheck, format, unused deps
npm run quality:fix    # Same as quality but auto-fixes lint and format issues
npm run circular       # Check for circular dependencies with madge
npm run integration-test  # Run integration tests (requires AI21_API_KEY)
```

### Running a Single Test
```bash
npx jest tests/unittests/resources/chat/completions.test.ts
npx jest --testNamePattern="test name pattern"
```

## Architecture Overview

This is the official AI21 Labs TypeScript SDK for the Jamba model family. It supports both Node.js (>=18) and browser environments.

### Core Structure

- **`AI21`** (src/AI21.ts) - Main client class extending `APIClient`. Exposes resources: `chat`, `conversationalRag`, `library`, `beta` (Maestro)
- **`APIClient`** (src/APIClient.ts) - Abstract base with HTTP methods (get/post/put/delete/upload), retry logic, and request handling
- **`APIResource`** (src/APIResource.ts) - Base class for all resource modules

### Resources (src/resources/)

- **chat/** - Chat completions API with streaming support
- **rag/** - Conversational RAG for Q&A over uploaded files
- **library/** - File management for RAG system
- **maestro/** - Beta orchestration platform with tools (web_search, file_search)

### Platform Abstraction

The SDK uses runtime detection to provide consistent behavior across environments:

- **fetch/** - `NodeFetch` vs `BrowserFetch` implementations
- **files/** - `NodeFilesHandler` vs `BrowserFilesHandler` for form data
- **runtime.ts** - `isBrowser` / `isNode` detection utilities

### Type System (src/types/)

Types are organized by domain: `chat/`, `rag/`, `files/`, `maestro/`. All exports flow through index files.

### Streaming (src/streaming/)

SSE-based streaming for chat completions. `Stream` class implements async iterator pattern for `for await` consumption.

## Environment Variables

- `AI21_API_KEY` - API key (required)
- `AI21_BASE_URL` - Override API endpoint (default: https://api.ai21.com/studio/v1)
- `AI21_TIMEOUT_SEC` - Request timeout in seconds
- `AI21_LOG_LEVEL` - Logging level
