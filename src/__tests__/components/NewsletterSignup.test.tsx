// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/__tests__/components/NewsletterSignup.test.tsx
// Unit tests for the NewsletterSignup form component
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;
const WAITLIST_STORAGE_KEY = 'codelithlabs_waitlist_joined_v1';

const storage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage.set(key, String(value));
  }),
  removeItem: vi.fn((key: string) => {
    storage.delete(key);
  }),
  clear: vi.fn(() => {
    storage.clear();
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the email input and waitlist submit button', () => {
    render(<NewsletterSignup />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join.*waitlist/i })).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<NewsletterSignup compact />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join.*waitlist|subscribe/i })).toBeInTheDocument();
  });

  it('submits waitlist email, persists local marker, and hides the form', async () => {
    render(<NewsletterSignup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /join.*waitlist/i }));

    await waitFor(() => {
      expect(screen.getByText(/on the waitlist/i)).toBeInTheDocument();
    });

    expect(window.localStorage.getItem(WAITLIST_STORAGE_KEY)).toBe('1');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('shows error message if localStorage write fails', async () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });

    render(<NewsletterSignup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'bad@email');
    await user.click(screen.getByRole('button', { name: /join.*waitlist/i }));

    await waitFor(() => {
      expect(screen.getByText(/storage blocked/i)).toBeInTheDocument();
    });

    setItemSpy.mockRestore();
  });

  it('shows joined state immediately when marker already exists in localStorage', async () => {
    window.localStorage.setItem(WAITLIST_STORAGE_KEY, '1');

    render(<NewsletterSignup />);

    await waitFor(() => {
      expect(screen.getByText(/on the waitlist/i)).toBeInTheDocument();
    });

    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not submit when email is empty', async () => {
    render(<NewsletterSignup />);

    fireEvent.submit(screen.getByRole('button', { name: /join.*waitlist/i }).closest('form')!);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(WAITLIST_STORAGE_KEY)).not.toBe('1');
  });

  it('renders a stable test id for e2e selectors', () => {
    render(<NewsletterSignup />);
    expect(screen.getByTestId('newsletter-signup')).toBeInTheDocument();
  });
});
