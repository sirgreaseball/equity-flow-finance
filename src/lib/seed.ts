import { 
  doc, 
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { mockUsers, mockBusinesses, mockListings, mockInvestments, mockProposals, mockBusinessUpdates } from "@/data/msme";

/**
 * Seeds Firestore directly - no Firebase Auth calls.
 * Auth sign-ins during seeding trigger onAuthStateChanged and crash the app.
 */
export const seedDatabaseOnce = async (force = false) => {
  try {
    const SEED_VERSION = "v10-direct-seed";
    const seeded = localStorage.getItem("equityFlow_seedVersion");
    if (seeded === SEED_VERSION && !force) return;

    // If Firestore already has data and we are not forcing, skip
    if (!force) {
      const checkDoc = await getDoc(doc(db, "businesses", "biz-1"));
      if (checkDoc.exists()) {
        console.log("Firestore already populated. Skipping seed.");
        localStorage.setItem("equityFlow_seedVersion", SEED_VERSION);
        return;
      }
    }

    console.log("Starting Firestore seeding...");

    const adminUser = { id: "user-admin", name: "Platform Admin", email: "admin@equityflow.com", role: "admin", createdAt: new Date().toISOString(), kycVerified: true };

    for (const user of [...mockUsers, adminUser]) {
      await setDoc(doc(db, "users", user.id), user);
    }
    console.log(`Seeded ${mockUsers.length + 1} users`);

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
    console.log("Firebase Seeding Complete!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
};