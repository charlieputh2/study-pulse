import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  fullName?: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string; user?: any }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage first
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser({
          id: user.id || user.email,
          email: user.email,
          full_name: user.fullName || user.full_name || '',
          phone: user.phone || '',
          avatar_url: user.photo || user.avatar_url || '',
          fullName: user.fullName,
          photo: user.photo
        });
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('studyPulseUser');
      }
    }

    // Get initial session from Supabase
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', session.user.email!)
            .single();

          const userData = {
            id: session.user.id,
            email: session.user.email!,
            full_name: profile?.first_name || '',
            phone: profile?.phone || '',
            avatar_url: profile?.avatar_url || '',
            fullName: profile?.first_name || ''
          };
          
          setUser(userData);
          localStorage.setItem('studyPulseUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', session.user.email!)
            .single();

          const userData = {
            id: session.user.id,
            email: session.user.email!,
            full_name: profile?.first_name || '',
            phone: profile?.phone || '',
            avatar_url: profile?.avatar_url || '',
            fullName: profile?.first_name || ''
          };
          
          setUser(userData);
          localStorage.setItem('studyPulseUser', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('studyPulseUser');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Try backend API first
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Store user in localStorage for compatibility
            localStorage.setItem('studyPulseUser', JSON.stringify(data.user));
            
            setUser({
              id: data.user.id || data.user.email,
              email: data.user.email,
              full_name: data.user.fullName || data.user.full_name || '',
              phone: data.user.phone || '',
              avatar_url: data.user.photo || data.user.avatar_url || '',
              fullName: data.user.fullName,
              photo: data.user.photo
            });
            
            return { success: true, user: data.user };
          }
        }
      } catch (apiError) {
        console.log('API login failed, trying Supabase:', apiError);
      }

      // Fallback to Supabase auth
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If error is about email confirmation, try to bypass it
        if (error.message.includes('Email not confirmed')) {
          // Try to get the user and auto-confirm them
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            await supabase.auth.updateUser({
              data: { email_confirmed: true }
            });
            // Retry login
            const retryResult = await supabase.auth.signInWithPassword({ email, password });
            if (!retryResult.error && retryResult.data.user) {
              data = retryResult.data;
              error = null;
            }
          }
        }
        
        if (error) {
          return { success: false, error: error.message };
        }
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', data.user.email!)
          .single();

        const userData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: profile?.first_name || '',
          phone: profile?.phone || '',
          avatar_url: profile?.avatar_url || '',
          fullName: profile?.first_name || ''
        };
        
        // Store in localStorage for compatibility
        localStorage.setItem('studyPulseUser', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      setLoading(true);
      
      // Try backend API first
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            fullName,
            phone,
            confirmPassword: password,
            acceptTerms: 'true'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Store user in localStorage for compatibility
            localStorage.setItem('studyPulseUser', JSON.stringify(data.user));
            
            setUser({
              id: data.user.id || data.user.email,
              email: data.user.email,
              full_name: data.user.fullName || data.user.full_name || '',
              phone: data.user.phone || '',
              avatar_url: data.user.photo || data.user.avatar_url || '',
              fullName: data.user.fullName,
              photo: data.user.photo
            });
            
            return { success: true, user: data.user };
          }
        }
      } catch (apiError) {
        console.log('API registration failed, trying Supabase:', apiError);
      }

      // Fallback to Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: fullName,
            phone: phone || ''
          }
        }
      });

      // Auto-confirm the user to bypass email verification
      if (data.user && !error) {
        await supabase.auth.updateUser({
          data: { 
            email_confirmed: true,
            full_name: fullName,
            phone: phone || ''
          }
        });
      }

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            email: email,
            username: email.split('@')[0],
            first_name: fullName,
            phone: phone || '',
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Auto-confirm and sign in the user immediately to bypass email confirmation
        try {
          // First try to update user to confirm email
          await supabase.auth.updateUser({
            data: { email_confirmed: true }
          });
          
          // Then sign in immediately
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (!signInError && signInData.user) {
            // Use the signed-in user data
            const userData = {
              id: signInData.user.id,
              email: signInData.user.email!,
              full_name: fullName,
              phone: phone || '',
              avatar_url: '',
              fullName: fullName
            };
            
            // Store in localStorage for compatibility
            localStorage.setItem('studyPulseUser', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, user: userData };
          }
        } catch (confirmError) {
          console.warn('Auto-confirmation failed, but registration succeeded:', confirmError);
        }

        const userData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          phone: phone || '',
          avatar_url: '',
          fullName: fullName
        };
        
        // Store in localStorage for compatibility
        localStorage.setItem('studyPulseUser', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('studyPulseUser');
      
      // Try backend logout
      try {
        await fetch('/api/users/logout', {
          method: 'POST',
        });
      } catch (apiError) {
        console.log('API logout failed, trying Supabase:', apiError);
      }
      
      // Supabase logout
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updates.full_name,
          phone: updates.phone,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('email', user.email);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      setUser({ ...user, ...updates });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
