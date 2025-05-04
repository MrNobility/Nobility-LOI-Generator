// tests/toneRegistry.test.js
import { getToneConfig } from '../src/core/toneRegistry';

describe('toneRegistry', () => {
  it('returns a config object for a valid offerType & toneStyle', () => {
    const cfg = getToneConfig('cash', 'professional');
    expect(cfg).toHaveProperty('subject');
    expect(cfg).toHaveProperty('greeting');
    expect(typeof cfg.subject).toBe('string');
    expect(typeof cfg.body).toBe('string');
  });

  it('throws if the offerType is invalid', () => {
    expect(() => getToneConfig('notAType', 'professional')).toThrow();
  });

  it('throws if the toneStyle is invalid for that offerType', () => {
    // assuming 'marketReality' only exists on sellerFinance
    expect(() => getToneConfig('cash', 'marketReality')).toThrow();
  });
});
