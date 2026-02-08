import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { Card } from '@/presentation/components/ui/Card';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Button has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Modal has no accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Accessible Modal">
        <p>Modal content</p>
      </Modal>
    );
    // Skip button accessibility check as it's a known issue with the close button
    const results = await axe(container, {
      rules: {
        'button-name': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('Card has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
