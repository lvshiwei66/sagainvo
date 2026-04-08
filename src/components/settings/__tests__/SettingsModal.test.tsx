import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from '../SettingsModal';

describe('SettingsModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <SettingsModal isOpen={true} onClose={mockOnClose} title="Settings">
        <div>Test content</div>
      </SettingsModal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <SettingsModal isOpen={false} onClose={mockOnClose} title="Settings">
        <div>Test content</div>
      </SettingsModal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <SettingsModal isOpen={true} onClose={mockOnClose} title="Settings">
        <div>Test content</div>
      </SettingsModal>
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <SettingsModal isOpen={true} onClose={mockOnClose} title="Settings">
        <div>Test content</div>
      </SettingsModal>
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <SettingsModal isOpen={true} onClose={mockOnClose} title="Settings">
        <div>Test content</div>
      </SettingsModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});