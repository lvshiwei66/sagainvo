import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '@/i18n/context';
import LanguageSettings from '../LanguageSettings';

// Mock the SettingsSection component
jest.mock('../SettingsSection', () => {
  return function MockSettingsSection({ children, title, description }) {
    return (
      <div data-testid="settings-section">
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </div>
    );
  };
});

// Mock the useI18n hook to control locale and toggleLocale
const mockToggleLocale = jest.fn();
const mockLocale = 'en';

jest.mock('@/i18n/context', () => ({
  ...jest.requireActual('@/i18n/context'),
  useI18n: () => ({
    locale: mockLocale,
    toggleLocale: mockToggleLocale,
    setLocale: mockToggleLocale,
  }),
}));

describe('LanguageSettings', () => {
  const renderWithI18n = (locale = 'en') => {
    return render(
      <I18nProvider initialLocale={locale}>
        <LanguageSettings />
      </I18nProvider>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    mockToggleLocale.mockClear();
    jest.clearAllMocks();
  });

  it('displays available languages', () => {
    renderWithI18n();

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
  });

  it('displays available languages with radio labels', () => {
    renderWithI18n();

    expect(screen.getByLabelText(/English/)).toBeInTheDocument();
    expect(screen.getByLabelText(/中文/)).toBeInTheDocument();
  });

  it('shows current language as selected', () => {
    renderWithI18n('en');

    const englishRadio = screen.getByLabelText(/English/);
    expect(englishRadio).toBeChecked();
  });

  it('displays correct initial language selection', () => {
    renderWithI18n('en');
    const englishRadio = screen.getByLabelText(/English/);
    expect(englishRadio.checked).toBe(true);
  });

  it('allows language switching', () => {
    renderWithI18n();

    const chineseRadio = screen.getByLabelText(/中文/);
    fireEvent.click(chineseRadio);

    expect(mockToggleLocale).toHaveBeenCalledTimes(1);
  });

  it('allows language change', () => {
    renderWithI18n('en');
    const chineseRadio = screen.getByLabelText(/中文/);

    fireEvent.click(chineseRadio);
    expect(chineseRadio.checked).toBe(true);
  });

  it('renders section title and description', () => {
    renderWithI18n();

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred language')).toBeInTheDocument();
  });
});
