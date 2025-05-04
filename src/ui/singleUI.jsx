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
    // Auto-select first offer type
    const defaultOfferType = listOfferTypes()[0]?.id || '';
    setOfferType(defaultOfferType);
    const typeDef = getOfferType(defaultOfferType);
    setToneOptions(typeDef.tones || []);
    setToneStyle(typeDef.tones?.[0] || '');
  }, []);

  const handleGenerate = () => {
    setError('');
    setOutput(null);
    try {
      const rows = parseTSV(tsvData);
      if (!rows.length) throw new Error('No data parsed.');
      state.set('parsedData', rows);
      const loi = generateLOI(rows[0], offerType, toneStyle);
      setOutput(loi.body); // Clean string, no HTML
    } catch (err) {
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
    <div>
      <h3>Single Deal</h3>
      <form className="single-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="single-offerType">Offer Type</label>
        <select
          id="single-offerType"
          name="single-offerType"
          value={offerType}
          onChange={handleOfferTypeChange}
        >
          {listOfferTypes().map((t) => (
            <option key={t.id} value={t.id}>
              {t.displayName}
            </option>
          ))}
        </select>

        <label htmlFor="single-toneStyle">Tone Style</label>
        <select
          id="single-toneStyle"
          name="single-toneStyle"
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

        <label htmlFor="single-tsvData">Deal Data (TSV)</label>
        <textarea
          id="single-tsvData"
          name="single-tsvData"
          rows={8}
          className="tsv-input"
          value={tsvData}
          placeholder="Paste single-row TSV here (headers on first line)"
          onChange={(e) => setTsvData(e.target.value)}
        />

        <button type="button" onClick={handleGenerate}>
          Generate LOI
        </button>
      </form>

      <div id="single-loiResult">
        {error && <p className="error">{error}</p>}
        {output && <LoiCard body={output} />}
      </div>
    </div>
  );
}
