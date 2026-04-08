import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsSection from '../SettingsSection';

describe('SettingsSection', () => {
  it('renders title and description', () => {
    render(
      <SettingsSection
        title="Language"
        description="Choose your preferred language"
      >
        <div>Content</div>
      </SettingsSection>
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred language')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <SettingsSection
        title="Test Title"
        description="Test Description"
      >
        <input type="text" data-testid="test-input" />
      </SettingsSection>
    );

    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });
});