import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  collection,
  addDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { UserAccount, PlanType, Ebook } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function isDatabaseClosingError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = ((error as any)?.code || '').toLowerCase();
  return (
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    code === 'deadline-exceeded' ||
    msg.includes('unavailable') ||
    msg.includes('could not reach') ||
    msg.includes('connection failed') ||
    msg.includes('the operation could not be completed') ||
    msg.includes('database is closing') ||
    msg.includes('database is closed') ||
    msg.includes('connection is closing') ||
    msg.includes('the client is offline') ||
    msg.includes('offline') ||
    msg.includes('network') ||
    (msg.includes('indexeddb') && msg.includes('closing'))
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  if (isDatabaseClosingError(error)) {
    console.info('Firestore offline/sync status:', JSON.stringify(errInfo));
    return;
  }
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

export function getPlanLimits(plan: PlanType) {
  switch (plan) {
    case 'pro_annual':
    case 'pro_plus':
    case 'premium':
      return {
        monthlyLimit: 20,
        maxPagesPerEbook: 18,
        durationDays: 365,
        name: 'Pro+ Anual',
        price: 97.00,
        priceFormatted: 'R$ 97,00',
        periodFormatted: '/ ano',
        monthlyEquivalent: 'R$ 8,08/mês',
      };
    case 'pro':
      return {
        monthlyLimit: 10,
        maxPagesPerEbook: 18,
        durationDays: 30,
        name: 'Plano Pro',
        price: 49.90,
        priceFormatted: 'R$ 49,90',
        periodFormatted: '/ mês',
        monthlyEquivalent: 'R$ 49,90/mês',
      };
    case 'basico':
      return {
        monthlyLimit: 3,
        maxPagesPerEbook: 12,
        durationDays: 30,
        name: 'Plano Básico',
        price: 19.90,
        priceFormatted: 'R$ 19,90',
        periodFormatted: '/ mês',
        monthlyEquivalent: 'R$ 19,90/mês',
      };
    case 'gratis':
    default:
      return {
        monthlyLimit: 0,
        maxPagesPerEbook: 0,
        durationDays: 0,
        name: 'Sem Plano Ativo',
        price: 0,
        priceFormatted: 'R$ 0,00',
        periodFormatted: '',
        monthlyEquivalent: 'Sem acesso',
      };
  }
}

export function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields) as unknown as T;
  }
  const cleanObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanObj[key] = removeUndefinedFields(value);
    }
  }
  return cleanObj as T;
}

// Calculate dates for 30-day monthly renewal cycle and total plan expiration (30 days or 365 days)
export function calculateSubscriptionCycle(
  plan: PlanType,
  subscriptionDateStr?: string,
  monthResetDateStr?: string
) {
  const limits = getPlanLimits(plan);
  const now = new Date();
  const subDate = subscriptionDateStr ? new Date(subscriptionDateStr) : new Date();
  const durationMs = limits.durationDays * 24 * 60 * 60 * 1000;
  const planExpiryDate = new Date(subDate.getTime() + durationMs);

  let resetDate = monthResetDateStr ? new Date(monthResetDateStr) : new Date(subDate);
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  let shouldResetMonthlyCount = false;
  // If 30 days have elapsed since the last monthly reset, trigger a fresh 20/10/3 ebook limit cycle
  if (now.getTime() - resetDate.getTime() >= thirtyDaysMs) {
    shouldResetMonthlyCount = true;
    resetDate = new Date();
  }

  const nextMonthlyResetDate = new Date(resetDate.getTime() + thirtyDaysMs);
  const isExpired = limits.durationDays > 0 ? now.getTime() > planExpiryDate.getTime() : false;

  return {
    subDateISO: subDate.toISOString(),
    planExpiryISO: planExpiryDate.toISOString(),
    resetDateISO: resetDate.toISOString(),
    nextMonthlyResetISO: nextMonthlyResetDate.toISOString(),
    shouldResetMonthlyCount,
    isExpired,
  };
}

// Ensure or create user document in Firestore
export async function syncUserProfile(user: FirebaseUser): Promise<UserAccount> {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const nowIso = new Date().toISOString();

      const newUserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Criador Digital',
        plan: 'gratis' as PlanType,
        hasActiveSubscription: false,
        ebooksCountThisMonth: 0,
        subscriptionDate: nowIso,
        monthResetDate: nowIso,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      await setDoc(userRef, newUserProfile);

      return {
        id: user.uid,
        name: newUserProfile.displayName,
        email: newUserProfile.email,
        plan: 'gratis',
        ebooksCreatedCount: 0,
        monthlyLimit: 0,
        maxPagesPerEbook: 0,
        subscriptionDate: nowIso,
        isLoggedIn: true,
        hasActiveSubscription: false,
      };
    }

    const data = snap.data();
    const rawPlan: PlanType = (data.plan as PlanType) || 'gratis';
    
    // Determine active subscription status (support explicit boolean or infer if missing)
    const hasActiveSub =
      data.hasActiveSubscription !== undefined
        ? Boolean(data.hasActiveSubscription) && rawPlan !== 'gratis'
        : rawPlan !== 'gratis';

    // Auto-backfill hasActiveSubscription in Firestore if it was missing in the document
    if (data.hasActiveSubscription === undefined) {
      try {
        await setDoc(userRef, { hasActiveSubscription: hasActiveSub }, { merge: true });
      } catch (e) {
        console.warn('Could not backfill hasActiveSubscription in Firestore:', e);
      }
    }

    const plan: PlanType = hasActiveSub ? rawPlan : 'gratis';
    const limits = getPlanLimits(plan);

    const subDate = data.subscriptionDate || data.createdAt || new Date().toISOString();
    const monthResetDate = data.monthResetDate || subDate;
    const cycle = calculateSubscriptionCycle(plan, subDate, monthResetDate);

    let ebooksCount = Number(data.ebooksCountThisMonth || 0);

    // If 30-day renewal cycle reached, reset count in Firestore
    if (cycle.shouldResetMonthlyCount && hasActiveSub) {
      ebooksCount = 0;
      try {
        await setDoc(
          userRef,
          {
            ebooksCountThisMonth: 0,
            hasActiveSubscription: true,
            monthResetDate: cycle.resetDateISO,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Could not persist monthly reset to Firestore:', e);
      }
    }

    const isSubscriptionActive = hasActiveSub && !cycle.isExpired;

    return {
      id: user.uid,
      name: data.displayName || user.displayName || 'Criador Digital',
      email: data.email || user.email || '',
      plan: isSubscriptionActive ? plan : 'gratis',
      ebooksCreatedCount: ebooksCount,
      monthlyLimit: isSubscriptionActive ? limits.monthlyLimit : 0,
      maxPagesPerEbook: isSubscriptionActive ? limits.maxPagesPerEbook : 0,
      subscriptionDate: subDate,
      planExpiryDate: cycle.planExpiryISO,
      lastResetDate: cycle.resetDateISO,
      nextMonthlyResetDate: cycle.nextMonthlyResetISO,
      isLoggedIn: true,
      hasActiveSubscription: isSubscriptionActive,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
    const nowIso = new Date().toISOString();
    return {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Criador Digital',
      email: user.email || '',
      plan: 'gratis',
      ebooksCreatedCount: 0,
      monthlyLimit: 0,
      maxPagesPerEbook: 0,
      subscriptionDate: nowIso,
      isLoggedIn: true,
      hasActiveSubscription: false,
    };
  }
}

// Log lightweight ebook metadata without storing heavy content in Firestore
export async function logEbookMetadata(
  uid: string,
  ebookMeta: {
    id: string;
    title: string;
    genre: string;
    pageCount: number;
    language: string;
    template: string;
  }
) {
  const currentUid = auth.currentUser?.uid || uid;
  if (!auth.currentUser || currentUid.startsWith('user-')) {
    console.warn('Ebook metadata skip Firestore log: User not authenticated in Firebase Auth');
    return;
  }

  const userPath = `users/${currentUid}`;
  const metaPath = `users/${currentUid}/ebooks_meta/${ebookMeta.id}`;
  try {
    const userRef = doc(db, 'users', currentUid);

    // Update or merge count on user doc
    await setDoc(
      userRef,
      {
        ebooksCountThisMonth: increment(1),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Save lightweight metadata log
    const metaRef = doc(db, 'users', currentUid, 'ebooks_meta', ebookMeta.id);
    await setDoc(metaRef, {
      ...ebookMeta,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao registrar metadados do e-book:', err);
  }
}

// Activate plan for user in Firestore
export async function activatePlanInFirestore(uid: string, planId: PlanType) {
  const currentUid = auth.currentUser?.uid || uid;
  if (!auth.currentUser || currentUid.startsWith('user-')) {
    console.warn('Plan activation skip Firestore write: User not authenticated in Firebase Auth');
    return true;
  }

  const userPath = `users/${currentUid}`;
  try {
    const userRef = doc(db, 'users', currentUid);
    const nowIso = new Date().toISOString();
    const cycle = calculateSubscriptionCycle(planId, nowIso, nowIso);

    await setDoc(
      userRef,
      {
        plan: planId,
        hasActiveSubscription: true,
        ebooksCountThisMonth: 0,
        subscriptionDate: cycle.subDateISO,
        monthResetDate: cycle.resetDateISO,
        planExpiryDate: cycle.planExpiryISO,
        updatedAt: nowIso,
      },
      { merge: true }
    );

    // Record payment log
    await addDoc(collection(db, 'payments'), {
      userId: currentUid,
      planId,
      status: 'approved',
      planExpiryDate: cycle.planExpiryISO,
      createdAt: nowIso,
    });

    return true;
  } catch (err) {
    console.error('Erro ao ativar plano no Firestore:', err);
    return false;
  }
}

// Save full Ebook document to Firestore
export async function saveEbookToFirestore(uid: string, ebook: Ebook) {
  const currentUid = auth.currentUser?.uid || uid;
  if (!auth.currentUser || currentUid.startsWith('user-')) {
    console.warn('Save ebook skip Firestore write: User not authenticated in Firebase Auth');
    return;
  }

  const ebookPath = `users/${currentUid}/ebooks/${ebook.id}`;
  try {
    const ebookRef = doc(db, 'users', currentUid, 'ebooks', ebook.id);
    
    // In Firestore, nested arrays (like pages containing blocks with lists/tables) are forbidden.
    // We safely serialize the pages array as JSON string.
    const { pages, ...restEbook } = ebook;
    const payload = removeUndefinedFields({
      ...restEbook,
      pagesJson: JSON.stringify(pages || []),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(ebookRef, payload, { merge: true });

    // Also sync metadata
    const metaPayload = removeUndefinedFields({
      id: ebook.id,
      title: ebook.title,
      genre: ebook.genre || 'Geral',
      pageCount: ebook.pages?.length || 0,
      language: ebook.language || 'Português',
      template: ebook.template || 'editorial',
      updatedAt: new Date().toISOString(),
      createdAt: ebook.createdAt || new Date().toISOString(),
    });

    const metaRef = doc(db, 'users', currentUid, 'ebooks_meta', ebook.id);
    await setDoc(metaRef, metaPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, ebookPath);
  }
}

// Fetch all saved Ebooks for a user from Firestore
export async function fetchUserEbooksFromFirestore(uid: string): Promise<Ebook[]> {
  const currentUid = auth.currentUser?.uid || uid;
  if (!auth.currentUser || currentUid.startsWith('user-')) {
    return [];
  }

  const path = `users/${currentUid}/ebooks`;
  try {
    const colRef = collection(db, 'users', currentUid, 'ebooks');
    const snap = await getDocs(colRef);
    const ebooks: Ebook[] = [];
    snap.forEach((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        if (data && data.id && data.title) {
          let pages = [];
          if (typeof data.pagesJson === 'string') {
            try {
              pages = JSON.parse(data.pagesJson);
            } catch (e) {
              console.warn('Erro ao deserializar páginas do Firestore:', e);
              pages = [];
            }
          } else if (Array.isArray(data.pages)) {
            pages = data.pages;
          }

          ebooks.push({
            ...data,
            pages,
          } as Ebook);
        }
      }
    });

    // Sort newest first
    ebooks.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return ebooks;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

// Delete Ebook document from Firestore
export async function deleteEbookFromFirestore(uid: string, ebookId: string) {
  const currentUid = auth.currentUser?.uid || uid;
  if (!auth.currentUser || currentUid.startsWith('user-')) {
    return;
  }

  const ebookPath = `users/${currentUid}/ebooks/${ebookId}`;
  try {
    const ebookRef = doc(db, 'users', currentUid, 'ebooks', ebookId);
    await deleteDoc(ebookRef);

    const metaRef = doc(db, 'users', currentUid, 'ebooks_meta', ebookId);
    await deleteDoc(metaRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, ebookPath);
  }
}

