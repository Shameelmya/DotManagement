import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Helper for typed collections
const createCollection = <T = any>(collectionName: string) => {
  return collection(db, collectionName);
};

export const Collections = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  STAFF: 'staff',
  USERS: 'users',
  FINANCE: 'finance',
  COURSES: 'courses',
  BATCHES: 'batches',
  STUDENTS: 'students'
};

// Generic CRUD operations
export const dbService = {
  // Get all documents (once)
  async getAll(collectionName: string) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get a single document
  async getOne(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  // Create a new document with an auto-generated ID
  async create(collectionName: string, data: any) {
    const newRef = doc(collection(db, collectionName));
    await setDoc(newRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return newRef.id;
  },

  // Create or overwrite a document with a specific ID
  async set(collectionName: string, id: string, data: any) {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return id;
  },

  // Update specific fields
  async update(collectionName: string, id: string, data: any) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Delete a document
  async delete(collectionName: string, id: string) {
    await deleteDoc(doc(db, collectionName, id));
  },
  
  // Subscription helper for real-time updates
  subscribe(collectionName: string, callback: (data: any[]) => void) {
    const q = query(collection(db, collectionName)); // Add orderBy('createdAt', 'desc') if indexed
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};
