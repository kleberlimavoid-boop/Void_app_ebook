import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  PlanType,
  EbookInput,
  Ebook,
} from './types';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import {
  syncUserProfile,
  logEbookMetadata,
  activatePlanInFirestore,
  saveEbookToFirestore,
  fetchUserEbooksFromFirestore,
  deleteEbookFromFirestore,
  getPlanLimits,
} from './lib/authService';
import { Header } from './components/Header';
import { PlanSelectionModal } from './components/PlanSelectionModal';
import { StepIndicator } from './components/StepIndicator';
import { Step1Info } from './components/Step1Info';
import { Step2Design } from './components/Step2Design';
import { Step3Generating } from './components/Step3Generating';
import { Step4Editor } from './components/Step4Editor';
import { Step5Export } from './components/Step5Export';
import { MyEbooksModal } from './components/MyEbooksModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { EbookPageCanvas } from './components/EbookPageCanvas';
import { generateAndDownloadPdf } from './utils/pdfExport';
import { LandingPage } from './components/LandingPage';
import { CheckoutFlow } from './components/CheckoutFlow';
import { HomeScreen } from './components/HomeScreen';

const DEFAULT_USER: UserAccount = {
  id: 'user-guest',
  name: 'Criador Digital',
  email: 'projeto.exodo.21@gmail.com',
  plan: 'gratis',
  ebooksCreatedCount: 0,
  monthlyLimit: 0,
  maxPagesPerEbook: 0,
  subscriptionDate: new Date().toISOString(),
  isLoggedIn: false,
  hasActiveSubscription: false,
};

// Helper functions for persistent multi-user database in localStorage
function getUsersDb(): Record<string, UserAccount> {
  try {
    const saved = localStorage.getItem('ebookia_users_db');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveUserToDb(userToSave: UserAccount) {
  if (!userToSave.email) return;
  const db = getUsersDb();
  db[userToSave.email.trim().toLowerCase()] = userToSave;
  localStorage.setItem('ebookia_users_db', JSON.stringify(db));
}

const DEFAULT_INPUT: EbookInput = {
  title: '',
  subtitle: '',
  author: 'Autor Especialista',
  genre: 'negocios',
  targetAudience: 'Iniciantes e Empreendedores',
  tone: 'profissional',
  description: '',
  pageCount: 8,
  template: 'editorial',
  fontHeading: 'Plus Jakarta Sans',
  fontBody: 'Inter',
  primaryColor: '#2563EB',
  accentColor: '#F59E0B',
  contentDepth: 'standard',
  language: 'Português',
};

export default function App() {
  // User account state
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('ebookia_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Saved E-books Library (isolated per active user)
  const [savedEbooks, setSavedEbooks] = useState<Ebook[]>([]);

  // Helper to get consistent storage key for user library
  const getUserKey = (u: UserAccount) => {
    if (u && u.email && u.email.trim()) {
      return u.email.trim().toLowerCase();
    }
    if (u && u.id) return u.id;
    return 'guest';
  };

  // Reload user-specific library whenever logged-in user changes
  useEffect(() => {
    let isSubscribed = true;
    const syncLibrary = async () => {
      if (user && user.isLoggedIn) {
        const uKey = getUserKey(user);
        const localKey = `ebookia_library_${uKey}`;
        let localEbooks: Ebook[] = [];

        try {
          const saved = localStorage.getItem(localKey);
          if (saved) {
            localEbooks = JSON.parse(saved);
          }
        } catch (e) {
          console.error('Erro ao ler biblioteca local:', e);
        }

        if (isSubscribed && localEbooks.length > 0) {
          setSavedEbooks(localEbooks);
        }

        if (user.id) {
          try {
            const remoteEbooks = await fetchUserEbooksFromFirestore(user.id);
            if (isSubscribed) {
              if (remoteEbooks && remoteEbooks.length > 0) {
                setSavedEbooks(remoteEbooks);
                localStorage.setItem(localKey, JSON.stringify(remoteEbooks));
              } else if (localEbooks.length > 0) {
                // Upload any local ebooks to Firestore
                localEbooks.forEach((eb) => {
                  saveEbookToFirestore(user.id, eb);
                });
              }
            }
          } catch (err) {
            console.error('Erro ao sincronizar e-books do Firestore:', err);
          }
        }
      } else {
        if (isSubscribed) setSavedEbooks([]);
      }
    };

    syncLibrary();
    return () => {
      isSubscribed = false;
    };
  }, [user.email, user.id, user.isLoggedIn]);

  // Persist library changes to active user's unique storage key
  useEffect(() => {
    if (user && user.isLoggedIn && savedEbooks) {
      const uKey = getUserKey(user);
      const key = `ebookia_library_${uKey}`;
      localStorage.setItem(key, JSON.stringify(savedEbooks));
    }
  }, [savedEbooks, user.email, user.id, user.isLoggedIn]);

  // App UI State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [inputData, setInputData] = useState<EbookInput>(DEFAULT_INPUT);
  const [currentEbook, setCurrentEbook] = useState<Ebook | null>(null);
  const [isReadOnlyEbook, setIsReadOnlyEbook] = useState<boolean>(false);

  // Automatically scroll window to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Modals
  const [showPlansModal, setShowPlansModal] = useState<boolean>(false);
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const syncedUser = await syncUserProfile(fbUser);
          setUser(syncedUser);
        } catch (err) {
          console.error("Erro ao sincronizar usuário do Firebase:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-detect Mercado Pago payment redirect return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment_status');
    const planParam = params.get('plan') as PlanType | null;

    if (
      paymentStatus === 'success' &&
      planParam &&
      ['basico', 'pro', 'pro_annual', 'pro_plus', 'premium'].includes(planParam)
    ) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleSelectPlan(planParam);
    }
  }, []);

  // Plan Selection Handler
  const handleSelectPlan = async (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    setUser((prev) => {
      const updated: UserAccount = {
        ...prev,
        plan,
        monthlyLimit: limits.monthlyLimit,
        maxPagesPerEbook: limits.maxPagesPerEbook,
        hasActiveSubscription: plan !== 'gratis',
      };
      return updated;
    });

    if (user.id) {
      await activatePlanInFirestore(user.id, plan);
    }

    // Adjust current page count if needed
    const maxAllowed = limits.maxPagesPerEbook || 12;
    if (inputData.pageCount > maxAllowed) {
      setInputData((prev) => ({ ...prev, pageCount: maxAllowed }));
    }

    setShowPlansModal(false);
  };

  // Start new ebook wizard
  const handleStartNewEbook = () => {
    if (!user.hasActiveSubscription || user.plan === 'gratis') {
      setShowPlansModal(true);
      return;
    }
    setInputData(DEFAULT_INPUT);
    setCurrentEbook(null);
    setIsReadOnlyEbook(false);
    setCurrentStep(1);
  };

  // Direct download state for library modal
  const [directDownloadEbook, setDirectDownloadEbook] = useState<Ebook | null>(null);

  // Auto-save function for newly generated or edited ebooks
  const autoSaveEbookToLibrary = (ebookToSave: Ebook) => {
    setSavedEbooks((prev) => {
      const exists = prev.some((e) => e.id === ebookToSave.id);
      if (exists) {
        return prev.map((e) => (e.id === ebookToSave.id ? ebookToSave : e));
      }
      return [ebookToSave, ...prev];
    });

    if (user && user.id) {
      saveEbookToFirestore(user.id, ebookToSave);
    }
  };

  // Direct PDF download from library modal
  const handleDirectDownloadPdf = async (ebookToDownload: Ebook) => {
    if (directDownloadEbook) return;
    setDirectDownloadEbook(ebookToDownload);
    // Allow offscreen DOM element to mount
    await new Promise((resolve) => setTimeout(resolve, 150));
    await generateAndDownloadPdf(ebookToDownload, 'direct-export-pdf-page-');
    setDirectDownloadEbook(null);
  };

  // Generate E-book API trigger
  const handleTriggerGenerate = async () => {
    // Check monthly limit
    if (user.ebooksCreatedCount >= user.monthlyLimit) {
      setShowPlansModal(true);
      alert(`Você atingiu o limite de ${user.monthlyLimit} e-books do seu plano este mês. Faça upgrade ou aguarde o ciclo de renovação para criar mais!`);
      return;
    }

    setCurrentStep(3); // Show generating screen

    try {
      const resolvedGenre =
        inputData.genre === 'outro' && inputData.customGenre?.trim()
          ? inputData.customGenre.trim()
          : inputData.genre;

      const res = await fetch('/api/generate-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inputData,
          genre: resolvedGenre,
          userPlan: user.plan,
        }),
      });

      const data = await res.json();

      if (data.success && data.ebook) {
        setCurrentEbook(data.ebook);
        autoSaveEbookToLibrary(data.ebook);

        // Keep generated ebook in session memory state for editing & PDF download
        // Log lightweight metadata to Firestore without consuming database storage quota or local cache
        if (user.id) {
          await logEbookMetadata(user.id, {
            id: data.ebook.id,
            title: data.ebook.title,
            genre: data.ebook.genre,
            pageCount: data.ebook.pages.length,
            language: data.ebook.language || 'Português',
            template: data.ebook.template,
          });
        }

        // Update user quota count
        setUser((prev) => ({
          ...prev,
          ebooksCreatedCount: prev.ebooksCreatedCount + 1,
        }));

        // Advance to Step 4 Editor
        setCurrentStep(4);
      } else {
        alert(data.error || 'Não foi possível gerar o e-book. Tente novamente.');
        setCurrentStep(2);
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocorreu um erro de conexão. Tente novamente.');
      setCurrentStep(2);
    }
  };

  // Update current ebook and auto-save edits
  const handleUpdateCurrentEbook = (updated: Ebook) => {
    setCurrentEbook(updated);
    autoSaveEbookToLibrary(updated);
  };

  // Manual save current ebook to library with feedback
  const handleSaveToLibrary = () => {
    if (!currentEbook) return;
    autoSaveEbookToLibrary(currentEbook);
    alert('E-book salvo na sua biblioteca com sucesso!');
  };

  // Delete ebook from library
  const handleDeleteFromLibrary = async (id: string) => {
    setSavedEbooks((prev) => prev.filter((e) => e.id !== id));
    if (user && user.id) {
      await deleteEbookFromFirestore(user.id, id);
    }
  };

  // Open saved ebook from library (opens in View/Download PDF mode with option to edit)
  const handleOpenSavedEbook = (ebook: Ebook) => {
    setCurrentEbook(ebook);
    setIsReadOnlyEbook(false);
    setCurrentStep(5); // Direct to Export/View step, but Step 4 editor is freely accessible
  };

  // Login handler
  const handleLoginSuccess = (acc: UserAccount | { name: string; email: string }) => {
    if ('isLoggedIn' in acc && acc.isLoggedIn) {
      setUser(acc as UserAccount);
      saveUserToDb(acc as UserAccount);
      localStorage.setItem('ebookia_user', JSON.stringify(acc));
      return;
    }

    const cleanEmail = (acc.email || '').trim().toLowerCase();
    const db = getUsersDb();

    if (cleanEmail && db[cleanEmail]) {
      // Existing user found in local DB! Restore their exact plan and active subscription
      const existing = db[cleanEmail];
      const restoredUser: UserAccount = {
        ...existing,
        name: acc.name || existing.name,
        isLoggedIn: true,
      };
      setUser(restoredUser);
      saveUserToDb(restoredUser);
      localStorage.setItem('ebookia_user', JSON.stringify(restoredUser));
    } else {
      // New user registration
      const newAcc: UserAccount = {
        id: ('id' in acc && acc.id) ? (acc as UserAccount).id : `user-${Date.now()}`,
        name: acc.name || cleanEmail.split('@')[0] || 'Criador Digital',
        email: cleanEmail,
        plan: ('plan' in acc && acc.plan) ? (acc as UserAccount).plan : 'basico',
        ebooksCreatedCount: 0,
        monthlyLimit: 3,
        maxPagesPerEbook: 12,
        subscriptionDate: new Date().toISOString(),
        isLoggedIn: true,
        hasActiveSubscription: false,
      };
      setUser(newAcc);
      saveUserToDb(newAcc);
      localStorage.setItem('ebookia_user', JSON.stringify(newAcc));
    }
  };

  // Payment success handler from CheckoutFlow
  const handlePaymentSuccess = (selectedPlan: PlanType) => {
    setUser((prev) => {
      const updated: UserAccount = {
        ...prev,
        plan: selectedPlan,
        monthlyLimit: selectedPlan === 'pro' ? 10 : 3,
        maxPagesPerEbook: selectedPlan === 'pro' ? 18 : 12,
        hasActiveSubscription: true,
      };
      saveUserToDb(updated);
      return updated;
    });
  };

  // User profile name update
  const handleUpdateUserName = (newName: string) => {
    setUser((prev) => {
      const updated = { ...prev, name: newName };
      saveUserToDb(updated);
      return updated;
    });
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao sair da conta:", err);
    }
    localStorage.removeItem('ebookia_user');
    setSavedEbooks([]);
    setCurrentEbook(null);
    setIsReadOnlyEbook(false);
    setUser(DEFAULT_USER);
  };

  const canNavigateToStep = (step: number) => {
    if (step === 0) return true; // Can always go back to Home Screen
    if (isReadOnlyEbook) {
      // When viewing an ebook from library, steps 1-4 cannot be clicked
      return step === 5;
    }
    // After step 3 AI generation (when in step 4 or 5), user cannot go back to step 1 or 2
    if (currentStep >= 4 || currentEbook !== null) {
      if (step === 1 || step === 2 || step === 3) return false;
      if (step === 4) return currentEbook !== null;
      if (step === 5) return currentEbook !== null;
    }
    if (step === 1 || step === 2) return true;
    if (step === 3 && currentStep === 3) return true;
    if (step === 4) return currentEbook !== null;
    if (step === 5) return currentEbook !== null;
    return false;
  };

  // 1. Unauthenticated view: Landing Page with Login/Signup
  if (!user.isLoggedIn) {
    return (
      <>
        <LandingPage onLoginSuccess={handleLoginSuccess} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // 2. Unpaid view: Mandatory Plan Selection & Fullscreen Checkout
  if (!user.hasActiveSubscription) {
    return <CheckoutFlow user={user} onPaymentSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Show HomeScreen when currentStep is 0 */}
      {currentStep === 0 ? (
        <HomeScreen
          user={user}
          ebooks={savedEbooks}
          onStartNewEbook={handleStartNewEbook}
          onOpenEbook={handleOpenSavedEbook}
          onDownloadPdfDirectly={handleDirectDownloadPdf}
          onDeleteEbook={handleDeleteFromLibrary}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenPlans={() => setShowPlansModal(true)}
        />
      ) : (
        <>
          {/* Top Header Navigation for Creation Steps */}
          <Header
            user={user}
            onOpenPlans={() => setShowPlansModal(true)}
            onOpenLibrary={() => setShowLibraryModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onNewEbook={handleStartNewEbook}
            onGoHome={() => setCurrentStep(0)}
            onOpenAuth={() => setShowAuthModal(true)}
          />

          {/* Step Progress Bar */}
          <StepIndicator
            currentStep={currentStep}
            onSetStep={(step) => setCurrentStep(step)}
            canNavigateToStep={canNavigateToStep}
          />

          {/* Main Container */}
          <main className="flex-1 pb-16">
            {currentStep === 1 && (
              <Step1Info
                input={inputData}
                onChange={(updated) => setInputData((prev) => ({ ...prev, ...updated }))}
                onNext={() => setCurrentStep(2)}
                user={user}
                onOpenPlans={() => setShowPlansModal(true)}
              />
            )}

            {currentStep === 2 && (
              <Step2Design
                input={inputData}
                onChange={(updated) => setInputData((prev) => ({ ...prev, ...updated }))}
                onBack={() => setCurrentStep(1)}
                onGenerate={handleTriggerGenerate}
                user={user}
                onOpenUpgradeModal={() => setShowPlansModal(true)}
              />
            )}

            {currentStep === 3 && (
              <Step3Generating
                title={inputData.title}
                pageCount={inputData.pageCount}
              />
            )}

            {currentStep === 4 && currentEbook && (
              <Step4Editor
                ebook={currentEbook}
                onChangeEbook={handleUpdateCurrentEbook}
                onNextExport={() => setCurrentStep(5)}
              />
            )}

            {currentStep === 5 && currentEbook && (
              <Step5Export
                ebook={currentEbook}
                onBackToEditor={() => setCurrentStep(4)}
                onSaveToLibrary={handleSaveToLibrary}
                isReadOnly={isReadOnlyEbook}
              />
            )}
          </main>
        </>
      )}

      {/* Offscreen Container for Direct PDF Downloads from Library Modal */}
      {directDownloadEbook && (() => {
        const is169 = directDownloadEbook.aspectRatio === '16:9';
        const is45 = directDownloadEbook.aspectRatio === '4:5';
        const dWidth = is169 ? 1123 : 794;
        const dHeight = is169 ? 632 : is45 ? 992 : 1123;

        return (
          <div
            id="ebook-direct-download-root"
            className="fixed top-0 -left-[9999px] pointer-events-none opacity-0 z-[-9999]"
            style={{ width: `${dWidth}px`, minWidth: `${dWidth}px`, maxWidth: `${dWidth}px`, boxSizing: 'border-box' }}
          >
            {directDownloadEbook.pages.map((page, idx) => (
              <div
                key={page.id || idx}
                id={`direct-export-pdf-page-${idx}`}
                className="ebook-page shrink-0 overflow-hidden"
                style={{
                  width: `${dWidth}px`,
                  height: `${dHeight}px`,
                  minWidth: `${dWidth}px`,
                  maxWidth: `${dWidth}px`,
                  minHeight: `${dHeight}px`,
                  maxHeight: `${dHeight}px`,
                  boxSizing: 'border-box',
                }}
              >
                <EbookPageCanvas ebook={directDownloadEbook} page={page} isPdfExport={true} />
              </div>
            ))}
          </div>
        );
      })()}

      {/* Modals */}
      <PlanSelectionModal
        isOpen={showPlansModal}
        user={user}
        onSelectPlan={handleSelectPlan}
        onClose={() => setShowPlansModal(false)}
      />

      <MyEbooksModal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        ebooks={savedEbooks}
        onOpenEbook={handleOpenSavedEbook}
        onDownloadPdfDirectly={handleDirectDownloadPdf}
        onDeleteEbook={handleDeleteFromLibrary}
        onNewEbook={handleStartNewEbook}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onOpenPlans={() => setShowPlansModal(true)}
        onUpdateUserName={handleUpdateUserName}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(acc) => setUser(acc)}
      />
    </div>
  );
}
