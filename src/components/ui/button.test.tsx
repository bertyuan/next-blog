import { describe, test, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

// Test Button component rendering
describe('Button', () => {
  // Test default button rendering
  test('renders default button with text', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  // Test buttons with different variants
  test('renders button with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
    variants.forEach((variant) => {
      render(<Button variant={variant as any}>{variant} Variant</Button>);
      const button = screen.getByText(`${variant} Variant`);
      expect(button).toBeInTheDocument();
    });
  });

  // Test buttons with different sizes
  test('renders button with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'];
    sizes.forEach((size) => {
      render(<Button size={size as any}>{size} Size</Button>);
      const button = screen.getByText(`${size} Size`);
      expect(button).toBeInTheDocument();
    });
  });

  // Test button click events
  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Test</Button>);
    const button = screen.getByText('Click Test');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test disabled state
  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  // Test asChild property
  test('renders as a link when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">As Child Link</a>
      </Button>
    );
    const link = screen.getByText('As Child Link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });
});
