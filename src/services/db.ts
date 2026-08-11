import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, serverTimestamp, CollectionReference, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Project, Task, Course, Batch, Student, FinanceTransaction } from '../types';

// Helper for typed collections
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
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

export const typedCollections = {
  projects: createCollection<Project>(Collections.PROJECTS),
  tasks: createCollection<Task>(Collections.TASKS),
  staff: createCollection<User>(Collections.STAFF),
  users: createCollection<User>(Collections.USERS),
  finance: createCollection<FinanceTransaction>(Collections.FINANCE),
  courses: createCollection<Course>(Collections.COURSES),
  batches: createCollection<Batch>(Collections.BATCHES),
  students: createCollection<Student>(Collections.STUDENTS),
};

// Generic CRUD operations
export const dbService = {
  // Get all documents (once)
  async getAll<T = any>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
  },

  // Get a single document
  async getOne<T = any>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as unknown as T;
    }
    return null;
  },

  // Create a new document with an auto-generated ID
  async create<T = any>(collectionName: string, data: Partial<T>): Promise<string> {
    const newRef = doc(collection(db, collectionName));
    await setDoc(newRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return newRef.id;
  },

  // Create or overwrite a document with a specific ID
  async set<T = any>(collectionName: string, id: string, data: Partial<T>): Promise<string> {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return id;
  },

  // Update specific fields
  async update<T = any>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Delete a document
  async delete(collectionName: string, id: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, id));
  },
  
  // Subscription helper for real-time updates
  subscribe<T = any>(collectionName: string, callback: (data: T[]) => void) {
    const q = query(collection(db, collectionName)); // Add orderBy('createdAt', 'desc') if indexed
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
      callback(data);
    });
  }
};
