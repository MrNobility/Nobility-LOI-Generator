import { render } from '@testing-library/react';
import SingleUI from '../../src/ui/SingleUI';
import React from 'react'; // ✅ Required for JSX


test('SingleUI component matches snapshot', () => {
  const { container } = render(<SingleUI />);
  expect(container).toMatchSnapshot();
});
