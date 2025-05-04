// jest.setupAfterEnv.js

// Reset our DOM & clipboard shims before each test file
beforeEach(() => {
    // navigator.clipboard
    global.navigator = global.navigator || {};
    navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(),
      write:     jest.fn().mockResolvedValue()
    };
  
    // URL.createObjectURL & revokeObjectURL
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://test');
    global.URL.revokeObjectURL  = jest.fn();
  
    // ClipboardItem
    global.ClipboardItem = class {
      constructor(items) { this.items = items; }
    };
  
    // window.location.href
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' }
    });
  });
  