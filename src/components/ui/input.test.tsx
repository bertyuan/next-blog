import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from './input';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

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

  test('handles user typing and triggers onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="Username" onChange={handleChange} />);
    const input = screen.getByLabelText('Username');

    await user.type(input, 'hello world');

    expect(input).toHaveValue('hello world');
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(11);
  });
});

