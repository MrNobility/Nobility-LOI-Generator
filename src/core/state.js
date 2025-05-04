// src/core/state.js

/**
 * Simple reactive state store for:
 *   - offerType (string)
 *   - toneStyle (string)
 *   - parsedData (array of objects from TSV)
 */
const listeners = [];

const state = {
  offerType: null,
  toneStyle: null,
  parsedData: [],

  /**
   * Update a state key and notify subscribers.
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    if (!(key in state)) {
      throw new Error(`State: unknown key "${key}"`);
    }
    state[key] = value;
    listeners.forEach((fn) => fn({ [key]: value }));
  },

  /**
   * Subscribe to state changes.
   * @param {(change: Object) => void} fn
   * @returns {() => void} unsubscribe function
   */
  subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },
};

export default state;
