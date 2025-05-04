// src/ui/bulkUI.js

import parseTSV from '../core/tsvParser.js';
import { generateLOI } from '../core/loiEngine.js';
import state from '../core/state.js';
import { listOfferTypes, getOfferType } from '../core/offerTypeRegistry.js';
import {
  createElement,
  createButton,
  renderLOICard
} from './sharedRenderer.js';

export function initBulkUI(rootId = 'bulkApp') {
  const root = document.getElementById(rootId);
  if (!root) return console.error(`#${rootId} not found`);

  // Create <form>
  const form = createElement('form', { className: 'bulk-form' });

  // Offer Type
  const offerTypeId = 'bulk-offerType';
  const offerTypeSelect = createElement('select', {
    id: offerTypeId,
    name: offerTypeId
  });
  listOfferTypes().forEach(t =>
    offerTypeSelect.appendChild(
      createElement('option', { value: t.id }, t.displayName)
    )
  );
  form.append(
    createElement('label', { htmlFor: offerTypeId }, 'Offer Type'),
    offerTypeSelect
  );

  // Tone Style
  const toneId = 'bulk-toneStyle';
  const toneSelect = createElement('select', {
    id: toneId,
    name: toneId,
    disabled: true
  });
  form.append(
    createElement('label', { htmlFor: toneId }, 'Tone Style'),
    toneSelect
  );

  // TSV input
  const tsvId = 'bulk-tsvData';
  const tsvInput = createElement('textarea', {
    id: tsvId,
    name: tsvId,
    rows: 10,
    className: 'tsv-input',
    placeholder: 'Paste multi-row TSV here'
  });
  form.append(
    createElement('label', { htmlFor: tsvId }, 'Deals Data (TSV)'),
    tsvInput
  );

  // Generate button
  const btnGenerate = createButton('Generate Bulk LOIs', onGenerate, 'button');
  form.append(btnGenerate);

  // Results
  const resultContainer = createElement('div', { id: 'bulk-loiResults' });

  root.append(
    createElement('h3', {}, 'Bulk Deals'),
    form,
    resultContainer
  );

  // Event wiring
  offerTypeSelect.addEventListener('change', () => {
    const ot = offerTypeSelect.value;
    state.set('offerType', ot);
    const typeDef = getOfferType(ot);

    toneSelect.innerHTML = '';
    typeDef.tones.forEach(style =>
      toneSelect.appendChild(createElement('option', { value: style }, style))
    );
    toneSelect.disabled = false;
    state.set('toneStyle', toneSelect.value);
  });

  toneSelect.addEventListener('change', () => {
    state.set('toneStyle', toneSelect.value);
  });

  function onGenerate() {
    resultContainer.innerHTML = '';
    try {
      const rows = parseTSV(tsvInput.value);
      if (!rows.length) throw new Error('No data parsed.');

      rows.forEach((row, i) => {
        const loi = generateLOI(row, state.offerType, state.toneStyle);
        const title = row[Object.keys(row)[0]] || `Deal ${i + 1}`;
        const details = createElement(
          'details',
          {},
          createElement('summary', {}, title),
          renderLOICard(loi)
        );
        resultContainer.appendChild(details);
      });
    } catch (err) {
      resultContainer.appendChild(
        createElement('p', { className: 'error' }, err.message)
      );
    }
  }
}
