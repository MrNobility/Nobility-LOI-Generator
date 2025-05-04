import React, { useEffect, useState } from 'react';
import parseTSV from '../core/tsvParser.js';
import { generateLOI } from '../core/loiEngine.js';
import state from '../core/state.js';
import { listOfferTypes, getOfferType } from '../core/offerTypeRegistry.js';
import LoiCard from './LoiCard.jsx';

export default function SingleUI() {
  const [offerType, setOfferType] = useState('');
  const [toneStyle, setToneStyle] = useState('');
  const [toneOptions, setToneOptions] = useState([]);
  const [tsvData, setTsvData] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const defaultOfferType = listOfferTypes()[0]?.id || '';
    setOfferType(defaultOfferType);
    const typeDef = getOfferType(defaultOfferType);
    setToneOptions(typeDef.tones || []);
    setToneStyle(typeDef.tones?.[0] || '');
  }, []);

  const handleGenerate = () => {
    console.log("⚙️ Generate button clicked");
    setError('');
    setOutput(null);
    try {
      let raw = tsvData;
  
      if (!raw.includes('\t') && raw.match(/  +/)) {
        raw = raw.replace(/ {2,}/g, '\t');
      }
  
      const rows = parseTSV(raw);
      console.log("✅ Parsed rows:", rows);
  
      if (!rows.length) throw new Error('No data parsed.');
  
      state.set('parsedData', rows);
      const loi = generateLOI(rows[0], offerType, toneStyle);
      console.log("✅ Generated LOI:", loi);
      setOutput(loi.html); // ← updated to show HTML version
    } catch (err) {
      console.error("❌ Error in generate:", err);
      setError(err.message);
    }
  };  

  const handleOfferTypeChange = (e) => {
    const selected = e.target.value;
    setOfferType(selected);
    const typeDef = getOfferType(selected);
    setToneOptions(typeDef.tones || []);
    setToneStyle(typeDef.tones?.[0] || '');
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Single Deal</h3>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="single-offerType" className="block font-medium mb-1">Offer Type</label>
          <select
            id="single-offerType"
            className="w-full border rounded p-2"
            value={offerType}
            onChange={handleOfferTypeChange}
          >
            {listOfferTypes().map((t) => (
              <option key={t.id} value={t.id}>
                {t.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="single-toneStyle" className="block font-medium mb-1">Tone Style</label>
          <select
            id="single-toneStyle"
            className="w-full border rounded p-2"
            value={toneStyle}
            onChange={(e) => setToneStyle(e.target.value)}
            disabled={!toneOptions.length}
          >
            {toneOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="single-tsvData" className="block font-medium mb-1">Deal Data (TSV)</label>
          <textarea
            id="single-tsvData"
            rows={8}
            className="w-full border rounded p-2 font-mono"
            value={tsvData}
            placeholder="Paste single-row TSV here (headers on first line)"
            onChange={(e) => setTsvData(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate LOI
        </button>
      </form>

      <div className="mt-6" id="single-loiResult">
        {error && <p className="text-red-600">{error}</p>}
        {output && (
          <div className="bg-white border p-4 rounded shadow" dangerouslySetInnerHTML={{ __html: output }} />
        )}
      </div>
    </div>
  );
}
