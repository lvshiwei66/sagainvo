import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '@/i18n/context';
import LanguageSettings from '../LanguageSettings';

// Mock the SettingsSection component
jest.mock('../SettingsSection', () => ({
  __esModule: true,
  default: ({ children, title, description }: { children: React.ReactNode; title: string; description: string }) => (
    <div data-testid="settings-section">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  )
}));

// Create a wrapper for testing with I18n context
const renderWithI18n = (locale = 'en') => {
  return render(
    <I18nProvider initialLocale={locale}>
      <LanguageSettings />
    </I18nProvider>
  );
};

describe('LanguageSettings', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Clear all mocks
    jest.clearAllMocks();
  });

  test('renders language options correctly', () => {
    renderWithI18n();

    expect(screen.getByLabelText(/English/)).toBeInTheDocument();
    expect(screen.getByLabelText(/中文/)).toBeInTheDocument();
  });

  test('displays correct initial language selection', () => {
    renderWithI18n('en');
    const englishRadio = screen.getByLabelText(/English/) as HTMLInputElement;
    expect(englishRadio.checked).toBe(true);
  });

  test('allows language change', () => {
    renderWithI18n('en');
    const chineseRadio = screen.getByLabelText(/中文/) as HTMLInputElement;

    fireEvent.click(chineseRadio);
    expect(chineseRadio.checked).toBe(true);
  });

  test('renders section title and description', () => {
    renderWithI18n();

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred language')).toBeInTheDocument();
  });
});