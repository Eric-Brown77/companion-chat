import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('处理中...')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="primary">Primary Button</Button>);
    expect(container.firstChild).toHaveClass('bg-blue-600');
  });

  it('is disabled when loading or disabled prop is true', () => {
    render(<Button loading disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});