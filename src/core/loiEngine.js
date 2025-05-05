// src/core/loiEngine.js

import { getToneConfig } from './toneRegistry.js';

// Alias mapping for template placeholders to normalized data keys
const placeholderAliases = {
  address: 'fulladdress',       // {{address}} → fulladdress
  price:   'purchaseprice',     // {{price}} → purchaseprice
  closeescrow: 'closeofescrow', // {{closeEscrow}} → closeofescrow
  agent: 'pipeline',            // {{agent}} → pipeline (or customize as needed)
  yourname:   'yourname',       // placeholders for user inputs
  yourphone:  'yourphone',
  youremail:  'youremail'
};

/**
 * Normalize incoming data object keys to lowercase, alphanumeric-only,
 * and log both raw and normalized keys for debugging.
 */
function normalizeKeys(obj) {
  console.log('🔑 Raw data keys:', Object.keys(obj));
  const result = {};
  for (const key in obj) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    result[normalizedKey] = obj[key];
  }
  console.log('🔑 Normalized data keys:', Object.keys(result));
  console.log('🔑 Sample normalized data:', result);
  return result;
}

/**
 * Normalize a placeholder key before lookup.
 */
function normalizeTemplateKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
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
 */
export function generateLOI(data, offerType, toneStyle) {
  if (!data || typeof data !== 'object') {
    throw new Error('generateLOI: input must be a non-empty object');
  }

  const tone = getToneConfig(offerType, toneStyle);

  // Normalize keys before templating
  const normalizedData = normalizeKeys(data);

  // Apply templates
  const subject   = applyTemplate(tone.subject,   normalizedData);
  const greeting  = applyTemplate(tone.greeting,  normalizedData);
  const body      = applyTemplate(tone.body,      normalizedData);
  const closing   = applyTemplate(tone.closing,   normalizedData);
  const signature = applyTemplate(tone.signature, normalizedData);

  // Debug: inspect post-template values
  console.log('🔨 Subject:', subject);
  console.log('🔨 Greeting:', greeting);
  console.log('🔨 Body:', body);
  console.log('🔨 Closing:', closing);
  console.log('🔨 Signature:', signature);

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
