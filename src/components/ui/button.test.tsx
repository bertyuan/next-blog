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
    const variants = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ] as const;
    variants.forEach((variant) => {
      render(<Button variant={variant}>{variant} Variant</Button>);
      const button = screen.getByText(`${variant} Variant`);
      expect(button).toBeInTheDocument();
    });
  });

  // Test buttons with different sizes
  test('renders button with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    sizes.forEach((size) => {
      render(<Button size={size}>{size} Size</Button>);
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

  // Test custom className merging
    test('merges custom className correctly', () => {
      render(<Button className="my-custom-test-class">Custom Class</Button>);
      const button = screen.getByText('Custom Class');

      // It should have the newly added class
      expect(button).toHaveClass('my-custom-test-class');
      // It should also retain the base classes defined in cva
      expect(button).toHaveClass('inline-flex', 'items-center');
    });

  // Test native HTML props forwarding
    test('passes native HTML attributes correctly', () => {
      render(
        <Button type="submit" aria-label="Submit Form" data-testid="submit-btn">
          Submit
        </Button>
      );
      const button = screen.getByTestId('submit-btn');

      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('aria-label', 'Submit Form');
    });

  // Optimized: Test buttons with different variants by checking classes
    test('applies specific classes for different variants', () => {
      render(<Button variant="destructive">Destructive</Button>);
      const destructiveButton = screen.getByText('Destructive');
      // Verify that the specific Tailwind class from cva is applied
      expect(destructiveButton).toHaveClass('bg-destructive', 'text-white');

      render(<Button variant="outline">Outline</Button>);
      const outlineButton = screen.getByText('Outline');
      expect(outlineButton).toHaveClass('border', 'bg-background');
    });
});
