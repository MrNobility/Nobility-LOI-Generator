// src/ui/singleUI.js

import parseTSV from '../core/tsvParser.js';
import { generateLOI } from '../core/loiEngine.js';
import state from '../core/state.js';
import { listOfferTypes, getOfferType } from '../core/offerTypeRegistry.js';
import {
  createElement,
  createButton,
  renderLOICard
} from './sharedRenderer.js';

export function initSingleUI(rootId = 'app') {
  const root = document.getElementById(rootId);
  if (!root) return console.error(`#${rootId} not found`);

  // Create a <form> to group controls
  const form = createElement('form', { className: 'single-form' });

  // --- Offer Type ---
  const offerTypeId = 'single-offerType';
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

  // --- Tone Style ---
  const toneId = 'single-toneStyle';
  const toneSelect = createElement('select', {
    id: toneId,
    name: toneId,
    disabled: true
  });
  form.append(
    createElement('label', { htmlFor: toneId }, 'Tone Style'),
    toneSelect
  );

  // --- TSV Input ---
  const tsvId = 'single-tsvData';
  const tsvInput = createElement('textarea', {
    id: tsvId,
    name: tsvId,
    rows: 8,
    className: 'tsv-input',
    placeholder: 'Paste single-row TSV here (headers on first line)'
  });
  form.append(
    createElement('label', { htmlFor: tsvId }, 'Deal Data (TSV)'),
    tsvInput
  );

  // --- Generate Button ---
  const btnGenerate = createButton('Generate LOI', onGenerate, 'button');
  form.append(btnGenerate);

  // Output container
  const resultContainer = createElement('div', { id: 'single-loiResult' });

  // Add form + results to root
  root.append(
    createElement('h3', {}, 'Single Deal'),
    form,
    resultContainer
  );

  // Event wiring
  offerTypeSelect.addEventListener('change', () => {
    const ot = offerTypeSelect.value;
    state.set('offerType', ot);
    const typeDef = getOfferType(ot);

    // populate toneSelect
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
      state.set('parsedData', rows);
      const loi = generateLOI(rows[0], state.offerType, state.toneStyle);
      resultContainer.appendChild(renderLOICard(loi));
    } catch (err) {
      resultContainer.appendChild(
        createElement('p', { className: 'error' }, err.message)
      );
    }
  }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  initSingleUI('app');
});
