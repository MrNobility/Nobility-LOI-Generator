// src/ui/bulkUI.js

import parseTSV from '../core/tsvParser.js';
import { generateLOI } from '../core/loiEngine.js';
import state from '../core/state.js';
import { listOfferTypes, getOfferType } from '../core/offerTypeRegistry.js';
import { createElement } from './sharedRenderer.js';

export function initBulkUI(rootId = 'bulkApp') {
  const root = document.getElementById(rootId);
  if (!root) return console.error(`#${rootId} not found`);

  // Clear container and header
  root.innerHTML = '';
  root.appendChild(
    createElement('h3', { className: 'text-xl font-semibold mb-4' }, 'Bulk Deals')
  );

  // Load saved user info from localStorage
  const savedUser = JSON.parse(localStorage.getItem('loiUser') || '{}');

  // Build form
  const form = createElement('form', { className: 'space-y-6' });

  // User Signature Info inputs
  [
    { label: 'Name', id: 'bulk-yourName', type: 'text', placeholder: 'e.g. John Doe' },
    { label: 'Phone', id: 'bulk-yourPhone', type: 'tel', placeholder: '555-123-4567' },
    { label: 'Email', id: 'bulk-yourEmail', type: 'email', placeholder: 'you@example.com' },
  ].forEach(({ label, id, type, placeholder }) => {
    const wrap = createElement('div', { className: 'mb-4 max-w-xl mx-auto' });
    wrap.appendChild(
      createElement('label', { htmlFor: id, className: 'block font-medium mb-1' }, `Your ${label}`)
    );
    const input = createElement('input', {
      id,
      name: id,
      type,
      className: 'w-full border rounded p-2',
      placeholder
    });
    // Pre-populate from saved
    if (savedUser) {
      if (id === 'bulk-yourName' && savedUser.name) input.value = savedUser.name;
      if (id === 'bulk-yourPhone' && savedUser.phone) input.value = savedUser.phone;
      if (id === 'bulk-yourEmail' && savedUser.email) input.value = savedUser.email;
    }
    wrap.appendChild(input);
    form.appendChild(wrap);
  });

  // Offer Type select
  const offerWrap = createElement('div', { className: 'mb-4 max-w-xl mx-auto' });
  offerWrap.appendChild(
    createElement('label', { htmlFor: 'bulk-offerType', className: 'block font-medium mb-1' }, 'Offer Type')
  );
  const offerTypeSelect = createElement('select', {
    id: 'bulk-offerType',
    name: 'bulk-offerType',
    className: 'w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
  });
  listOfferTypes().forEach(t =>
    offerTypeSelect.appendChild(createElement('option', { value: t.id }, t.displayName))
  );
  offerWrap.appendChild(offerTypeSelect);
  form.appendChild(offerWrap);

  // Tone Style select
  const toneWrap = createElement('div', { className: 'mb-4 max-w-xl mx-auto' });
  toneWrap.appendChild(
    createElement('label', { htmlFor: 'bulk-toneStyle', className: 'block font-medium mb-1' }, 'Tone Style')
  );
  const toneSelect = createElement('select', {
    id: 'bulk-toneStyle',
    name: 'bulk-toneStyle',
    className: 'w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
    disabled: true
  });
  toneWrap.appendChild(toneSelect);
  form.appendChild(toneWrap);

  // TSV Input
  const tsvWrap = createElement('div', { className: 'mb-4 max-w-xl mx-auto' });
  tsvWrap.appendChild(
    createElement('label', { htmlFor: 'bulk-tsvData', className: 'block font-medium mb-1' }, 'Deals Data (TSV)')
  );
  const tsvInput = createElement('textarea', {
    id: 'bulk-tsvData',
    name: 'bulk-tsvData',
    rows: 8,
    className: 'w-full border rounded p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500',
    placeholder: 'Paste multi-row TSV here (headers optional)'
  });
  tsvWrap.appendChild(tsvInput);
  form.appendChild(tsvWrap);

  // Generate Button + Spinner
  const btnWrap = createElement('div', { className: 'mt-6 max-w-xl mx-auto flex items-center' });
  const spinner = createElement('span', { className: 'ml-2 hidden animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full' });
  const btnGenerate = createElement(
    'button',
    { type: 'button', className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500' },
    'Generate Bulk LOIs', spinner
  );
  btnWrap.appendChild(btnGenerate);
  form.appendChild(btnWrap);

  // Results container
  const resultContainer = createElement('div', {
    id: 'bulk-loiResults',
    className: 'mt-6 space-y-4 max-w-xl mx-auto',
    'aria-live': 'polite'
  });

  // Attach form & results
  root.appendChild(form);
  root.appendChild(resultContainer);

  // Initialize defaults
  const defaultOffer = listOfferTypes()[0]?.id || '';
  state.set('offerType', defaultOffer);
  offerTypeSelect.value = defaultOffer;
  const def = getOfferType(defaultOffer);
  toneSelect.innerHTML = '';
  def.tones.forEach(style => toneSelect.appendChild(createElement('option', { value: style }, style)));
  toneSelect.disabled = false;
  state.set('toneStyle', toneSelect.value);

  // Persist signature info on change
  ['bulk-yourName', 'bulk-yourPhone', 'bulk-yourEmail'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const profile = {
        name: document.getElementById('bulk-yourName').value,
        phone: document.getElementById('bulk-yourPhone').value,
        email: document.getElementById('bulk-yourEmail').value
      };
      localStorage.setItem('loiUser', JSON.stringify(profile));
    });
  });

  // Handlers for selects
  offerTypeSelect.addEventListener('change', () => {
    const ot = offerTypeSelect.value;
    state.set('offerType', ot);
    const updated = getOfferType(ot);
    toneSelect.innerHTML = '';
    updated.tones.forEach(style => toneSelect.appendChild(createElement('option', { value: style }, style)));
    toneSelect.disabled = false;
    state.set('toneStyle', toneSelect.value);
  });
  toneSelect.addEventListener('change', () => state.set('toneStyle', toneSelect.value));

  // Generate click
  btnGenerate.addEventListener('click', () => {
    console.log('🔍 BulkUI sanitize code is running');
    console.log('  → raw TSV columns:', tsvInput.value.split('\n').map(l => l.split('\t').length));

    const cleaned = tsvInput.value.trim().replace(/\t+$/gm, '');
    console.log('  → cleaned TSV columns:', cleaned.split('\n').map(l => l.split('\t').length));

    tsvInput.classList.remove('border-red-500');
    resultContainer.innerHTML = '';

    // disable & spinner
    const originalText = btnGenerate.firstChild.nodeValue;
    btnGenerate.disabled = true;
    spinner.classList.remove('hidden');
    btnGenerate.classList.add('opacity-50', 'cursor-not-allowed');
    btnGenerate.firstChild.nodeValue = 'Generating…';

    setTimeout(() => {
      try {
        const rows = parseTSV(cleaned);
        if (!rows.length) throw new Error('TSV Parser error: No data parsed.');

        // column consistency check
        const expectedCols = Object.keys(rows[0]).length;
        rows.forEach((r, idx) => {
          const cols = Object.keys(r).length;
          if (cols !== expectedCols) {
            throw new Error(`TSV Parser error: line ${idx+2} has ${cols} columns; expected ${expectedCols}.`);
          }
        });

        // render each LOI
        rows.forEach((row, i) => {
          const rawAddress = row.fulladdress || '';
          const abbreviated = rawAddress.split(',')[0].trim();
          const title = abbreviated || `Deal ${i+1}`;

          const fullRow = {
            ...row,
            yourname: document.getElementById('bulk-yourName').value,
            yourphone: document.getElementById('bulk-yourPhone').value,
            youremail: document.getElementById('bulk-yourEmail').value
          };
          const loi = generateLOI(fullRow, state.offerType, state.toneStyle);

          const htmlContainer = document.createElement('div');
          htmlContainer.className = 'bg-white border rounded p-4 space-y-4';
          htmlContainer.innerHTML = loi.html;

          const details = createElement(
            'details',
            { className: 'border rounded p-4' },
            createElement('summary', { className: 'font-medium cursor-pointer mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded' }, title),
            htmlContainer
          );
          resultContainer.appendChild(details);
        });
      } catch (err) {
        tsvInput.classList.add('border-red-500');
        resultContainer.appendChild(createElement('p', { className: 'text-red-600', role: 'alert' }, err.message));
      } finally {
        btnGenerate.disabled = false;
        btnGenerate.classList.remove('opacity-50', 'cursor-not-allowed');
        btnGenerate.firstChild.nodeValue = originalText;
        spinner.classList.add('hidden');
      }
    }, 0);
  });
}
