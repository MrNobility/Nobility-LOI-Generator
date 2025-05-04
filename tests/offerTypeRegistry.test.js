// tests/offerTypeRegistry.test.js
import offerRegistry from '../src/core/offerTypeRegistry';
const { listOfferTypes, getOfferType } = offerRegistry;

describe('offerTypeRegistry', () => {
  it('lists "cash" and "sellerFinance" as valid offer types', () => {
    const types = listOfferTypes().map(t => t.id);
    expect(types).toEqual(expect.arrayContaining(['cash', 'sellerFinance']));
  });

  it('returns the toneStyles array for "cash"', () => {
    const cashCfg = getOfferType('cash');
    expect(cashCfg).toHaveProperty('tones');
    expect(Array.isArray(cashCfg.tones)).toBe(true);
    expect(cashCfg.tones).toContain('professional');
  });

  it('throws if asked for an unknown offer type', () => {
    expect(() => getOfferType('foobar')).toThrow(/unknown offerType "foobar"/);
  });
});
