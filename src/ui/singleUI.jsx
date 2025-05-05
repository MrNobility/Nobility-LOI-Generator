// src/ui/SingleUI.jsx

import React, { useEffect, useState } from 'react';
import parseTSV from '../core/tsvParser.js';
import { generateLOI } from '../core/loiEngine.js';
import state from '../core/state.js';
import { listOfferTypes, getOfferType } from '../core/offerTypeRegistry.js';

export default function SingleUI() {
  const [offerType, setOfferType] = useState('');
  const [toneStyle, setToneStyle] = useState('');
  const [toneOptions, setToneOptions] = useState([]);
  const [tsvData, setTsvData] = useState('');
  const [yourName, setYourName] = useState('');
  const [yourPhone, setYourPhone] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  // Load saved user info from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('loiUser') || '{}');
    if (saved.name)  setYourName(saved.name);
    if (saved.phone) setYourPhone(saved.phone);
    if (saved.email) setYourEmail(saved.email);
  }, []);

  // Persist user info to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      'loiUser',
      JSON.stringify({ name: yourName, phone: yourPhone, email: yourEmail })
    );
  }, [yourName, yourPhone, yourEmail]);

  // Initialize offerType and toneOptions
  useEffect(() => {
    const defaultOffer = listOfferTypes()[0]?.id || '';
    setOfferType(defaultOffer);
    const def = getOfferType(defaultOffer);
    setToneOptions(def.tones || []);
    setToneStyle(def.tones?.[0] || '');
  }, []);

  const handleGenerate = () => {
    setError('');
    setOutput(null);
    try {
      const raw = tsvData.trim().replace(/\t+$/gm, '');
      const rows = parseTSV(raw);
      if (!rows.length) throw new Error('No data parsed.');

      // merge user signature info
      const merged = {
        ...rows[0],
        yourname: yourName,
        yourphone: yourPhone,
        youremail: yourEmail
      };
      state.set('parsedData', [merged]);
      const loi = generateLOI(merged, offerType, toneStyle);
      setOutput(loi.html);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Single Deal</h3>
      <form className="space-y-4 max-w-xl mx-auto" onSubmit={e => e.preventDefault()}>
        {/* User Signature Info */}
        <div>
          <label htmlFor="single-yourName" className="block font-medium mb-1">Your Name</label>
          <input
            id="single-yourName"
            type="text"
            className="w-full border rounded p-2"
            value={yourName}
            onChange={e => setYourName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label htmlFor="single-yourPhone" className="block font-medium mb-1">Your Phone</label>
          <input
            id="single-yourPhone"
            type="tel"
            className="w-full border rounded p-2"
            value={yourPhone}
            onChange={e => setYourPhone(e.target.value)}
            placeholder="555-123-4567"
          />
        </div>
        <div>
          <label htmlFor="single-yourEmail" className="block font-medium mb-1">Your Email</label>
          <input
            id="single-yourEmail"
            type="email"
            className="w-full border rounded p-2"
            value={yourEmail}
            onChange={e => setYourEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* Offer Type */}
        <div>
          <label htmlFor="single-offerType" className="block font-medium mb-1">Offer Type</label>
          <select
            id="single-offerType"
            className="w-full border rounded p-2"
            value={offerType}
            onChange={e => {
              const val = e.target.value;
              setOfferType(val);
              const def = getOfferType(val);
              setToneOptions(def.tones || []);
              setToneStyle(def.tones?.[0] || '');
            }}
          >
            {listOfferTypes().map(t => (
              <option key={t.id} value={t.id}>{t.displayName}</option>
            ))}
          </select>
        </div>

        {/* Tone Style */}
        <div>
          <label htmlFor="single-toneStyle" className="block font-medium mb-1">Tone Style</label>
          <select
            id="single-toneStyle"
            className="w-full border rounded p-2"
            value={toneStyle}
            onChange={e => setToneStyle(e.target.value)}
            disabled={!toneOptions.length}
          >
            {toneOptions.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* TSV Input */}
        <div>
          <label htmlFor="single-tsvData" className="block font-medium mb-1">Deal Data (TSV)</label>
          <textarea
            id="single-tsvData"
            rows={8}
            className="w-full border rounded p-2 font-mono"
            value={tsvData}
            onChange={e => setTsvData(e.target.value)}
            placeholder="Paste single-row TSV here (headers optional)"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate LOI
        </button>
      </form>

      {/* Rendered LOI with spaced paragraphs */}
      {output && (
        <div
          className="mt-6 max-w-xl mx-auto space-y-4"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      )}
      {error && <p className="text-red-600 mt-4 max-w-xl mx-auto">{error}</p>}
    </div>
  );
}
