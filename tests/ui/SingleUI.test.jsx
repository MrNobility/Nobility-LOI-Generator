import React from 'react';
import { render } from '@testing-library/react';
import SingleUI from '../../src/ui/SingleUI';

test('SingleUI component matches snapshot', () => {
  const { container } = render(<SingleUI />);
  expect(container).toMatchSnapshot();
});
