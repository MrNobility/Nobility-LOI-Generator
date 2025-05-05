// src/core/tsvParser.js

import { columnOrder } from './columnMap.js';

/**
 * Parse a TSV (tab-separated values) string into an array of row objects.
 *
 * @param {string} raw      - The raw TSV text.
 * @param {Object} [opts]   - Parser options.
 * @param {boolean} [opts.header=true]      - Whether first line is a header row.
 * @param {string[]}  [opts.headers]        - If header=false, supply your own column names.
 * @param {string[]}  [opts.requiredFields] - List of field names that must be present & non-empty.
 * @returns {Object[]} Array of parsed row objects.
 * @throws {Error} When input isn’t a string, rows mismatch header length, or required fields missing/empty.
 */
export default function parseTSV(raw, opts = {}) {
  const { header = true, headers: suppliedHeaders, requiredFields = [] } = opts;

  if (typeof raw !== 'string') {
    throw new Error('TSV Parser error: input must be a string.');
  }

  // Trim and remove BOM if present
  let content = raw.trim();
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  // Split into non-empty lines
  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  // Detect whether to use header row or fallback to columnMap
  let columnNames;
  let dataLines;

  const looksLikeHeader = lines[0].toLowerCase().includes('address') || lines[0].toLowerCase().includes('purchase price');

  if (header && looksLikeHeader) {
    columnNames = lines[0].split('\t').map(h => h.trim());
    dataLines = lines.slice(1);
  } else {
    columnNames = suppliedHeaders || columnOrder;
    dataLines = lines;
  }

  // Parse each data line
  return dataLines.map((line, rowIndex) => {
    const values = line.split('\t');
    if (values.length !== columnNames.length) {
      throw new Error(
        `TSV Parser error: line ${rowIndex + (header ? 2 : 1)} has ${values.length} columns; expected ${columnNames.length}.`
      );
    }

    const row = {};
    columnNames.forEach((col, i) => {
      const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, '');
      row[normalized] = values[i].trim();
    });

    // Validate required fields
    requiredFields.forEach(field => {
      if (!(field in row)) {
        throw new Error(
          `TSV Parser error: required field "${field}" missing in line ${rowIndex + (header ? 2 : 1)}.`
        );
      }
      if (row[field] === '') {
        throw new Error(
          `TSV Parser error: required field "${field}" is empty in line ${rowIndex + (header ? 2 : 1)}.`
        );
      }
    });

    return row;
  });
}
