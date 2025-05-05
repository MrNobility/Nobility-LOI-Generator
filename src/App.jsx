import React, { useState, useEffect } from 'react';
import SingleUI from './ui/SingleUI.jsx';
import { initBulkUI } from './ui/bulkUI.js';

export default function App() {
  const [mode, setMode] = useState('single');

  useEffect(() => {
    if (mode === 'bulk') {
      initBulkUI('bulkApp');
    }
  }, [mode]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Nobility LOI Generator</h1>
      <div className="bg-white rounded-2xl shadow-lg">
        {/* Mode Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center transition-all ${mode === 'single'
              ? 'border-b-4 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setMode('single')}
          >
            Single Deal
          </button>
          <button
            className={`flex-1 py-3 text-center transition-all ${mode === 'bulk'
              ? 'border-b-4 border-blue-600 text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setMode('bulk')}
          >
            Bulk Deals
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {mode === 'single' && <SingleUI />}
          {mode === 'bulk' && (
            <div id="bulkApp" className="space-y-6">
              {/* Bulk UI initializes here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
