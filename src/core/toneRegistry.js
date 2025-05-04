// src/core/toneRegistry.js

/**
 * ToneRegistry maps offerType and toneStyle to the tone configuration object.
 * Assumes your bundler allows JSON imports.
 */

  import sfProfessional     from '../tones/sellerFinance-professional.json';
  import sfMarketReality    from '../tones/sellerFinance-marketReality.json';
  import cashProfessional   from '../tones/cash-professional.json';

const registry = {
  sellerFinance: {
    professional: sfProfessional,
    marketReality: sfMarketReality,
  },
  cash: {
    professional: cashProfessional,
  },
};

/**
 * Get the JSON config for a given offerType+toneStyle.
 * @param {string} offerType    – 'sellerFinance' or 'cash'
 * @param {string} toneStyle    – 'professional' or 'marketReality'
 * @returns {Object}            – tone JSON
 * @throws {Error} if not found
 */
export function getToneConfig(offerType, toneStyle) {
  const typeEntry = registry[offerType];
  if (!typeEntry) {
    throw new Error(`ToneRegistry: unknown offerType "${offerType}"`);
  }
  const tone = typeEntry[toneStyle];
  if (!tone) {
    throw new Error(
      `ToneRegistry: unknown toneStyle "${toneStyle}" for offerType "${offerType}"`
    );
  }
  return tone;
}

/**
 * List all available toneStyle keys for an offerType.
 * @param {string} offerType
 * @returns {string[]}
 */
export function listToneStyles(offerType) {
  const typeEntry = registry[offerType];
  return typeEntry ? Object.keys(typeEntry) : [];
}

export default {
  getToneConfig,
  listToneStyles,
};
