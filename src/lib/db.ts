import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  increment
} from "firebase/firestore";
import { db } from "./firebase";
import { Business, Listing, Investment } from "@/data/msme";

// --- Users ---
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getAllUsers = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Businesses ---
export const getAllBusinesses = async (): Promise<Business[]> => {
  const querySnapshot = await getDocs(collection(db, "businesses"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
};

export const getBusiness = async (businessId: string): Promise<Business | null> => {
  const docRef = doc(db, "businesses", businessId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Business) : null;
};

export const getBusinessesByOwnerId = async (ownerId: string): Promise<Business[]> => {
  const q = query(collection(db, "businesses"), where("ownerId", "==", ownerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
};

export const createBusiness = async (businessData: Omit<Business, 'id'>) => {
  const docRef = await addDoc(collection(db, "businesses"), {
    ...businessData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// --- Listings ---
export const getAllListings = async (): Promise<Listing[]> => {
  // Simple query — no composite index needed. Sort client-side.
  const q = query(collection(db, "listings"), where("isActive", "==", true));
  const querySnapshot = await getDocs(q);
  const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
  // Sort newest first client-side
  return listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getListing = async (listingId: string): Promise<Listing | null> => {
  const docRef = doc(db, "listings", listingId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Listing) : null;
};

export const getListingsByBusinessId = async (businessId: string): Promise<Listing[]> => {
  const q = query(collection(db, "listings"), where("businessId", "==", businessId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
};

export const createListing = async (listingData: Omit<Listing, 'id'>) => {
  const docRef = await addDoc(collection(db, "listings"), {
    ...listingData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// --- Investments ---
export const getUserInvestments = async (userId: string): Promise<Investment[]> => {
  // Simple query — no composite index needed. Sort client-side.
  const q = query(collection(db, "investments"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const investments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
  return investments.sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime());
};

export const getAllInvestments = async (): Promise<Investment[]> => {
  const querySnapshot = await getDocs(collection(db, "investments"));
  const investments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
  return investments.sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime());
};

export const createInvestment = async (investmentData: Omit<Investment, 'id'>) => {
  // 1. Create the investment record
  const invRef = await addDoc(collection(db, "investments"), {
    ...investmentData,
    investedAt: new Date().toISOString()
  });

  // 2. Update the listing's amountRaised and investorsCount
  const listingRef = doc(db, "listings", investmentData.listingId);
  await updateDoc(listingRef, {
    amountRaised: increment(investmentData.amount),
    investorsCount: increment(1)
  });

  return invRef.id;
};

// --- Governance ---
import { Proposal, BusinessUpdate, Vote } from "@/data/msme";

export const getProposalsByBusinessId = async (businessId: string): Promise<Proposal[]> => {
  const q = query(collection(db, "proposals"), where("businessId", "==", businessId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Proposal));
};

export const getBusinessUpdates = async (businessId: string): Promise<BusinessUpdate[]> => {
  const q = query(collection(db, "businessUpdates"), where("businessId", "==", businessId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusinessUpdate));
};

// --- Votes (stored in Firebase, not localStorage) ---
export const getVotesForProposal = async (proposalId: string): Promise<Vote[]> => {
  const q = query(collection(db, "votes"), where("proposalId", "==", proposalId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vote));
};

export const castVote = async (voteData: Omit<Vote, 'id' | 'votedAt'>): Promise<string> => {
  // Prevent double voting — check Firebase first
  const existingQ = query(
    collection(db, "votes"),
    where("proposalId", "==", voteData.proposalId),
    where("userId", "==", voteData.userId)
  );
  const existingSnap = await getDocs(existingQ);
  if (!existingSnap.empty) {
    throw new Error("You have already voted on this proposal.");
  }

  const newVote: Vote = {
    ...voteData,
    id: `vote-${Math.random().toString(36).substring(7)}`,
    votedAt: new Date().toISOString()
  };

  await setDoc(doc(db, "votes", newVote.id), newVote);
  return newVote.id;
};

// --- Seeding Utility (One-time use) ---
export const seedMockData = async (users: any[], businesses: any[], listings: any[]) => {
  // Simple seed for a fresh Firebase project
  for (const u of users) {
    await setDoc(doc(db, "users", u.id), u);
  }
  for (const b of businesses) {
    await setDoc(doc(db, "businesses", b.id), b);
  }
  for (const l of listings) {
    await setDoc(doc(db, "listings", l.id), l);
  }
};
