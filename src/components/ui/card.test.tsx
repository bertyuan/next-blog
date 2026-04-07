import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card', () => {
  test('renders all card slots', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Card Title')).toHaveAttribute(
      'data-slot',
      'card-title',
    );
    expect(screen.getByText('Card Description')).toHaveAttribute(
      'data-slot',
      'card-description',
    );
    expect(screen.getByText('Action')).toHaveAttribute('data-slot', 'card-action');
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card-content');
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  test('appends custom class names correctly', () => {
    render(
      <Card className="my-custom-card-class">
        <CardContent className="my-custom-content-class">Content</CardContent>
      </Card>
    );

    const cardElement = screen.getByText('Content').parentElement; // 或者直接给 Card 加个 data-testid
    expect(cardElement).toHaveClass('my-custom-card-class');
    expect(screen.getByText('Content')).toHaveClass('my-custom-content-class');
  });

  test('passes standard HTML attributes to the DOM node', () => {
    render(
      <Card id="test-card" aria-label="Test Card">
        <CardContent data-testid="content-id">Content</CardContent>
      </Card>
    );

    const cardElement = screen.getByLabelText('Test Card');
    expect(cardElement).toHaveAttribute('id', 'test-card');
    expect(screen.getByTestId('content-id')).toBeInTheDocument();
  });
});

