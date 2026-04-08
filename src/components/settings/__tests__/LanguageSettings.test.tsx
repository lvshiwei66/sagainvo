import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '@/i18n/context';
import LanguageSettings from '../LanguageSettings';

// Mock the useI18n hook to control locale and toggleLocale
const mockToggleLocale = jest.fn();
const mockLocale = 'en';

jest.mock('@/i18n/context', () => ({
  ...jest.requireActual('@/i18n/context'),
  useI18n: () => ({
    locale: mockLocale,
    toggleLocale: mockToggleLocale,
  }),
}));

describe('LanguageSettings', () => {
  const renderWithI18n = (component: React.ReactNode) => {
    return render(
      <I18nProvider initialLocale={mockLocale}>
        {component}
      </I18nProvider>
    );
  };

  beforeEach(() => {
    mockToggleLocale.mockClear();
  });

  it('displays available languages', () => {
    renderWithI18n(<LanguageSettings />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
  });

  it('shows current language as selected', () => {
    renderWithI18n(<LanguageSettings />);

    // With locale 'en', English should be selected
    const englishRadio = screen.getByLabelText('English');
    expect(englishRadio).toBeChecked();
  });

  it('allows language switching', () => {
    renderWithI18n(<LanguageSettings />);

    const chineseRadio = screen.getByLabelText('中文');
    fireEvent.click(chineseRadio);

    expect(mockToggleLocale).toHaveBeenCalledTimes(1);
  });
});