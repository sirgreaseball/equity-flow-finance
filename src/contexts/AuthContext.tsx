import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/data/msme';
import { nanoid } from 'nanoid';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt'> & { password: string; businessName?: string; category?: string; location?: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnectingWallet: boolean;
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
  const cachedUser = (() => {
    try {
      const saved = localStorage.getItem('equityFlow_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const [user, setUser] = useState<User | null>(cachedUser);
  const [walletAddress, setWalletAddress] = useState<string | null>(() => localStorage.getItem('equityFlow_wallet'));
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  // If we already have a cached user, don't block the UI
  const [isLoading, setIsLoading] = useState(!cachedUser);

  useEffect(() => {
    // Safety net: never block UI for more than 3 seconds
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      try {
        if (firebaseUser) {
          // Check if a Firestore doc already exists for this Firebase UID
          let userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));

          // If not found by UID, search by email (handles seeded users with string IDs)
          if (!userDocSnap.exists() && firebaseUser.email) {
            const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              const oldDoc = querySnap.docs[0];
              const oldId = oldDoc.id;

              if (oldId !== firebaseUser.uid) {
                console.log(`Migrating user ${firebaseUser.email} from ID ${oldId} → ${firebaseUser.uid}`);
                const userData = oldDoc.data() as User;
                const batch = writeBatch(db);

                // Create doc under real Firebase UID
                batch.set(doc(db, "users", firebaseUser.uid), { ...userData, id: firebaseUser.uid });

                // Update businesses owned by this user
                const bSnap = await getDocs(query(collection(db, "businesses"), where("ownerId", "==", oldId)));
                bSnap.forEach((d) => { batch.update(d.ref, { ownerId: firebaseUser.uid }); });

                // Update investments made by this user
                const iSnap = await getDocs(query(collection(db, "investments"), where("userId", "==", oldId)));
                iSnap.forEach((d) => { batch.update(d.ref, { userId: firebaseUser.uid }); });

                await batch.commit();
                console.log("User migration complete!");

                // Re-fetch the doc under new UID
                userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              }
            }
          }

          if (userDocSnap.exists()) {
            setUser(userDocSnap.data() as User);
          } else {
            // Brand new user — create a basic profile
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'investor',
              createdAt: new Date().toISOString(),
              kycVerified: false,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    if (walletAddress) localStorage.setItem('equityFlow_wallet', walletAddress);
    else localStorage.removeItem('equityFlow_wallet');
  }, [walletAddress]);

  // Persist user to localStorage so next page load is instant
  useEffect(() => {
    if (user) localStorage.setItem('equityFlow_user', JSON.stringify(user));
    else localStorage.removeItem('equityFlow_user');
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      // If user doesn't exist in Firebase Auth but DOES exist in Firestore (seeded user),
      // auto-create their Auth account so they can sign in with the provided password
      const isNotFound = error.code === 'auth/user-not-found' || 
                         error.code === 'auth/invalid-credential' ||
                         error.code === 'auth/invalid-email';
      
      if (isNotFound || error.code === 'auth/user-not-found') {
        try {
          // Check if this email exists in Firestore (seeded)
          const q = query(collection(db, "users"), where("email", "==", email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            // Create the Firebase Auth account and sign in
            console.log(`Creating Auth account for seeded user: ${email}`);
            await createUserWithEmailAndPassword(auth, email, password);
            return true;
          }
        } catch (createError: any) {
          // If account already exists with different password
          if (createError.code === 'auth/email-already-in-use') {
            console.error("Account exists but password is wrong");
          } else {
            console.error("Auto-create failed:", createError);
          }
        }
      }
      
      console.error("Login error:", error.code);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const { password, ...rest } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const newUser: User = {
        ...rest,
        id: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        kycVerified: true
      };
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setWalletAddress(null);
    localStorage.removeItem('equityFlow_user');
  };

  const connectWallet = async () => {
    setIsConnectingWallet(true);
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletAddress('0x71C5...9A34');
    setIsConnectingWallet(false);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading: isLoading,
    walletAddress,
    connectWallet,
    disconnectWallet,
    isConnectingWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};