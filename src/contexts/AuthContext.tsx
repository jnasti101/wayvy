import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, loading: false }));
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({ ...prev, session, loading: false }));
        
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({ ...prev, user: null }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setState(prev => ({
          ...prev,
          user: {
            ...data,
            email: state.session?.user?.email,
          },
        }));
      } else {
        // Create profile if it doesn't exist
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId }]);

        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          setState(prev => ({
            ...prev,
            user: {
              id: userId,
              email: state.session?.user?.email,
            },
          }));
        }
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      toast({
        title: 'Account created',
        description: 'Please check your email to verify your account',
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!state.user?.id) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', state.user.id);

    if (!error) {
      setState(prev => ({
        ...prev,
        user: { ...prev.user, ...data } as UserProfile,
      }));

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    }

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
