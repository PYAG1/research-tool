
import { SignInSchemaType, SignUpSchemaType, supabase } from "@renderer/lib";
import { Session, User } from "@supabase/supabase-js";

// Session timeout in milliseconds (e.g., 1 hour)
export const SESSION_TIMEOUT = 60 * 60 * 1000;
export const SESSION_STORAGE_KEY = 'supabase.auth.session';

// Interface for session data
export interface SessionData {
  session: Session | null;
  user: User | null;
  expires_at?: number;
}

export async function GoogleAuth() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: 'myapp://auth', // Use your custom protocol
    },
  });
}

export async function SignUpMutation({
  email,
  password,
  name,
}: SignUpSchemaType): Promise<{
  user: any;
  session: any;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (unexpectedError) {
    console.error("Unexpected error during signup:", unexpectedError);

    return {
      user: null,
      session: null,
      error: "An unexpected error occurred during signup",
    };
  }
}

export async function SignInMutation({ email, password }: SignInSchemaType) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error during sign in:", error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function SignOutUser() {
  try {
    await supabase.auth.signOut();
    clearStoredSession();
    return { success: true };
  } catch (error) {
    console.error("Error during sign out:", error);
    return { success: false, error };
  }
}

// Get current session from Supabase with token refresh
export async function getCurrentSession(): Promise<SessionData> {
  try {
    // Try to refresh the session first
    const { data: refreshData } = await supabase.auth.refreshSession();
    const currentSession = refreshData.session;

    // If we have a session, store it with expiry time
    if (currentSession) {
      const sessionData: SessionData = {
        session: currentSession,
        user: currentSession.user,
        expires_at: Date.now() + SESSION_TIMEOUT,
      };
      
      // Store session data in localStorage
      storeSession(sessionData);
      return sessionData;
    }

    // If refresh failed, try getting the existing session
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const sessionData: SessionData = {
        session: data.session,
        user: data.session.user,
        expires_at: Date.now() + SESSION_TIMEOUT,
      };
      
      storeSession(sessionData);
      return sessionData;
    }

    // No valid session found
    clearStoredSession();
    return { session: null, user: null };
  } catch (error) {
    console.error("Error getting current session:", error);
    return { session: null, user: null };
  }
}

// Store session data in localStorage with expiration
export function storeSession(sessionData: SessionData): void {
  if (!sessionData.session) {
    clearStoredSession();
    return;
  }

  // Add expiration time if not present
  if (!sessionData.expires_at) {
    sessionData.expires_at = Date.now() + SESSION_TIMEOUT;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
}

// Get session from localStorage
export function getStoredSession(): SessionData | null {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSession) return null;

    const sessionData: SessionData = JSON.parse(storedSession);
    
    // Check if session is expired
    if (sessionData.expires_at && sessionData.expires_at < Date.now()) {
      clearStoredSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    clearStoredSession();
    return null;
  }
}

// Clear session from localStorage
export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function UpdateUserProfileMutation({
  display_name,
}: {
  display_name: string;
}) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      display_name,
      full_name: display_name,
    },
  });

  if (error) {
    console.error("Error updating user profile:", error.message);
    throw new Error(error.message);
  }

  return data;
}
