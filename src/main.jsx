import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log("✅ JS loaded");

const container = document.getElementById('app');
if (container) {
  console.log("✅ Found #app container");
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("❌ #app container not found");
}
