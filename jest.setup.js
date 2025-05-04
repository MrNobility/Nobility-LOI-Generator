// jest.setup.js

// 1) Ensure jest.fn is available
if (typeof jest === 'undefined') {
  global.jest = require('jest-mock');
}

// 2) Polyfill navigator.clipboard
global.navigator = global.navigator || {};
navigator.clipboard = {
  writeText: jest.fn().mockResolvedValue(),
  write:     jest.fn().mockResolvedValue()
};

// 3) Polyfill URL.createObjectURL & revokeObjectURL
global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://test');
global.URL.revokeObjectURL  = jest.fn();

// 4) Polyfill ClipboardItem class
global.ClipboardItem = class {
  constructor(items) { this.items = items; }
};

// 5) Provide a mutable window.location.href
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '' }
});
