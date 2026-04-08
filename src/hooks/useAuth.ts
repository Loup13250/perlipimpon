import { useState, useCallback, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await firebaseSignOut(auth);
  }, []);

  const changePassword = useCallback(
    async (_currentPassword: string, newPassword: string): Promise<boolean> => {
      if (!user) return false;
      try {
        await updatePassword(user, newPassword);
        return true;
      } catch (e) {
        console.error('Password change error', e);
        return false;
      }
    },
    [user]
  );

  return {
    isAuthenticated: !!user,
    authLoading,
    login,
    logout,
    changePassword,
  };
}
