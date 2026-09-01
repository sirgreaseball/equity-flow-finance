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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // --- Demo Account Sync Logic ---
          const demoEmails = ['j.mercer@firstcapitalgroup.io', 'dhruvsonar@gmail.com', 'sarah.johnson@techcorpsolutions.com'];
          if (firebaseUser.email && demoEmails.includes(firebaseUser.email)) {
            console.log(`Demo user detected: ${firebaseUser.email}. Syncing data...`);
            
            // 1. Check if the user document with THIS UID exists
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
              // Find the "old" document by email and update its ID
              const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
              const querySnap = await getDocs(q);
              
              if (!querySnap.empty) {
                const oldDoc = querySnap.docs[0];
                const userData = oldDoc.data() as User;
                const oldId = oldDoc.id;
                
                if (oldId !== firebaseUser.uid) {
                  console.log(`Found legacy data for ${firebaseUser.email}. Transitioning ID from ${oldId} to ${firebaseUser.uid}`);
                  const batch = writeBatch(db);
                  batch.set(doc(db, "users", firebaseUser.uid), { ...userData, id: firebaseUser.uid });
                  
                  const bQ = query(collection(db, "businesses"), where("ownerId", "==", oldId));
                  const bSnap = await getDocs(bQ);
                  bSnap.forEach((d) => { batch.update(d.ref, { ownerId: firebaseUser.uid }); });
                  
                  const iQ = query(collection(db, "investments"), where("userId", "==", oldId));
                  const iSnap = await getDocs(iQ);
                  iSnap.forEach((d) => { batch.update(d.ref, { userId: firebaseUser.uid }); });

                  await batch.commit();
                  console.log("Demo Sync Complete!");
                }
              }
            }
          }

          // Fetch user metadata from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'investor',
              createdAt: new Date().toISOString()
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setUser(null);
      } finally {
        // Always unblock the UI — no matter what happened above
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
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
      // Wait for onAuthStateChanged to fully resolve (including Firestore fetch)
      // before reporting success so the navigation in Auth.tsx is safe
      await new Promise<void>((resolve) => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            unsub();
            resolve();
          }
        });
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
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