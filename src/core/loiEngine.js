// src/core/loiEngine.js

import { getToneConfig } from './toneRegistry.js';

// Alias mapping for template placeholders to normalized data keys
const placeholderAliases = {
  address: 'fulladdress',
  price: 'purchaseprice',
  closeescrow: 'closeofescrow',
  agent: 'pipeline',
  yourname: 'yourname',
  yourphone: 'yourphone',
  youremail: 'youremail'
};

/**
 * Normalize incoming data object keys to lowercase, alphanumeric-only,
 * and log both raw and normalized keys for debugging.
 */
function normalizeKeys(obj) {
  const result = {};
  for (const key in obj) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    result[normalizedKey] = obj[key];
  }
  return result;
}

/**
 * Normalize a placeholder key before lookup.
 */
function normalizeTemplateKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Convert plain-text paragraphs (separated by empty lines) into HTML paragraphs
 * preserving single-line breaks as <br>.
 */
function toHtmlParagraphs(text) {
  return text
    .split(/\n{2,}/g)
    .map(para => `<p>${para.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/**
 * Simple template replacer: replaces {{key}} in the template
 * with the corresponding value from data (stringified),
 * falling back to aliases if needed.
 */
function applyTemplate(template, data) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const normalizedKey = normalizeTemplateKey(key);
    let val = data[normalizedKey];
    if ((val === undefined || val === '') && placeholderAliases[normalizedKey]) {
      val = data[placeholderAliases[normalizedKey]];
    }
    return val != null ? String(val) : '';
  });
}

/**
 * Generate a Letter of Intent (LOI) in both plain-text and HTML.
 * - Normalizes data keys
 * - Applies subject, greeting, body, closing, signature templates
 * - Converts plain-text line breaks into HTML paragraphs
 */
export function generateLOI(data, offerType, toneStyle) {
  if (!data || typeof data !== 'object') {
    throw new Error('generateLOI: input must be a non-empty object');
  }

  const tone = getToneConfig(offerType, toneStyle);
  const normalizedData = normalizeKeys(data);

  const subject   = applyTemplate(tone.subject,   normalizedData);
  const greeting  = applyTemplate(tone.greeting,  normalizedData);
  const body      = applyTemplate(tone.body,      normalizedData);
  const closing   = applyTemplate(tone.closing,   normalizedData);
  const signature = applyTemplate(tone.signature, normalizedData);

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

  // Build HTML with proper paragraphs
  const html = [
    `<h1>${subject}</h1>`,
    toHtmlParagraphs(greeting),
    toHtmlParagraphs(body),
    toHtmlParagraphs(closing),
    toHtmlParagraphs(signature)
  ].join('');

  return { text, html };
}

export default { generateLOI };
