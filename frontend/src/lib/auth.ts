import { supabase } from './supabase';

export interface UserSession {
  member_id: string;
  team_id: string;
  role: 'member' | 'manager';
  email: string;
  name?: string;
}

const SESSION_KEY = 'opspilot_session';

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'User not found' };
    }

    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, team_id, role, name')
      .eq('user_id', authData.user.id)
      .single();

    if (memberError || !member) {
      return { success: false, error: 'User record not found in members table.' };
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
    return { success: false, error: 'An unexpected error occurred.' };
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

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: 'Failed to create user' };

    // 2. Create Team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({ name: teamName, manager_name: name })
      .select('id')
      .single();

    if (teamError) return { success: false, error: 'Failed to create team: ' + teamError.message };

    // 3. Create Member
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        user_id: authData.user.id,
        team_id: team.id,
        email,
        name,
        role: 'manager'
      });

    if (memberError) return { success: false, error: 'Failed to create member record: ' + memberError.message };

    return { success: true };
  } catch (err) {
    console.error('Signup error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
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

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: 'Failed to create user' };

    // 3. Create Member
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        user_id: authData.user.id,
        team_id: teamId,
        email,
        name,
        role: 'member'
      });

    if (memberError) return { success: false, error: 'Failed to create member record: ' + memberError.message };

    return { success: true };
  } catch (err) {
    console.error('Signup error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
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
