// src/core/loiEngine.js

import { getToneConfig } from './toneRegistry.js';

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
  // 1) Guard: require a non-empty data array
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('generateLOI: data array must be non-empty');
  }
  const tone = getToneConfig(offerType, toneStyle);

  // Apply templates
  const subject  = applyTemplate(tone.subject,  data);
  const greeting = applyTemplate(tone.greeting, data);
  const body     = applyTemplate(tone.body,     data);
  const closing  = applyTemplate(tone.closing,  data);
  const signature= applyTemplate(tone.signature,data);

  // Assemble plain-text
  const text = [
    subject,
    '',
    greeting,
    '',
    body,
    '',
    closing,
    signature
  ].join('\n');

  // Assemble HTML (simple tags; you can expand with styling later)
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
