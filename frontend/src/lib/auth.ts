import { supabase } from './supabase';

export interface UserSession {
  member_id: string;
  team_id: string;
  role: 'member' | 'manager';
  email: string;
  name?: string;
}

const SESSION_KEY = 'opspilot_session';

// User-friendly error messages
const friendlyErrors: Record<string, string> = {
  'Invalid login credentials': 'Incorrect email or password. Please try again.',
  'Email not confirmed': 'Please check your email and confirm your account first.',
  'User already registered': 'An account with this email already exists. Try logging in.',
};

function getFriendlyError(error: string): string {
  return friendlyErrors[error] || 'Something went wrong. Please try again later.';
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: getFriendlyError(authError.message) };
    }

    if (!authData.user) {
      return { success: false, error: 'Unable to sign in. Please try again.' };
    }

    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, team_id, role, name')
      .eq('email', email)
      .single();

    if (memberError || !member) {
      console.error('Member lookup error:', memberError);
      return { success: false, error: 'Account not found. Please sign up first.' };
    }

    const session: UserSession = {
      member_id: member.id,
      team_id: member.team_id,
      role: member.role || 'member',
      email: email,
      name: member.name,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}

export async function signUpManager(
  email: string,
  password: string,
  name: string,
  teamName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return { success: false, error: getFriendlyError(authError.message) };
    }
    if (!authData.user) {
      return { success: false, error: 'Unable to create account. Please try again.' };
    }

    // 2. Create Team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({ name: teamName, manager_name: name, manager_email: email })
      .select('id')
      .single();

    if (teamError) {
      console.error('Team creation error:', teamError);
      return { success: false, error: 'Unable to create team. Please try again.' };
    }

    // 3. Create Member (using email as the unique identifier)
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        team_id: team.id,
        email,
        name,
        role: 'manager'
      });

    if (memberError) {
      console.error('Member creation error:', memberError);
      return { success: false, error: 'Unable to complete registration. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Signup error:', err);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}

export async function signUpMember(
  email: string,
  password: string,
  name: string,
  teamId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify team exists
    const { data: team, error: teamCheckError } = await supabase
      .from('teams')
      .select('id')
      .eq('id', teamId)
      .single();

    if (teamCheckError || !team) {
      return { success: false, error: 'Invalid Team ID. Please check with your manager.' };
    }

    // 2. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return { success: false, error: getFriendlyError(authError.message) };
    }
    if (!authData.user) {
      return { success: false, error: 'Unable to create account. Please try again.' };
    }

    // 3. Create Member (using email as the unique identifier)
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        team_id: teamId,
        email,
        name,
        role: 'member'
      });

    if (memberError) {
      console.error('Member creation error:', memberError);
      return { success: false, error: 'Unable to complete registration. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Signup error:', err);
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}

export function getSession(): UserSession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  supabase.auth.signOut();
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getUser() {
  const session = getSession();
  if (!session) return null;
  return {
    ...session,
    isManager: session.role === 'manager'
  };
}
