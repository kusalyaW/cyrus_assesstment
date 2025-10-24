// Vitest setup: make `expect` available and load jest-dom matchers
import { expect } from 'vitest';

// expose expect globally so `@testing-library/jest-dom` can extend it
globalThis.expect = expect;

// load jest-dom matchers (adds to expect)
import '@testing-library/jest-dom';

// Optional: configure other globals here if needed in future
