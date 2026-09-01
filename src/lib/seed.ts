import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { mockUsers, mockBusinesses, mockListings, mockInvestments, mockProposals, mockBusinessUpdates } from "@/data/msme";

const DEMO_PASSWORD = "password123";
const SEED_VERSION = "v11-with-auth";

/**
 * Creates a Firebase Auth account via REST API.
 * Using REST API instead of SDK so onAuthStateChanged is NOT triggered,
 * which previously caused app crashes during seeding.
 */
const createAuthAccount = async (email: string, password: string): Promise<void> => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    });
    const data = await res.json();
    if (data.error) {
      if (data.error.message === "EMAIL_EXISTS") {
        // Account already exists — that's fine
      } else {
        console.warn(`Auth account warning for ${email}:`, data.error.message);
      }
    } else {
      console.log(`Created Auth account: ${email}`);
    }
  } catch (err) {
    console.warn(`Could not create auth account for ${email}:`, err);
  }
};

/**
 * Seeds Firestore + Firebase Auth accounts.
 * Uses REST API for auth so no onAuthStateChanged is triggered.
 */
export const seedDatabaseOnce = async (force = false) => {
  try {
    const seeded = localStorage.getItem("equityFlow_seedVersion");
    if (seeded === SEED_VERSION && !force) return;

    // Check if Firestore already has data
    if (!force) {
      const checkDoc = await getDoc(doc(db, "businesses", "biz-1"));
      if (checkDoc.exists()) {
        console.log("Firestore already populated. Creating Auth accounts only if missing...");
        // Still ensure Auth accounts exist even if Firestore is already seeded
        const adminUser = { email: "admin@equityflow.com" };
        for (const user of [...mockUsers, adminUser]) {
          await createAuthAccount(user.email, DEMO_PASSWORD);
        }
        localStorage.setItem("equityFlow_seedVersion", SEED_VERSION);
        return;
      }
    }

    console.log("Starting full Firestore seeding...");

    const adminUser = {
      id: "user-admin",
      name: "Platform Admin",
      email: "admin@equityflow.com",
      role: "admin",
      createdAt: new Date().toISOString(),
      kycVerified: true,
    };

    // 1. Seed Firestore + create Auth accounts in parallel per user
    for (const user of [...mockUsers, adminUser]) {
      await setDoc(doc(db, "users", user.id), user);
      await createAuthAccount(user.email, DEMO_PASSWORD);
    }
    console.log(`Seeded ${mockUsers.length + 1} users with Auth accounts`);

    for (const business of mockBusinesses) {
      await setDoc(doc(db, "businesses", business.id), business);
    }
    console.log(`Seeded ${mockBusinesses.length} businesses`);

    for (const listing of mockListings) {
      await setDoc(doc(db, "listings", listing.id), listing);
    }
    console.log(`Seeded ${mockListings.length} listings`);

    for (const investment of mockInvestments) {
      await setDoc(doc(db, "investments", investment.id), investment);
    }
    console.log(`Seeded ${mockInvestments.length} investments`);

    for (const proposal of mockProposals) {
      await setDoc(doc(db, "proposals", proposal.id), proposal);
    }
    console.log(`Seeded ${mockProposals.length} proposals`);

    for (const update of mockBusinessUpdates) {
      await setDoc(doc(db, "businessUpdates", update.id), update);
    }
    console.log(`Seeded ${mockBusinessUpdates.length} business updates`);

    localStorage.setItem("equityFlow_seedVersion", SEED_VERSION);
    console.log("Seeding Complete! Firestore + Auth accounts ready.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};