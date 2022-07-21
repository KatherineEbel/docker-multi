import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders correct heading', () => {
  render(<App />);
  const paragraph = screen.getByText(/react fibonacci calculator/i);
  expect(paragraph).toBeInTheDocument();
});
