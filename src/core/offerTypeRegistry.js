// src/core/offerTypeRegistry.js

/**
 * Defines available offer types, display labels, and their allowed toneStyles.
 * Must stay in sync with toneRegistry keys.
 */
export const offerTypes = {
    cash: {
      id: 'cash',
      displayName: 'Cash Offer',
      tones: ['professional'],
    },
    sellerFinance: {
      id: 'sellerFinance',
      displayName: 'Seller Finance Offer',
      tones: ['professional', 'marketReality'],
    },
  };
  
  /**
   * Get array of all offerType definitions.
   * @returns {{id: string, displayName: string, tones: string[]}[]}
   */
  export function listOfferTypes() {
    return Object.values(offerTypes);
  }
  
  /**
   * Lookup a single offerType by its id.
   * @param {string} id
   * @returns {{id: string, displayName: string, tones: string[]}}
   * @throws {Error} if unknown
   */
  export function getOfferType(id) {
    const type = offerTypes[id];
    if (!type) {
      throw new Error(`OfferTypeRegistry: unknown offerType "${id}"`);
    }
    return type;
  }
  
  export default {
    listOfferTypes,
    getOfferType,
  };
  