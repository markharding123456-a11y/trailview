import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getSession: mockGetSession,
      getUser: mockGetUser,
    },
    from: vi.fn(),
  }),
}));

describe('auth module', () => {
  beforeEach(() => {
    vi.resetModules();
    mockSignInWithPassword.mockReset();
    mockSignOut.mockReset();
    mockGetSession.mockReset();
    mockGetUser.mockReset();
  });

  it('signIn calls supabase.auth.signInWithPassword', async () => {
    const mockData = { user: { id: 'u1' }, session: { access_token: 'tok' } };
    mockSignInWithPassword.mockResolvedValue({ data: mockData, error: null });

    const { signIn } = await import('@/lib/auth');
    const result = await signIn('test@example.com', 'password123');

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toEqual(mockData);
  });

  it('signOut calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { signOut } = await import('@/lib/auth');
    await signOut();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('getSession returns session data', async () => {
    const mockSession = { access_token: 'tok', user: { id: 'u1' } };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });

    const { getSession } = await import('@/lib/auth');
    const session = await getSession();

    expect(session).toEqual(mockSession);
  });

  it('getUser returns user data', async () => {
    const mockUser = { id: 'u1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const { getUser } = await import('@/lib/auth');
    const user = await getUser();

    expect(user).toEqual(mockUser);
  });
});
