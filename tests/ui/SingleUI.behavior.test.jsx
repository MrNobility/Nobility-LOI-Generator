// tests/ui/SingleUI.behavior.test.jsx

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SingleUI from '../../src/ui/SingleUI';

jest.mock('../../src/core/state.js', () => ({
  set: jest.fn(),
}));

describe('SingleUI integration behavior', () => {
  test('generates LOI from TSV input and shows output', async () => {
    render(<SingleUI />);

    // Fill TSV
    const tsvInput = screen.getByPlaceholderText(/Paste single-row TSV/i);
    fireEvent.change(tsvInput, {
      target: {
        value:
          'TimeStamp\tFull Address\tPurchase Price\tListed Price\t% of List Price\tMonthly Payment (PITI)\tBalloon Term\tMonthly Insurance\tMonthly Taxes\tClose of Escrow\tEmd\tMonthly Rental Revenue\tAnnual Rental Revenue\tMonthly Operating Expenses\tAnnual Operating Expenses\tMonthly CashFlow\tAnnual Cashflow\tCash on Cash Return\tBuyer entry Fee %\n' +
          '2025-05-03\t123 Main St, Austin TX\t300000\t320000\t93.75\t1500\t5\t100\t150\t2025-06-01\t5000\t2500\t30000\t1000\t12000\t1500\t18000\t0.12\t0.05',
      },
    });

    // Confirm button is present
    const generateBtn = screen.getByRole('button', { name: /Generate LOI/i });
    expect(generateBtn).toBeInTheDocument();

    // Click it
    fireEvent.click(generateBtn);

    // Wait for output to render
    await waitFor(() => {
      const matches = screen.getAllByText((text) =>
        text.includes('123 Main St') || text.includes('Purchase Price')
      );
      expect(matches.length).toBeGreaterThan(0);
    });
    
      

    // Confirm some expected output
    expect(screen.getByText(/123 Main St, Austin TX/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Purchase Price/i).length).toBeGreaterThan(0);
  });
});
