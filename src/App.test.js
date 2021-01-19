import { render, screen } from '@testing-library/react';
import wordCards from './wordCards';

test('renders learn react link', () => {
  render(<wordCards />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
