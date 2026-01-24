// jest.setup.js

import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IndexedDB if not available
if (!global.indexedDB) {
  const idbMock = {
    open: jest.fn((name, version) => ({
      onsuccess: jest.fn(),
      onerror: jest.fn(),
      onupgradeneeded: jest.fn(),
      result: {
        objectStoreNames: { contains: jest.fn(() => false) },
        createObjectStore: jest.fn(),
        transaction: jest.fn(),
      },
    })),
  };
  global['indexedDB'] = idbMock;
}

// Suppress console errors during tests if needed
const originalError = console.error;
beforeAll(() => {
  console.error = function() {
    const args = Array.from(arguments);
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
