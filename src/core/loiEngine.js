// src/core/loiEngine.js

import { getToneConfig } from './toneRegistry.js';

function normalizeKeys(obj) {
  const result = {};
  for (const key in obj) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/gi, '');
    result[normalized] = obj[key];
  }
  return result;
}

/**
 * Simple template replacer: replaces {{key}} in the template
 * with the corresponding value from data (stringified).
 *
 * @param {string} template
 * @param {Object} data
 * @returns {string}
 */
function applyTemplate(template, data) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const val = data[key];
    return val != null ? String(val) : '';
  });
}

/**
 * Generate a Letter of Intent (LOI) in both plain-text and HTML.
 *
 * @param {Object} data        – Parsed deal data (e.g. address, purchasePrice, etc.)
 * @param {string} offerType   – e.g. 'sellerFinance' or 'cash'
 * @param {string} toneStyle   – e.g. 'professional' or 'marketReality'
 * @returns {{ text: string, html: string }}
 */
export function generateLOI(data, offerType, toneStyle) {
  if (!data || typeof data !== 'object') {
    throw new Error('generateLOI: input must be a non-empty object');
  }

  const tone = getToneConfig(offerType, toneStyle);

  // 🔥 Normalize keys before templating
  const normalizedData = normalizeKeys(data);

  // Apply templates
  const subject   = applyTemplate(tone.subject,   normalizedData);
  const greeting  = applyTemplate(tone.greeting,  normalizedData);
  const body      = applyTemplate(tone.body,      normalizedData);
  const closing   = applyTemplate(tone.closing,   normalizedData);
  const signature = applyTemplate(tone.signature, normalizedData);

  const text = [
    subject, '', greeting, '', body, '', closing, signature
  ].join('\n');

  const html = `
    <h1>${subject}</h1>
    <p>${greeting}</p>
    <p>${body}</p>
    <p>${closing}</p>
    <p>${signature}</p>
  `.trim();

  return { text, html };
}


export default {
  generateLOI
};
