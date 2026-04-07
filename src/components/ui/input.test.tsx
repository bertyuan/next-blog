import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  test('renders an input with the expected slot attribute', () => {
    render(<Input aria-label='Email' />);

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  test('supports input type and disabled props', () => {
    render(<Input aria-label='Password' type='password' disabled />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeDisabled();
  });
});

