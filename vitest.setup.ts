import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string, values?: any) => {
    if (values) {
      return `${namespace}.${key} ${JSON.stringify(values)}`;
    }
    return `${namespace}.${key}`;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock PointerEvent
if (typeof window !== 'undefined') {
  window.PointerEvent = class PointerEvent extends MouseEvent {} as any;
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
