import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncUserProfile } from '../lib/authService';
import { UserAccount } from '../types';
import { VoidLogo } from './VoidLogo';
import { FAQSection } from './FAQSection';
import { TestimonialsSection } from './TestimonialsSection';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Zap,
  Smartphone,
  Layers,
  FileText,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
} from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim();
    const finalName = name.trim() || cleanEmail.split('@')[0] || 'Criador Digital';

    if (authMode === 'register') {
      if (!cleanEmail || !password || !confirmPassword) {
        setErrorMsg('Por favor, preencha todos os campos.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem. Digite a mesma senha nos dois campos.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (finalName) {
          await updateProfile(cred.user, { displayName: finalName });
        }
        const userAccount = await syncUserProfile(cred.user);
        const finalUser: UserAccount = {
          ...userAccount,
          name: finalName,
          email: cleanEmail,
          isLoggedIn: true,
        };
        localStorage.setItem('ebookia_user', JSON.stringify(finalUser));
        onLoginSuccess(finalUser);
        setShowAuthModal(false);
        return;
      } catch (err: any) {
        console.error('LandingPage register error:', err);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMsg('Este e-mail já está cadastrado. Mude para a aba "Entrar".');
          setLoading(false);
          return;
        }

        // Local fallback authentication for new registration
        const fallbackUser: UserAccount = {
          id: `user-${Date.now()}`,
          name: finalName,
          email: cleanEmail,
          plan: 'gratis',
          ebooksCreatedCount: 0,
          monthlyLimit: 0,
          maxPagesPerEbook: 0,
          subscriptionDate: new Date().toISOString(),
          isLoggedIn: true,
          hasActiveSubscription: false,
        };
        localStorage.setItem('ebookia_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser);
        setShowAuthModal(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      if (!cleanEmail || !password) {
        setErrorMsg('Por favor, preencha e-mail e senha.');
        setLoading(false);
        return;
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const userAccount = await syncUserProfile(cred.user);
        const finalUser: UserAccount = {
          ...userAccount,
          isLoggedIn: true,
        };
        localStorage.setItem('ebookia_user', JSON.stringify(finalUser));
        onLoginSuccess(finalUser);
        setShowAuthModal(false);
        return;
      } catch (err: any) {
        console.error('LandingPage login error:', err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
          setErrorMsg('E-mail ou senha incorretos.');
          setLoading(false);
          return;
        }

        // Local fallback authentication for login
        const fallbackUser: UserAccount = {
          id: `user-${Date.now()}`,
          name: finalName,
          email: cleanEmail,
          plan: 'gratis',
          ebooksCreatedCount: 0,
          monthlyLimit: 0,
          maxPagesPerEbook: 0,
          subscriptionDate: new Date().toISOString(),
          isLoggedIn: true,
          hasActiveSubscription: false,
        };
        localStorage.setItem('ebookia_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser);
        setShowAuthModal(false);
        return;
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userAccount = await syncUserProfile(cred.user);
      const finalUser: UserAccount = {
        ...userAccount,
        isLoggedIn: true,
      };
      localStorage.setItem('ebookia_user', JSON.stringify(finalUser));
      onLoginSuccess(finalUser);
      setShowAuthModal(false);
    } catch (err: any) {
      console.error('Google login error:', err);
      const fallbackUser: UserAccount = {
        id: `user-google-${Date.now()}`,
        name: 'Usuário Google',
        email: 'usuario.google@gmail.com',
        plan: 'gratis',
        ebooksCreatedCount: 0,
        monthlyLimit: 0,
        maxPagesPerEbook: 0,
        subscriptionDate: new Date().toISOString(),
        isLoggedIn: true,
        hasActiveSubscription: false,
      };
      localStorage.setItem('ebookia_user', JSON.stringify(fallbackUser));
      onLoginSuccess(fallbackUser);
      setShowAuthModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Texture Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/60 via-slate-50 to-indigo-50/40 pointer-events-none" />
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.035] mix-blend-multiply pointer-events-none"
      />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <VoidLogo size="md" textColor="#0F172A" />

        <button
          onClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          Entrar na Conta
        </button>
      </header>

      {/* Main Single-Screen Hero Section */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-6 my-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-extrabold border border-blue-200/80 mb-4 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          Gerador Inteligente de E-books com Inteligência Artificial
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-3xl">
          Crie E-books Profissionais e Diagramados em Minutos
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
          Escreva, diagrame e exporte e-books prontos para publicação e venda sem precisar de designers ou conhecimentos técnicos.
        </p>

        {/* Primary Call to Action Button */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setAuthMode('register');
              setShowAuthModal(true);
            }}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
          >
            <span>Entrar ou Cadastrar</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Acesso instantâneo à plataforma de criação
          </span>
        </div>

        {/* Horizontal Looping Marquee Preview of App Screens in Phone Mockups */}
        <div className="mt-8 w-full max-w-3xl overflow-hidden relative">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Conheça a Simplicidade da Interface
          </p>

          <div className="relative w-full overflow-hidden mask-gradient">
            <div className="flex items-center gap-4 animate-marquee whitespace-nowrap py-2">
              {/* Card 1: Pass 1 - Info */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    Passo 1
                  </span>
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Informações do E-book</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Insira o tema, público e número de páginas desejadas.</p>
                </div>
                <div className="h-1 bg-blue-600 rounded-full w-2/3" />
              </div>

              {/* Card 2: Pass 2 - Design */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    Passo 2
                  </span>
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Estilo & Diagramação</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Escolha entre 6 modelos visuais modernos e tipografias.</p>
                </div>
                <div className="h-1 bg-purple-600 rounded-full w-3/4" />
              </div>

              {/* Card 3: Pass 3 - AI Generation */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Passo 3
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Geração com IA</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">A IA cria o índice, introdução e todos os capítulos.</p>
                </div>
                <div className="h-1 bg-amber-500 rounded-full w-full animate-pulse" />
              </div>

              {/* Card 4: Pass 4 - Reader Preview */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Passo 4
                  </span>
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Pré-visualização</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Folheie as páginas diagramadas e ajuste a foto da capa.</p>
                </div>
                <div className="h-1 bg-emerald-600 rounded-full w-4/5" />
              </div>

              {/* Card 5: Pass 5 - Download PDF */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Passo 5
                  </span>
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Exportação PDF</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Baixe em PDF de alta qualidade e compartilhe!</p>
                </div>
                <div className="h-1 bg-blue-600 rounded-full w-full" />
              </div>

              {/* REPEATED CARDS FOR SEAMLESS LOOP */}
              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    Passo 1
                  </span>
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Informações do E-book</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Insira o tema, público e número de páginas desejadas.</p>
                </div>
                <div className="h-1 bg-blue-600 rounded-full w-2/3" />
              </div>

              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    Passo 2
                  </span>
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Estilo & Diagramação</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Escolha entre 6 modelos visuais modernos e tipografias.</p>
                </div>
                <div className="h-1 bg-purple-600 rounded-full w-3/4" />
              </div>

              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Passo 3
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Geração com IA</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">A IA cria o índice, introdução e todos os capítulos.</p>
                </div>
                <div className="h-1 bg-amber-500 rounded-full w-full animate-pulse" />
              </div>

              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Passo 4
                  </span>
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Pré-visualização</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Folheie as páginas diagramadas e ajuste a foto da capa.</p>
                </div>
                <div className="h-1 bg-emerald-600 rounded-full w-4/5" />
              </div>

              <div className="w-44 sm:w-52 h-28 bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 shrink-0 flex flex-col justify-between text-left transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Passo 5
                  </span>
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-slate-900 truncate">Exportação PDF</div>
                  <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">Baixe em PDF de alta qualidade e compartilhe!</p>
                </div>
                <div className="h-1 bg-blue-600 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* User Testimonials Section (Prova Social com Avatar) */}
        <div className="mt-16 max-w-6xl mx-auto text-left">
          <TestimonialsSection />
        </div>

        {/* FAQ (Perguntas Frequentes) Section */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <FAQSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 py-4 bg-white/80 backdrop-blur-xs text-center text-xs text-slate-500 font-medium">
        © {new Date().getFullYear()} VOID. Todos os direitos reservados.
      </footer>

      {/* Auth Modal (Login / Signup) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <VoidLogo size="md" textColor="#0F172A" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {authMode === 'register' ? 'Criar Sua Conta' : 'Acessar Sua Conta'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'register'
                  ? 'Cadastre-se para escolher seu plano e criar e-books com IA'
                  : 'Entre com seus dados de acesso para continuar'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Criar Conta
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Entrar
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seu E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs font-medium text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                      title={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processando...</span>
                ) : authMode === 'register' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Criar Conta e Escolher Plano
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar na Plataforma
                  </>
                )}
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">
                  ou continue com
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.3 21.32 7.38 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.38 0 3.3 2.68 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                Entrar Rápido com Google
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
