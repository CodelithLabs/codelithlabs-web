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

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email input and submit button', () => {
    render(<NewsletterSignup />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<NewsletterSignup compact />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('submits email and shows success message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, pendingConfirmation: true }),
    });

    render(<NewsletterSignup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/confirm your subscription/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/newsletter/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  it('shows error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid email address' }),
    });

    render(<NewsletterSignup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'bad@email');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows error message on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<NewsletterSignup />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('does not submit when email is empty', async () => {
    render(<NewsletterSignup />);

    fireEvent.submit(screen.getByRole('button', { name: /subscribe/i }).closest('form')!);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('renders a stable test id for e2e selectors', () => {
    render(<NewsletterSignup />);
    expect(screen.getByTestId('newsletter-signup')).toBeInTheDocument();
  });
});
