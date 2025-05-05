// src/tests/loiEngine.test.js
import { generateLOI } from '../src/core/loiEngine';

describe('generateLOI smoke test', () => {
  it('throws when passed an empty data array', () => {
    expect(() => generateLOI(null, 'cash', 'professional')).toThrow();
  });
});
