import { render, screen } from '@testing-library/react';
import { Card } from '@/presentation/components/ui/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card><div>Card Content</div></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
