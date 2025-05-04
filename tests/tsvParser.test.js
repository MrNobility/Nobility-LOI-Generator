// src/tests/tsvParser.test.js

// 1. Import the function you want to test
import parseTSV from '../src/core/tsvParser';

describe('parseTSV', () => {
  // 2. A “describe” block groups related tests together
  //    It can contain any number of individual test cases.

  test('parses a simple header-based TSV into objects', () => {
    // 3. Arrange: define your input
    const raw = 'colA\tcolB\nvalue1\tvalue2\nfoo\tbar';

    // 4. Act: call the function under test
    const result = parseTSV(raw);

    // 5. Assert: check that the output matches what you expect
    expect(result).toEqual([
      { colA: 'value1', colB: 'value2' },
      { colA: 'foo',    colB: 'bar'    },
    ]);
  });

  test('throws when a data row has the wrong number of columns', () => {
    const badRaw = 'c1\tc2\nonlyOneColumn';

    // 6. For error‐cases, wrap the call in a function and expect it to throw
    expect(() => parseTSV(badRaw)).toThrow(
      /has 1 columns; expected 2/  // matches the error message
    );
  });
/*
  test('supports header=false with supplied headers', () => {
    const raw = 'a\tb\nc\td';
    const result = parseTSV(raw, {
      header: false,
      headers: ['col1', 'col2'],
    });
    expect(result).toEqual([
      { col1: 'a', col2: 'b' },
      { col1: 'c', col2: 'd' },
    ]);
  });

  test('validates requiredFields', () => {
    const raw = 'x\ty\n1\t\n';
    expect(() =>
      parseTSV(raw, { requiredFields: ['x', 'y'] })
    ).toThrow(/required field "y" is empty/);
  });
  */
});
