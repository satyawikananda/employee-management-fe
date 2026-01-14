import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

import SignInPage from '../app/(auth)/sign-in/page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('SignInPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders the sign in form', () => {
    render(<SignInPage />);

    // Use accessible role for heading
    expect(screen.getByRole('heading', { name: /login to your account/i })).toBeTruthy();

    // Inputs (use getAll to be safe but usually should be one if cleanup works)
    const emailInputs = screen.getAllByLabelText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);

    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(passwordInputs.length).toBeGreaterThan(0);

    const loginBtns = screen.getAllByRole('button', { name: /login/i });
    expect(loginBtns.length).toBeGreaterThan(0);
  });

  it('handles successful login', async () => {
    render(<SignInPage />);

    (signIn as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ error: null });

    const emailInputs = screen.getAllByLabelText(/email/i);
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const loginBtns = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });

    fireEvent.click(loginBtns[0]);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('handles login error', async () => {
    render(<SignInPage />);

    (signIn as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ error: 'Invalid credentials' });

    const emailInputs = screen.getAllByLabelText(/email/i);
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const loginBtns = screen.getAllByRole('button', { name: /login/i });

    fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'wrongpassword' } });

    fireEvent.click(loginBtns[0]);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(<SignInPage />);

    const loginBtns = screen.getAllByRole('button', { name: /login/i });
    fireEvent.click(loginBtns[0]);

    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
    });
  });
});
