import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/presentation/components/ui/Modal';

describe('Modal Component', () => {
  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={jest.fn()} title="Test Modal"><div>Content</div></Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={jest.fn()}><div>Content</div></Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={handleClose} title="Test"><div>Content</div></Modal>);
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
