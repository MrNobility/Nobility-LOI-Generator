// src/main.js

// Import and initialize the single‐deal UI
import { initSingleUI } from './ui/singleUI.js';

// (Later, you can import and call initBulkUI from './ui/bulkUI.js')

document.addEventListener('DOMContentLoaded', () => {
  // Kick off the single‐deal form in the <div id="app"></div>
  initSingleUI('app');
});
