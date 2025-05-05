import parseTSV from '../src/core/tsvParser.js';
import { columnOrder } from '../src/core/columnMap.js';

describe('parseTSV', () => {
  test('parses headerless TSV using columnOrder fallback', () => {
    // Build a TSV row with all 29 columns
    const values = columnOrder.map((col) => {
      switch (col) {
        case 'timestamp': return '2025-05-03';
        case 'fulladdress': return '123 Main St, Austin TX';
        case 'purchaseprice': return '300000';
        case 'listedprice': return '320000';
        case 'oflistprice': return '93.75';
        case 'monthlypaymentpiti': return '1500';
        case 'balloonterm': return '5';
        case 'monthlyinsurance': return '100';
        case 'monthlytaxes': return '150';
        case 'monthlyhoa': return '0';
        case 'annualinsurance': return '1200';
        case 'annualtaxes': return '1800';
        case 'annualhoa': return '0';
        case 'monthlyotherexpenses': return '0';
        case 'annualotherexpenses': return '0';
        case 'closeofescrow': return '2025-06-01';
        case 'emd': return '5000';
        case 'monthlyrentalrevenue': return '2500';
        case 'annualrentalrevenue': return '30000';
        case 'monthlyoperatingexpenses': return '1000';
        case 'annualoperatingexpenses': return '12000';
        case 'monthlycashflow': return '1500';
        case 'annualcashflow': return '18000';
        case 'cashoncashreturn': return '0.12';
        case 'buyerentryfee': return '0.05';
        case 'assignmentfee': return '10000';
        case 'dealstage': return 'initial';
        case 'dealname': return 'Main St Deal';
        case 'pipeline': return 'Texas';
        default: return '';
      }
    });

    const raw = values.join('\t');

    const rows = parseTSV(raw, {
      header: false,
      headers: columnOrder,
    });

    expect(rows.length).toBe(1);
    expect(rows[0].fulladdress).toBe('123 Main St, Austin TX');
    expect(rows[0].purchaseprice).toBe('300000');
    expect(rows[0].emd).toBe('5000');
  });

  test('throws error when required field is empty', () => {
    const raw = 'Address\tPrice\n123 Main St\t'; // Missing price value

    expect(() =>
      parseTSV(raw, {
        header: true,
        requiredFields: ['price'],
      })
    ).toThrow(/has \d+ columns; expected \d+/);
  });
});
